import {app, dialog, ipcMain, session } from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';
import {platform} from 'node:process';
import path from 'path';
import fs from 'fs';

/**
 * Prevent electron from running multiple instances.
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);

/**
 * Disable Hardware Acceleration to save more system resources.
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/latest/api/app#event-activate-macos Event: 'activate'.
 */
app.on('activate', restoreOrCreateWindow);

async function handleFileOpen (event, args = {}) {
  const { canceled, filePaths } = await dialog.showOpenDialog(args);
  if (!canceled) {
    return filePaths.map((filePath)=>{
      return {path: filePath, name: path.parse(filePath).base};
    });
  }
}

async function handleFileRead (event, filePath) {
  return new Promise((resolve, reject)=>{
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if(err){
        reject('An error ocurred reading the file :' + err.message);
        return;
      }
      resolve(data);
    });
  });

}

function startListen(){
  ipcMain.handle('dialog:openFile', handleFileOpen);
  ipcMain.handle('dialog:readFile', handleFileRead);
}
/**
 * Create the application window when the background process is ready.
 */
app
  .whenReady()
  .then(restoreOrCreateWindow)
  .then(startListen)
  .catch(e => console.error('Failed create window:', e));

/**
 * Install Vue.js or any other extension in development mode only.
 * Note: You must install `electron-devtools-installer` manually
 */
if (import.meta.env.DEV) {
  const vueDevToolsPath = 'C:\\Users\\nors-\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\nhdogjmejiglipccpnnnanhbledajbpd\\6.5.0_0';
  app
    .whenReady().then(async () => {
      await session.defaultSession.loadExtension(vueDevToolsPath);
    })
    .catch(e => console.error('Failed install extension:', e));
}

/**
 * Check for app updates, install it in background and notify user that new version was installed.
 * No reason run this in non-production build.
 * @see https://www.electron.build/auto-update.html#quick-setup-guide
 *
 * Note: It may throw "ENOENT: no such file app-update.yml"
 * if you compile production app without publishing it to distribution server.
 * Like `npm run compile` does. It's ok 😅
 */
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(module => {
      const autoUpdater =
        module.autoUpdater ||
        // @ts-expect-error Hotfix for https://github.com/electron-userland/electron-builder/issues/7338
        (module.default.autoUpdater as (typeof module)['autoUpdater']);
      return autoUpdater.checkForUpdatesAndNotify();
    })
    .catch(e => console.error('Failed check and install updates:', e));
}
