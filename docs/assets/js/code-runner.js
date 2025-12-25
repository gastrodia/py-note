class CodeRunner {
    static instance = null;

    constructor() {
        if (CodeRunner.instance) {
            return CodeRunner.instance;
        }

        this.worker = null;
        this.isLoading = false;
        this.messageId = 0;
        this.pendingMessages = new Map();

        CodeRunner.instance = this;
    }
    static getInstance() {
        if (!CodeRunner.instance) {
            CodeRunner.instance = new CodeRunner();
        }
        return CodeRunner.instance;
    }

    /**
     * 初始化 Worker
     */
    initWorker() {
        if (this.worker) {
            return;
        }

        this.worker = new Worker('/assets/js/pyodide-worker.js');

        // 监听 Worker 消息
        this.worker.addEventListener('message', (event) => {
            const { type, id, data } = event.data;
            
            const pending = this.pendingMessages.get(id);
            if (pending) {
                this.pendingMessages.delete(id);
                if (data.success) {
                    pending.resolve(data);
                } else {
                    pending.reject(new Error(data.error));
                }
            }
        });

        // 监听 Worker 错误
        this.worker.addEventListener('error', (error) => {
            console.error('[CodeRunner] Worker 错误:', error);
        });
    }

    /**
     * 向 Worker 发送消息并等待响应
     */
    sendMessage(type, data = {}) {
        return new Promise((resolve, reject) => {
            this.initWorker();
            
            const id = this.messageId++;
            this.pendingMessages.set(id, { resolve, reject });

            this.worker.postMessage({
                type,
                id,
                data
            });
        });
    }

    /**
     * 更新输出区域内容
     * @param {HTMLElement} element - 输出元素
     * @param {string} type - 类型 (loading, success, error)
     * @param {string} message - 消息内容 (可以是 HTML)
     */
    writeOutput(element, type, message) {
        element.style.display = 'block';
        element.innerHTML = `<div class="output-${type}">${message}</div>`;
    }

    /**
     * 初始化 Pyodide（在 Worker 中）
     * @returns {Promise}
     */
    async initPyodide(outputElement) {
        if (this.isLoading) {
            // 等待加载完成
            while (this.isLoading) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return;
        }

        this.isLoading = true;
        try {
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

            // 在 Worker 中初始化 Pyodide（不会阻塞主线程！）
            await this.sendMessage('init');

            // 根据缓存状态显示不同的提示
            let okText = 'Python 环境加载完成！';

            // 如果浏览器支持 SW 但当前页面未被接管，提示用户刷新
            if (!hasCachedController && 'serviceWorker' in navigator) {
                okText += '<br><small>💡 提示：刷新页面后加载速度将提升 10 倍！</small>';
            }

            // 发送加载成功消息
            if (window.alert$) {
                window.alert$.next('Python 环境加载完成！');
            }
            this.writeOutput(outputElement, 'loading', okText);
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
            // 确保 Pyodide 已初始化
            await this.initPyodide(outputElement);

            this.writeOutput(outputElement, 'loading', '正在执行代码...');

            // 在 Worker 中运行代码（不会阻塞主线程！）
            try {
                const result = await this.sendMessage('run', { code });
                const output = result.output || '';

                if (output.trim()) {
                    this.writeOutput(outputElement, 'success', `<pre>${this.escapeHtml(output)}</pre>`);
                } else {
                    this.writeOutput(outputElement, 'success', '代码执行成功（无输出）');
                }
            } catch (err) {
                // 解析并简化 Python 错误信息
                const simplifiedError = this.parsePythonError(err.message);
                this.writeOutput(outputElement, 'error', `<strong>执行错误:</strong>\n<pre>${this.escapeHtml(simplifiedError)}</pre>`);
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
     * 解析 Python 错误信息，提取有意义的部分
     * @param {string} errorMessage - 完整的错误消息
     * @returns {string} - 简化后的错误信息
     */
    parsePythonError(errorMessage) {
        // 按行分割错误消息
        const lines = errorMessage.split('\n');
        
        // 提取最后一行错误信息（例如：IndexError: list index out of range）
        let lastErrorLine = '';
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i].trim();
            // 找到错误类型行（通常是 XxxError: ...）
            if (line && /^[A-Z]\w*Error:/.test(line)) {
                lastErrorLine = line;
                break;
            }
        }
        
        // 提取用户代码相关的错误行（在 <exec> 中的）
        const userCodeLines = [];
        let inUserCode = false;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            // 检测到用户代码的开始
            if (line.includes('File "<exec>"')) {
                inUserCode = true;
                userCodeLines.push(line);
            } else if (inUserCode) {
                // 如果遇到错误类型行，添加后停止
                if (trimmedLine && /^[A-Z]\w*Error:/.test(trimmedLine)) {
                    userCodeLines.push(line);
                    break;
                }
                // 如果是下一个 File，说明离开了用户代码
                else if (line.includes('File "') && !line.includes('File "<exec>"')) {
                    inUserCode = false;
                } else {
                    userCodeLines.push(line);
                }
            }
        }
        
        // 构建简化的错误信息
        if (userCodeLines.length > 0) {
            return userCodeLines.join('\n');
        }
        
        // 如果没有找到用户代码部分，至少返回错误类型
        if (lastErrorLine) {
            return lastErrorLine;
        }
        
        // 如果都没找到，返回原始消息
        return errorMessage;
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
