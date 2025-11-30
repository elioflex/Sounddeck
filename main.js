const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

ipcMain.handle('get-sounds', async () => {
  const soundsPath = path.join(__dirname, 'sounds');
  
  if (!fs.existsSync(soundsPath)) {
    fs.mkdirSync(soundsPath);
  }
  
  const files = fs.readdirSync(soundsPath);
  const mp3Files = files
    .filter(file => file.toLowerCase().endsWith('.mp3'))
    .map(file => ({
      name: path.basename(file, '.mp3'),
      path: path.join(soundsPath, file)
    }));
  
  return mp3Files;
});

ipcMain.handle('open-sounds-folder', async () => {
  const soundsPath = path.join(__dirname, 'sounds');
  
  if (!fs.existsSync(soundsPath)) {
    fs.mkdirSync(soundsPath);
  }
  
  shell.openPath(soundsPath);
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
