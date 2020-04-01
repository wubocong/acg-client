/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain, net } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fetch from 'node-fetch';
import MenuBuilder from './menu';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

global.sharedObject = {};
let mainWindow: BrowserWindow | null = null;
let bilibiliWindow: BrowserWindow | null = null;
let yhdmWindow: BrowserWindow | null = null;
// let bibililiCookies: Array<object> | null = null;
let bilibiliInfo: { userId: string } = { userId: '' };

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

function registerBilibili() {
  ipcMain.handle('bilibili-login', () => {
    if (bilibiliWindow) return;
    bilibiliWindow = new BrowserWindow({
      width: 1024,
      height: 728,
      webPreferences: {
        devTools: false
      }
    });
    global.sharedObject.bilibiliId = bilibiliWindow.webContents.id;

    bilibiliWindow.loadURL('https://passport.bilibili.com/login');
    const onlogin = (_: any, url: string) => {
      if (url === 'https://www.bilibili.com/') {
        bilibiliWindow?.webContents.session.cookies
          .get({ url: 'https://www.bilibili.com/' })
          .then((cookies = []) => {
            mainWindow?.webContents.send('bilibili-cookies', cookies);
            bilibiliWindow?.hide();
            bilibiliWindow?.webContents.removeListener('did-navigate', onlogin);

            // bibililiCookies = cookies;
            // bilibiliInfo.userId = cookies.find(
            //   cookie => cookie.name === 'DedeUserID'
            // ).value;
          });
      }
    };
    bilibiliWindow.webContents.on('did-navigate', onlogin);
    mainWindow?.on('close', () => {
      bilibiliWindow?.close();
    });
  });
}

// function bibililiGetFollowing() {
//   const request = net.request({
//     url:
//       'https://api.bilibili.com/x/relation/followings?vmid=' +
//       bibililiCookies.space.find(cookie => cookie.name === 'DedeUserID').value,
//     method: 'GET',
//     session: bilibiliWindow?.webContents.session
//   });
//   request.end();
//   request.on('response', response => {
//     response.setEncoding('utf8');;
//     response.on('data', data => {
//       console.log(data.toString());
//     });
//   });
//   fetch(
//     'https://api.bilibili.com/x/relation/followings?vmid=' + bilibiliInfo.userId
//   )
//     .then(res => res.json())
//     .then(json => {
//       mainWindow?.webContents.send('bilibili-followings', json.data.list);
//     });
// }

function yhdm() {
  ipcMain.on('message', (_, text) => console.log(text));
  ipcMain.on('load-yhdm-animation', (_, url) => {
    if (yhdmWindow) {
      yhdmWindow.close();
    }
    yhdmWindow = new BrowserWindow({
      // show: false,
      width: 800,
      height: 600,
      webPreferences: {
        webSecurity: false,
        preload: path.resolve(__dirname, 'yhdm-inject.js')
      }
    });
    yhdmWindow.on('closed', () => {
      yhdmWindow = null;
    });

    yhdmWindow.loadURL(url);
  });
}
const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    webPreferences:
      process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true'
        ? {
            nodeIntegration: true,
            webSecurity: false
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js')
          }
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      if (/^https?:\/\/[^.]+\.bilivideo.com/.test(details.url)) {
        details.requestHeaders['Referer'] = 'https://www.bilibili.com/';
      }
      callback({ requestHeaders: details.requestHeaders });
    }
  );
  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
  registerBilibili();

  yhdm();
  global.sharedObject.mainId = mainWindow.webContents.id;
};
// 允许访问iframe
app.commandLine.appendSwitch('disable-site-isolation-trials');
/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', createWindow);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
