const { ipcRenderer, remote } = require('electron');

ipcRenderer.send('message', `window href: ${window.location.href}`);

window.onload = function() {
  const sharedObject = remote.getGlobal('sharedObject');
  const iframes = Array.from(document.querySelectorAll('iframe'));
  let targetIframe;
  ipcRenderer.send('message', `iframes: ${iframes.length}`);

  if (iframes.length > 1)
    targetIframe = iframes.find(iframe => iframe.src.includes('yhdm'));
  else [targetIframe] = iframes;

  ipcRenderer.send(
    'message',
    `content document: ${targetIframe.contentDocument}`
  );

  const video = targetIframe.contentDocument.querySelector('video');

  ipcRenderer.send('message', `video: ${video}`);

  if (video) {
    if (/^blob:/.test(video.src)) {
      ipcRenderer.sendTo(
        sharedObject.mainId,
        'yhdm-iframe-src',
        targetIframe.src
      );
    } else {
      ipcRenderer.sendTo(sharedObject.mainId, 'yhdm-video-src', video.src);
    }
    ipcRenderer.send('message', `video src: ${video.src}`);
  } else {
    ipcRenderer.send('load-yhdm-animation', targetIframe.src);
  }
  ipcRenderer.send('message', 'end');
};
