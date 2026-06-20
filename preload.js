const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    searchMedicine: (value) => ipcRenderer.invoke('search-medicine', value)
})
