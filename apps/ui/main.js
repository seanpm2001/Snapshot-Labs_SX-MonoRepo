const { app, BrowserWindow } = require('electron');
const todesktop = require("@todesktop/runtime");
const path = require('path');

todesktop.init();

function createWindow() {
  const win = new BrowserWindow({
    width: 400, // 357
    height: 660, // 600
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('dist/index.html');
}

app.whenReady().then(createWindow);
