// 等待页面加载完成
document.addEventListener('DOMContentLoaded', async () => {
    // 加载Pyodide
    const pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/npm/pyodide/pyodide.min.js",
      packages: ['numpy', 'pandas'] // 预装常用库
    });
  
    // 找到所有带playground标记的Python代码块
    document.querySelectorAll('pre code.language-python.playground').forEach(block => {
      // 创建运行按钮
      const button = document.createElement('button');
      button.innerText = '运行代码';
      button.style.cssText = 'margin: 8px; padding: 4px 12px; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer;';
      
      // 创建输出容器
      const output = document.createElement('div');
      output.style.cssText = 'margin: 8px 0; padding: 8px; background: #f5f5f5; border-radius: 4px; font-family: monospace; white-space: pre-wrap;';
      
      // 插入按钮和输出容器
      const pre = block.closest('pre');
      pre.parentNode.insertBefore(button, pre);
      pre.parentNode.insertBefore(output, pre.nextSibling);
  
      // 按钮点击事件：执行代码
      button.addEventListener('click', async () => {
        try {
          output.innerText = '运行中...';
          // 获取代码内容
          const code = block.innerText;
          // 执行Python代码
          const result = await pyodide.runPythonAsync(code);
          // 输出结果（如果有返回值）
          output.innerText = result || '执行完成！';
        } catch (e) {
          // 捕获错误
          output.innerText = `错误：${e.message}`;
          output.style.color = 'red';
        }
      });
    });
  });