export const formatTime = (ms: number): { h: string; min: string; seg: string; cs: string } => {
  const totalSeconds = Math.floor(ms / 1000)
  const centiseconds = Math.floor((ms % 1000) / 10)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    h: String(hours).padStart(2, '0'),
    min: String(minutes).padStart(2, '0'),
    seg: String(seconds).padStart(2, '0'),
    cs: String(centiseconds).padStart(2, '0'),
  }
}

export const getElapsed = (timer: { elapsedMs: number; isRunning: boolean; startedAt: number | null }): number => {
  if (timer.isRunning && timer.startedAt !== null) {
    return timer.elapsedMs + (Date.now() - timer.startedAt)
  }
  return timer.elapsedMs
}
