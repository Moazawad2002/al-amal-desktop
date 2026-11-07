import { app, BrowserWindow, ipcMain, dialog, session } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    frame: false, // Custom desktop title bar
    title: 'شركة الأمل لتوزيع المنتجات الغذائية | Al Amal Distribution Management System',
    icon: path.join(__dirname, '../public/logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
    backgroundColor: '#FAF7EE',
    show: false,
  });

  // Security: Deny popups and unauthorized external navigation
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== 'http://localhost:5173' && !navigationUrl.startsWith('file://')) {
      event.preventDefault();
    }
  });

  // CSP headers in production
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-inline' http://localhost:5173 https://*.supabase.co https://fonts.googleapis.com https://fonts.gstatic.com data: blob:;",
        ],
      },
    });
  });

  const distIndexPath = path.join(__dirname, '../dist/index.html');
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else if (require('fs').existsSync(distIndexPath)) {
    mainWindow.loadFile(distIndexPath);
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.on('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.on('window-close', () => {
  mainWindow?.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow?.isMaximized() ?? false;
});

ipcMain.handle('dialog-open-file', async (_event, options) => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: options?.filters || [
      { name: 'Spreadsheets', extensions: ['xlsx', 'xls', 'csv'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }
  return result.filePaths[0];
});

ipcMain.handle('dialog-save-file', async (_event, options) => {
  if (!mainWindow) return null;
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: options?.defaultPath,
    filters: options?.filters || [
      { name: 'Excel Workbook', extensions: ['xlsx'] },
      { name: 'CSV File', extensions: ['csv'] },
      { name: 'PDF Document', extensions: ['pdf'] }
    ]
  });
  if (result.canceled || !result.filePath) {
    return null;
  }
  return result.filePath;
});

ipcMain.handle('print-page', async () => {
  if (!mainWindow) return false;
  return new Promise((resolve) => {
    mainWindow?.webContents.print({ silent: false, printBackground: true }, (success) => {
      resolve(success);
    });
  });
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
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
