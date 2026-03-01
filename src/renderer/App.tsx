import { useEffect } from 'react'
import { useTimerStore } from './store/timersStore'
import { TimerCard } from './components/TimerCard'
import { MiniTimer } from './components/MiniTimer'
import { TitleBar } from './components/TitleBar'
import { Timer } from './types/timer'
import './styles.css'

// Detecta se está rodando como mini window via query params
const params = new URLSearchParams(window.location.search)
const isMini = params.get('mini') === 'true'
const miniTimerId = params.get('timerId') ?? ''
const miniLabel = decodeURIComponent(params.get('label') ?? 'Cronômetro')

export default function App() {
  const { timers, addTimer, loadFromStorage } = useTimerStore()

  useEffect(() => {
    loadFromStorage()
  }, [])

  // Escuta fechamento de mini windows pelo processo principal
  useEffect(() => {
    window.electronAPI?.onMiniClosed((_timerId: string) => {
      // Nada necessário, o timer continua no estado
    })
  }, [])

  if (isMini) {
    return <MiniTimer timerId={miniTimerId} label={miniLabel} />
  }

  const handleMinimize = (timer: Timer) => {
    window.electronAPI?.openMini(timer.id, timer.label)
  }

  return (
    <div className="app">
      <TitleBar onAddTimer={() => addTimer()} />

      <div className="app__content">
        {timers.length === 0 ? (
          <div className="app__empty">
            <div className="app__empty-icon">
              <svg viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2"/>
                <path d="M32 18v14l8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="app__empty-title">Nenhum cronômetro</p>
            <p className="app__empty-sub">Clique em <strong>+</strong> para adicionar</p>
          </div>
        ) : (
          <div className="app__timers">
            {timers.map((timer) => (
              <TimerCard
                key={timer.id}
                timer={timer}
                onMinimize={handleMinimize}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
