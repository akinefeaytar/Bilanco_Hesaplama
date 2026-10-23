const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Bilanx - Finansal Raporlama ve Bilanço Otomasyonu',
    icon: path.join(__dirname, process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

// Dosya kaydetme diyaloğu (Windows ve macOS için yerel diyalog)
ipcMain.handle('save-excel', async (event, { defaultName, content }) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Excel Raporunu Kaydet',
    defaultPath: defaultName || 'Finansal_Rapor.xls',
    filters: [
      { name: 'Excel Dosyası (*.xls)', extensions: ['xls'] },
      { name: 'Tüm Dosyalar (*.*)', extensions: ['*'] }
    ]
  });

  if (canceled || !filePath) {
    return { success: false, canceled: true };
  }

  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
