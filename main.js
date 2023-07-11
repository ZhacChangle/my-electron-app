/**
 * 1.app 模块控制应用程序的生命周期
 * 2.BrowserWindow 模块创建和管理应用程序窗口
 */
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
// 热加载
try {
  require("electron-reloader")(module, {});
} catch (_) {}

const createWindow = () => {
  // 创建一个 BrowserWindow 实例
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // 将脚本附加到渲染器，主进程(Node) 跟渲染器不属于同一个进程所以无法访问渲染器的 window 跟 document
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // 当前窗口加载的文件
  win.loadFile("index.html");
  // 打开调试窗口
  win.webContents.openDevTools();
};

// ready 事件触发之后才能创建浏览器窗口
app.whenReady().then(() => {
  // 通过通道 ping 向渲染进程发送消息
  ipcMain.handle("ping", () => "pong");
  createWindow();
  // macOS 应用在没有打开任何窗口的情况下也继续运行
  // 没有窗口的情况下，应用程序被激活创建一个新的窗口
  // 由于 ready 事件触发之后才能创建浏览器窗口，所以 activate 的事件监听放在 whenReady 的 then callback 中
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Windows 和 Linux 关闭所有窗口通常会完全退出一个应用程序
app.on("window-all-closed", () => {
  // 非 macOS 平台应用程序退出
  if (process.platform !== "darwin") app.quit();
});
