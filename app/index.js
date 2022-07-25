const { app, BrowserWindow, ipcMain } = require('electron');
const { connect: databaseConnect } = require('./resources/database');
require('./commands/ping');
require('./commands/communication');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let config = {
  isProduction: null,
  baseUrl: null,
};

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1280,
    height: 768,
    title: "EMeTSy",
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  if (config.isProduction) {
    win.loadFile(config.baseUrl);
  } else {
    win.loadURL(config.baseUrl);
    win.webContents.openDevTools();
  }

  databaseConnect(config);

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  });
}

module.exports = {
  initApp: (args) => {
    config = args;

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      // On macOS it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (win === null) {
        createWindow();
      }
    });
  }
}