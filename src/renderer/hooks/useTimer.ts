import { useState, useEffect, useRef } from 'react'
import { getElapsed } from '../utils/formatTime'
import { Timer } from '../types/timer'

export const useTimerTick = (timer: Timer) => {
  const [displayMs, setDisplayMs] = useState(() => getElapsed(timer))
  const rafRef = useRef<number>(0)

  useEffect(() => {
    setDisplayMs(getElapsed(timer))

    if (!timer.isRunning) {
      cancelAnimationFrame(rafRef.current)
      return
    }

    const tick = () => {
      setDisplayMs(getElapsed(timer))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
  }, [timer.isRunning, timer.startedAt, timer.elapsedMs])

  return displayMs
}
