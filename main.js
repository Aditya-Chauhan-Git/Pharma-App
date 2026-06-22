const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

// database connection
const Database = require('better-sqlite3')
const dbPath = path.join(app.getPath('userData'), 'pharma.db')
const db = new Database(dbPath)

db.pragma('journal_mode = WAL')

// search handler function
function handleSearch(e, value) {
  console.log(app.getPath('userData'));
  return db.prepare(`SELECT * FROM medicines WHERE name LIKE ?`).all(`${value}%`)
}

// main window function
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