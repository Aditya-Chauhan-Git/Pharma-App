
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

// Sell handler function
function handleSell(e, arr) {
  if (!arr || arr.length === 0) return { success: false, message: 'Receipt is empty' }

  try {
    const sellTransaction = db.transaction(() => {
      const stmt = db.prepare(`
        UPDATE medicines 
        SET quantity = quantity - ? 
        WHERE id = ? AND quantity >= ?
      `)

      for (const item of arr) {
        const result = stmt.run(item.qty, item.id, item.qty)
        if (result.changes === 0) {
          throw new Error(`Insufficient stock for medicine ${item.name}`)
        }

      }

    })

    sellTransaction(arr)
    return { success: true }

  } catch (err) {
    return { success: false, message: err.message }
  }
}

// main window function
function createMainWindow() {
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

  ipcMain.handle('sell', handleSell)
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