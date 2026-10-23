const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveExcel: (data) => ipcRenderer.invoke('save-excel', data)
});
