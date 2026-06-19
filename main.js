const { app, BrowserWindow } = require('electron')
const path = require('path')

function createMainWindow(){
  const mainWindow = new BrowserWindow({ width: 1200, height: 700 })
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'))
}

app.whenReady().then(() => {
  createMainWindow();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})