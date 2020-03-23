const { ipcRenderer, remote } = require('electron');

window.onload=function(){
  alert(document.body.outerHTML)
const sharedObject=remote.getGlobal('sharedObject');
ipcRenderer.sendTo(sharedObject.mainId, 'bilibili-load', document.body.outerHTML).
}
