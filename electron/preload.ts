import { contextBridge, ipcRenderer } from 'electron';

export interface IElectronAPI {
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  isMaximized: () => Promise<boolean>;
  openFileDialog: (options?: { filters?: { name: string; extensions: string[] }[] }) => Promise<string | null>;
  saveFileDialog: (options?: { defaultPath?: string; filters?: { name: string; extensions: string[] }[] }) => Promise<string | null>;
  printPage: () => Promise<boolean>;
  getAppVersion: () => Promise<string>;
  getPlatform: () => string;
}

const electronAPI: IElectronAPI = {
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  openFileDialog: (options) => ipcRenderer.invoke('dialog-open-file', options),
  saveFileDialog: (options) => ipcRenderer.invoke('dialog-save-file', options),
  printPage: () => ipcRenderer.invoke('print-page'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => process.platform,
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
