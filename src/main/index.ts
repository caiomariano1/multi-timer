import { app, BrowserWindow, ipcMain, screen } from 'electron'
import path from 'path'

const isDev = process.env.NODE_ENV === 'development'

const miniWindows: Map<string, BrowserWindow> = new Map()
let mainWindow: BrowserWindow | null = null

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 680,
    minWidth: 380,
    minHeight: 500,
    frame: false,
    transparent: false,
    backgroundColor: '#f5f5f5',
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    resizable: true,
  })

  mainWindow.on('restore', () => {
    miniWindows.forEach((win) => win.close())
    mainWindow?.webContents.send('timers-changed')
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

function createMiniWindow(timerId: string, label: string) {
  if (miniWindows.has(timerId)) {
    miniWindows.get(timerId)?.focus()
    return
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  const win = new BrowserWindow({
    width: 220,
    height: 155,
    minWidth: 220,
    minHeight: 155,
    maxWidth: 480,
    maxHeight: 480,
    x: width - 240,
    y: height - 185,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    movable: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  const url = isDev
    ? `http://localhost:5173?mini=true&timerId=${timerId}&label=${encodeURIComponent(label)}`
    : `file://${path.join(__dirname, '../renderer/index.html')}?mini=true&timerId=${timerId}&label=${encodeURIComponent(label)}`

  win.setAlwaysOnTop(true, 'screen-saver')
  win.loadURL(url)
  miniWindows.set(timerId, win)

  win.on('closed', () => {
    miniWindows.delete(timerId)
    mainWindow?.webContents.send('mini-closed', timerId)
  })
}

ipcMain.on('open-mini', (_event, { timerId, label }) => {
  createMiniWindow(timerId, label)
  mainWindow?.minimize()
})

ipcMain.on('close-mini', (_event, timerId) => {
  const win = miniWindows.get(timerId)
  if (win) { win.close(); miniWindows.delete(timerId) }
  mainWindow?.show()
  mainWindow?.focus()
  mainWindow?.webContents.send('timers-changed')
})

ipcMain.on('expand-mini', (_event, timerId) => {
  const win = miniWindows.get(timerId)
  if (win) { win.close(); miniWindows.delete(timerId) }
  mainWindow?.show()
  mainWindow?.focus()
  mainWindow?.webContents.send('timers-changed')
})

ipcMain.on('minimize-app', () => { mainWindow?.minimize() })
ipcMain.on('maximize-app', () => {
  if (mainWindow?.isMaximized()) mainWindow.unmaximize()
  else mainWindow?.maximize()
})
ipcMain.on('close-app', () => { app.quit() })

app.whenReady().then(() => {
  createMainWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
