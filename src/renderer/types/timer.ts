export interface Timer {
  id: string
  label: string
  elapsedMs: number
  isRunning: boolean
  startedAt: number | null // timestamp de quando o play foi acionado
  createdAt: number
}

export interface ElectronAPI {
  openMini: (timerId: string, label: string) => void
  closeMini: (timerId: string) => void
  expandMini: (timerId: string) => void
  minimizeApp: () => void
  maximizeApp: () => void
  closeApp: () => void
  onMiniClosed: (callback: (timerId: string) => void) => void
  onTimersChanged: (callback: () => void) => void
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}
