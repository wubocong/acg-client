const { ipcRenderer, remote } = require('electron');

window.onload = function () {
  const sharedObject = remote.getGlobal('sharedObject');
  ipcRenderer.sendTo(sharedObject.mainId, 'bilibili-load', document.body.outerHTML);
}
