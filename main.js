const { app, BrowserWindow } = require('electron')

function createMainWindow(){
  const mainWindow = new BrowserWindow({ width: 1200, height: 700 })
  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createMainWindow();
})