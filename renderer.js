const information = document.getElementById("info");
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`;

const func = async () => {
  // 向主进程发送信息
  const response = await window.versions.ping();
  console.log(response);
};
func();
