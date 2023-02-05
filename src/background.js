'use strict';

/* global __static */
import path from 'path';
import { app, ipcMain, protocol, BrowserWindow } from 'electron';
import ipc from './ipc';
import { autoUpdater } from 'electron-updater';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
const isDevelopment = process.env.NODE_ENV !== 'production';

let win;

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

function setupAutoUpdater() {
  ipcMain.on(ipc.CHECK_FOR_UPDATES, () => {
    autoUpdater.checkForUpdates();
  });
  ipcMain.on(ipc.QUIT_AND_INSTALL, () => {
    autoUpdater.quitAndInstall();
  });

  autoUpdater.on('error', (error) => {
    win.webContents.send(ipc.UPDATE_ERROR, error);
  });
  autoUpdater.on('checking-for-update', () => {
    win.webContents.send(ipc.CHECKING_FOR_UPDATE);
  });
  autoUpdater.on('update-available', () => {
    win.webContents.send(ipc.UPDATE_AVAILABLE);
  });
  autoUpdater.on('update-not-available', () => {
    win.webContents.send(ipc.UPDATE_NOT_AVAILABLE);
  });
  autoUpdater.on('update-progress', (progress) => {
    win.webContents.send(ipc.UPDATE_PROGRESS, progress);
  });
  autoUpdater.on('update-downloaded', (info) => {
    win.webContents.send(ipc.UPDATE_DOWNLOADED, info);
  });

  autoUpdater.checkForUpdates();
}

function createWindow() {
  win = new BrowserWindow({
    frame: false,
    minWidth: 1600,
    minHeight: 900,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__static, 'icon.png'),
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    win.loadURL('app://./index.html');

    setupAutoUpdater();
  }

  win.on('closed', () => {
    win = null;
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('ready', async () => {
  createWindow();
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
