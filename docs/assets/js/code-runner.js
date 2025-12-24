class CodeRunner {
    static instance = null;
    
    constructor() {
        if (CodeRunner.instance) {
            return CodeRunner.instance;
        }
        
        this.pyodideInstance = null;
        this.isLoading = false;
        this.serviceWorkerReady = false;
        
        CodeRunner.instance = this;
        
        // 注册 Service Worker
        this.registerServiceWorker();
    }
    static getInstance() {
        if (!CodeRunner.instance) {
            CodeRunner.instance = new CodeRunner();
        }
        return CodeRunner.instance;
    }
    
    /**
     * 注册 Service Worker 以缓存 Pyodide 资源
     */
    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.warn('[CodeRunner] 当前浏览器不支持 Service Worker');
            return false;
        }
        
        try {
            // 先测试 sw.js 是否可访问
            const swPath = '/assets/js/sw.js';
            try {
                const testResponse = await fetch(swPath, { method: 'HEAD' });
                if (!testResponse.ok) {
                    console.error('[CodeRunner] ✗ 无法访问 sw.js 文件，HTTP 状态:', testResponse.status);
                    console.error('[CodeRunner] 请确保 sw.js 在网站根目录');
                    return false;
                }
            } catch (fetchError) {
                console.error('[CodeRunner] ✗ 无法访问 sw.js 文件:', fetchError.message);
                console.error('[CodeRunner] 请在浏览器中访问', window.location.origin + swPath, '检查文件是否存在');
                return false;
            }
            
            console.log('[CodeRunner] ⏳ 正在注册 Service Worker...');
            const registration = await navigator.serviceWorker.register(swPath, {
                scope: '/assets/js/'
            });
            
            console.log('[CodeRunner] ✓ Service Worker 注册成功:', registration.scope);
            console.log('[CodeRunner] 注册对象:', registration);
            
            // 等待 Service Worker 激活
            await navigator.serviceWorker.ready;
            console.log('[CodeRunner] ✓ Service Worker 已就绪');
            
            // 检查是否已经有 controller（页面是否被 Service Worker 接管）
            if (navigator.serviceWorker.controller) {
                this.serviceWorkerReady = true;
                console.log('[CodeRunner] ✓ Service Worker 已接管页面，资源将从缓存加载');
            } else {
                // 首次访问，Service Worker 尚未接管页面
                // 这是正常的，需要刷新页面后才能启用缓存
                this.serviceWorkerReady = false;
                console.log('[CodeRunner] ℹ Service Worker 已注册但未接管当前页面');
                console.log('[CodeRunner] 💡 刷新页面（F5）后将启用缓存加速');
            }
            
            return true;
        } catch (error) {
            console.error('[CodeRunner] ✗ Service Worker 注册失败:', error);
            console.error('[CodeRunner] 错误详情:', error.message);
            return false;
        }
    }
    
    /**
     * 清理缓存（用于调试或强制更新）
     * 可在浏览器控制台调用: CodeRunner.getInstance().clearCache()
     */
    async clearCache() {
        if (!('serviceWorker' in navigator)) {
            console.warn('当前浏览器不支持 Service Worker');
            return false;
        }
        
        try {
            const registration = await navigator.serviceWorker.ready;
            const messageChannel = new MessageChannel();
            
            return new Promise((resolve) => {
                messageChannel.port1.onmessage = (event) => {
                    if (event.data.success) {
                        console.log('✓ Pyodide 缓存已清理');
                        resolve(true);
                    }
                };
                
                registration.active.postMessage(
                    { type: 'CLEAR_CACHE' },
                    [messageChannel.port2]
                );
            });
        } catch (error) {
            console.error('清理缓存失败:', error);
            return false;
        }
    }
    
    /**
     * 查看缓存状态
     * 可在浏览器控制台调用: CodeRunner.getInstance().getCacheInfo()
     */
    async getCacheInfo() {
        if (!('caches' in window)) {
            console.warn('当前浏览器不支持 Cache API');
            return null;
        }
        
        try {
            const cache = await caches.open('pyodide-cache-v1');
            const keys = await cache.keys();
            
            console.log('=== Pyodide 缓存状态 ===');
            console.log(`共缓存 ${keys.length} 个文件：`);
            
            let totalSize = 0;
            for (const request of keys) {
                const response = await cache.match(request);
                if (response) {
                    const blob = await response.blob();
                    const size = blob.size;
                    totalSize += size;
                    console.log(`  ✓ ${request.url.split('/').pop()} (${(size / 1024 / 1024).toFixed(2)} MB)`);
                }
            }
            
            console.log(`总大小: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
            console.log('========================');
            
            return {
                count: keys.length,
                totalSize: totalSize,
                files: keys.map(k => k.url)
            };
        } catch (error) {
            console.error('获取缓存信息失败:', error);
            return null;
        }
    }
    
    /**
     * 动态加载 Pyodide 脚本
     * @returns {Promise}
     */
    async loadPyodideScript() {
        console.log('[CodeRunner] 准备加载 pyodide.js...');
        
        // 如果支持 Service Worker，等待它准备好
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.ready;
                console.log('[CodeRunner] Service Worker 已就绪，开始加载 pyodide.js');
            } catch (e) {
                console.warn('[CodeRunner] Service Worker 等待失败，继续加载:', e);
            }
        }
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/pyodide/pyodide.js';
            script.onload = () => {
                console.log('[CodeRunner] ✓ pyodide.js 加载完成');
                resolve();
            };
            script.onerror = (error) => {
                console.error('[CodeRunner] ✗ pyodide.js 加载失败:', error);
                reject(error);
            };
            document.head.appendChild(script);
        });
    }

    /**
     * 更新输出区域内容
     * @param {HTMLElement} element - 输出元素
     * @param {string} type - 类型 (loading, success, error)
     * @param {string} message - 消息内容 (可以是 HTML)
     */
    writeOutput(element, type, message) {
        requestIdleCallback(() => {
            element.style.display = 'block';
            element.innerHTML = `<div class="output-${type}">${message}</div>`;
        })
    }
    
    /**
     * 初始化 Pyodide
     * @returns {Promise}
     */
    async initPyodide(outputElement) {
        if (this.pyodideInstance) return this.pyodideInstance;
        if (this.isLoading) {
            // 等待加载完成
            while (this.isLoading) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.pyodideInstance;
        }
        
        this.isLoading = true;
        try {
            // 动态加载 Pyodide 脚本（如果尚未加载）
            if (typeof loadPyodide === 'undefined') {
                await this.loadPyodideScript();
            }
            
            // 检查是否启用了缓存
            const hasCachedController = navigator.serviceWorker && navigator.serviceWorker.controller;
            
            const loadText = hasCachedController
                ? '正在加载 Python 运行环境（从缓存加载，速度更快）...' 
                : '正在加载 Python 运行环境（首次加载或未启用缓存）...';
            
            // 使用 alert$ Subject 发送加载状态
            if (window.alert$) {
                window.alert$.next(loadText);
            }
            this.writeOutput(outputElement, 'loading', loadText);
            
            this.pyodideInstance = await loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/npm/pyodide/"
            });


            // 根据缓存状态显示不同的提示
            let okText = 'Python 环境加载完成！';
            
            if (!hasCachedController && this.serviceWorkerReady) {
                okText += '<br><small>💡 提示：刷新页面后加载速度将提升 10 倍！</small>';
            }
            
            // 发送加载成功消息
            if (window.alert$) {
                window.alert$.next('Python 环境加载完成！');
            }
            this.writeOutput(outputElement, 'loading', okText);
            
            return this.pyodideInstance;
        } catch (error) {
            const errorText = 'Python 环境加载失败: ' + error.message;
            
            console.error('Pyodide 加载失败:', error);
            
            // 发送错误消息
            if (window.alert$) {
                window.alert$.next(errorText);
            }
            this.writeOutput(outputElement, 'error', errorText);
            
            throw error;
        } finally {
            this.isLoading = false;
            this.getCacheInfo()
        }
    }
    
    /**
     * 运行 Python 代码
     * @param {string} code - Python 代码
     * @param {HTMLElement} outputElement - 输出元素
     * @param {HTMLButtonElement} button - 运行按钮
     */
    async runPythonCode(code, outputElement, button) {
        // 添加运行状态
        button.classList.add('running');
        button.disabled = true;
        button.title = '运行中...';
        
        try {
            const pyodide = await this.initPyodide(outputElement);
            
            // 捕获输出
            let output = '';
            pyodide.setStdout({
                batched: (text) => { output += text + '\n'; }
            });
            pyodide.setStderr({
                batched: (text) => { output += 'Error: ' + text + '\n'; }
            });
        
            this.writeOutput(outputElement, 'loading', '正在执行代码...');

            // 运行代码
            try {
                const result = await pyodide.runPythonAsync(code);
                
                // 如果代码有返回值且不是 None，也显示出来
                if (result !== undefined && result !== null && String(result) !== 'None') {
                    output += '\n返回值: ' + String(result);
                }
                
                if (output.trim()) {
                    this.writeOutput(outputElement, 'success', `<pre>${this.escapeHtml(output)}</pre>`);
                } else {
                    this.writeOutput(outputElement, 'success', '代码执行成功（无输出）');
                }
            } catch (err) {
                this.writeOutput(outputElement, 'error', `<strong>执行错误:</strong>\n<pre>${this.escapeHtml(err.message)}</pre>`);
            }
        } catch (err) {
            this.writeOutput(outputElement, 'error', `<strong>初始化错误:</strong>\n<pre>${this.escapeHtml(err.message)}</pre>`);
        } finally {
            // 恢复按钮状态
            button.classList.remove('running');
            button.disabled = false;
            button.title = '在浏览器中运行此 Python 代码';
        }
    }
    
    /**
     * HTML 转义
     * @param {string} text - 需要转义的文本
     * @returns {string}
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * 为代码块添加运行按钮
     */
    addRunButtons() {
        // Material for MkDocs 使用 div.language-python 包裹代码块
        const codeContainers = document.querySelectorAll('div.language-python, div.highlight-python, .highlight.language-python');
        
        codeContainers.forEach((container, index) => {
            // 检查是否已经添加过按钮
            if (container.querySelector('.md-code__run')) {
                return;
            }
            
            // 查找 pre 和 code 元素
            const preElement = container.querySelector('pre');
            const codeElement = container.querySelector('code');
            
            if (!preElement || !codeElement) {
                return;
            }
            
            // 查找或创建导航容器
            let navElement = container.querySelector('nav.md-code__nav');
            if (!navElement) {
                navElement = document.createElement('nav');
                navElement.className = 'md-code__nav';
                container.insertBefore(navElement, preElement);
            }
            
            // 创建运行按钮
            const runButton = document.createElement('button');
            runButton.className = 'md-code__run';
            runButton.title = '在浏览器中运行此 Python 代码';
            
        
            
            // 创建输出区域（放在代码块容器下方）
            const outputDiv = document.createElement('div');
            outputDiv.className = 'code-output';
            outputDiv.style.display = 'none';
            
            // 添加按钮点击事件
            runButton.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                // 提取纯文本代码（去除 HTML 标签和行号）
                const code = codeElement.textContent || codeElement.innerText;
                await this.runPythonCode(code, outputDiv, runButton);
            });
            
            // 将运行按钮插入到导航栏（复制按钮前面）
            navElement.insertBefore(runButton, navElement.firstChild);
            
            // 将输出区域插入到代码块容器后面
            container.parentNode.insertBefore(outputDiv, container.nextSibling);
        });
    }
    
    /**
     * 初始化代码运行器
     */
    init() {
        // 页面加载完成后初始化
        document.addEventListener('DOMContentLoaded', () => {
            // 添加运行按钮
            this.addRunButtons();
            
            // 监听页面内容变化（适配 Material 主题的即时加载）
            if (typeof document$ !== 'undefined') {
                document$.subscribe(() => {
                    this.addRunButtons();
                });
            }
        });
    }
}

// 初始化单例实例
CodeRunner.getInstance().init();
