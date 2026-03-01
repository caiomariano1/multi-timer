import { Timer } from '../types/timer'

const STORAGE_KEY = 'multi-timer:timers'

export const saveTimers = (timers: Timer[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timers))
  } catch (e) {
    console.error('Erro ao salvar timers:', e)
  }
}

export const loadTimers = (): Timer[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    return JSON.parse(data) as Timer[]
  } catch (e) {
    console.error('Erro ao carregar timers:', e)
    return []
  }
}

export const clearTimers = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}
