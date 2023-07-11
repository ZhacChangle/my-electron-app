// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
const { contextBridge, ipcRenderer } = require("electron");
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

// contextBridge 接口将特权接口暴露给渲染器
contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // 创建一个通道
  // 主进程和渲染进程可以通过这个通道进行通讯
  ping: () => ipcRenderer.invoke("ping"),
  // 除函数之外，我们也可以暴露变量
});
