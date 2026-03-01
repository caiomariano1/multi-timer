import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { Timer } from '../types/timer'
import { saveTimers, loadTimers } from '../utils/storage'
import { getElapsed } from '../utils/formatTime'

interface TimerStore {
  timers: Timer[]
  addTimer: (label?: string) => Timer
  removeTimer: (id: string) => void
  startTimer: (id: string) => void
  pauseTimer: (id: string) => void
  resetTimer: (id: string) => void
  renameTimer: (id: string, label: string) => void
  getTimer: (id: string) => Timer | undefined
  loadFromStorage: () => void
}

export const useTimerStore = create<TimerStore>((set, get) => ({
  timers: [],

  loadFromStorage: () => {
    const loaded = loadTimers()
    set({ timers: loaded })
  },

  addTimer: (label = 'Nova demanda') => {
    const newTimer: Timer = {
      id: uuidv4(),
      label,
      elapsedMs: 0,
      isRunning: false,
      startedAt: null,
      createdAt: Date.now(),
    }
    const timers = [...get().timers, newTimer]
    set({ timers })
    saveTimers(timers)
    return newTimer
  },

  removeTimer: (id) => {
    const timers = get().timers.filter((t) => t.id !== id)
    set({ timers })
    saveTimers(timers)
  },

  startTimer: (id) => {
    const timers = get().timers.map((t) =>
      t.id === id ? { ...t, isRunning: true, startedAt: Date.now() } : t
    )
    set({ timers })
    saveTimers(timers)
  },

  pauseTimer: (id) => {
    const timers = get().timers.map((t) => {
      if (t.id !== id) return t
      return {
        ...t,
        isRunning: false,
        elapsedMs: getElapsed(t),
        startedAt: null,
      }
    })
    set({ timers })
    saveTimers(timers)
  },

  resetTimer: (id) => {
    const timers = get().timers.map((t) =>
      t.id === id
        ? { ...t, isRunning: false, elapsedMs: 0, startedAt: null }
        : t
    )
    set({ timers })
    saveTimers(timers)
  },

  renameTimer: (id, label) => {
    const timers = get().timers.map((t) =>
      t.id === id ? { ...t, label } : t
    )
    set({ timers })
    saveTimers(timers)
  },

  getTimer: (id) => get().timers.find((t) => t.id === id),
}))
