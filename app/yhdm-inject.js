const { ipcRenderer, remote } = require('electron');

ipcRenderer.send('message', 'window href: ' + window.location.href);

window.onload = function() {
  const sharedObject = remote.getGlobal('sharedObject');
  const iframes = Array.from(document.querySelectorAll('iframe'));
  let iframe;
  ipcRenderer.send('message', 'iframes: ' + iframes.length);

  if (iframes.length > 1)
    iframe = iframes.find(iframe => iframe.src.includes('yhdm'));
  else iframe = iframes[0];

  ipcRenderer.send('message', 'content document: ' + iframe.contentDocument);

  const video = iframe.contentDocument.querySelector('video');

  ipcRenderer.send('message', 'video: ' + video);

  if (video) {
    ipcRenderer.sendTo(sharedObject.mainId, 'yhdm-video-src', video.src);
    ipcRenderer.send('message', 'video src: ' + video.src);
  } else {
    ipcRenderer.send('load-yhdm-animation', iframe.src);
  }
  ipcRenderer.send('message', 'end');
};
