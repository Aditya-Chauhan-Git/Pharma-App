
// db directory - C:\Users\Admin\AppData\Roaming\pharma-app

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

// database connection
const Database = require('better-sqlite3')
const dbPath = path.join(app.getPath('userData'), 'pharma.db')
const db = new Database(dbPath)

db.pragma('journal_mode = WAL')

// search handler function
function handleSearchByLetter(e, value) {
  return db.prepare(`SELECT * FROM medicines WHERE name LIKE ? LIMIT 20`).all(`${value}%`)
}

function handleSearchById(e, id) {
  return db.prepare(`SELECT * FROM medicines WHERE id = ?`).get(`${id}`)
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
  ipcMain.handle('search-by-letter', handleSearchByLetter)
  ipcMain.handle('search-by-id', handleSearchById)
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