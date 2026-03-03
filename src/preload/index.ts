import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openMini: (timerId: string, label: string) =>
    ipcRenderer.send('open-mini', { timerId, label }),
  closeMini: (timerId: string) =>
    ipcRenderer.send('close-mini', timerId),
  expandMini: (timerId: string) =>
    ipcRenderer.send('expand-mini', timerId),
  minimizeApp: () => ipcRenderer.send('minimize-app'),
  maximizeApp: () => ipcRenderer.send('maximize-app'),
  closeApp: () => ipcRenderer.send('close-app'),
  onMiniClosed: (callback: (timerId: string) => void) =>
    ipcRenderer.on('mini-closed', (_event, timerId) => callback(timerId)),
  onTimersChanged: (callback: () => void) =>
    ipcRenderer.on('timers-changed', () => callback()),
})
