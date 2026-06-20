const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function handleSearch(value) {
  return 'nice'
}

function createMainWindow(){
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'))
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  ipcMain.handle('search-medicine', handleSearch)
  createMainWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})