import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import { ipcMainOn, isDev } from './util.js';
import { getPreloadPath, getUIPath } from './pathResolver.js';
import { createTray } from './tray.js';

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    frame: false,
  });
  
  Menu.setApplicationMenu(null);
  
  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123');
  } else {
    mainWindow.loadFile(getUIPath());
  }

  ipcMainOn('sendFrameAction', (payload) => {
    switch (payload) {
      case 'CLOSE':
        mainWindow.close();
        break;
      case 'MAXIMIZE':
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize();
        } else {
          mainWindow.maximize();
        }
        break;
      case 'MINIMIZE':
        mainWindow.minimize();
        break;
    }
  });

  ipcMain.handle('getIsMaximized', () => {
    return mainWindow.isMaximized();
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-state-changed', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-state-changed', false);
  });

  createTray(mainWindow);
  handleCloseEvents(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on('close', (e) => {
    if (willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on('before-quit', () => {
    willClose = true;
  });

  mainWindow.on('show', () => {
    willClose = false;
  });
}
