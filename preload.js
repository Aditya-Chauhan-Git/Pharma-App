const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('searchApi', {
    searchByLetter: (value) => ipcRenderer.invoke('search-by-letter', value),
    searchById: (id) => ipcRenderer.invoke('search-by-id', id)
})

contextBridge.exposeInMainWorld('receiptApi', {
    sell: (arr) => ipcRenderer.invoke('sell', arr)
})