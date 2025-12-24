// Pyodide Web Worker
let pyodideInstance = null;
let isLoading = false;

/**
 * 初始化 Pyodide
 */
async function initPyodide() {
    if (pyodideInstance) {
        return { success: true };
    }

    if (isLoading) {
        // 等待加载完成
        while (isLoading) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return { success: true };
    }

    isLoading = true;
    try {
        // 导入 Pyodide
        self.importScripts('https://cdn.jsdelivr.net/npm/pyodide/pyodide.js');

        // 加载 Pyodide
        pyodideInstance = await loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/npm/pyodide/"
        });

        return { success: true };
    } catch (error) {
        return { 
            success: false, 
            error: error.message 
        };
    } finally {
        isLoading = false;
    }
}

/**
 * 运行 Python 代码
 */
async function runPython(code) {
    if (!pyodideInstance) {
        return {
            success: false,
            error: 'Pyodide 未初始化'
        };
    }

    try {
        // 捕获输出
        let output = '';
        pyodideInstance.setStdout({
            batched: (text) => { output += text + '\n'; }
        });
        pyodideInstance.setStderr({
            batched: (text) => { output += 'Error: ' + text + '\n'; }
        });

        // 运行代码
        const result = await pyodideInstance.runPythonAsync(code);

        // 如果代码有返回值且不是 None，也显示出来
        if (result !== undefined && result !== null && String(result) !== 'None') {
            output += '\n返回值: ' + String(result);
        }

        return {
            success: true,
            output: output
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * 处理消息
 */
self.addEventListener('message', async (event) => {
    const { type, id, data } = event.data;

    switch (type) {
        case 'init':
            const initResult = await initPyodide();
            self.postMessage({
                type: 'init',
                id,
                data: initResult
            });
            break;

        case 'run':
            const runResult = await runPython(data.code);
            self.postMessage({
                type: 'run',
                id,
                data: runResult
            });
            break;

        default:
            self.postMessage({
                type: 'error',
                id,
                data: { error: '未知的消息类型: ' + type }
            });
    }
});

