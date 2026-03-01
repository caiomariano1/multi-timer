import { useEffect } from 'react'
import { useTimerStore } from '../store/timersStore'
import { useTimerTick } from '../hooks/useTimer'
import { formatTime } from '../utils/formatTime'

interface MiniTimerProps {
  timerId: string
  label: string
}

const MiniTimerInner = ({ timerId, label }: MiniTimerProps) => {
  const { getTimer, startTimer, pauseTimer, resetTimer } = useTimerStore()
  const timer = getTimer(timerId)

  const displayMs = useTimerTick(
    timer ?? { id: timerId, elapsedMs: 0, isRunning: false, startedAt: null, label, createdAt: Date.now() }
  )
  const { h, min, seg, cs } = formatTime(displayMs)

  if (!timer) return null

  const handleToggle = () => {
    if (timer.isRunning) pauseTimer(timerId)
    else startTimer(timerId)
  }

  const handleExpand = () => {
    window.electronAPI?.expandMini(timerId)
  }

  const handleClose = () => {
    window.electronAPI?.closeMini(timerId)
  }

  return (
    <div className="mini-timer">
      <div className="mini-timer__drag-bar">
        <span className="mini-timer__label" title={label}>{label}</span>
        <div className="mini-timer__bar-actions">
          <button className="mini-timer__bar-btn" onClick={handleExpand} title="Expandir">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 9.5h4v4M13 6.5H9v-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 13.5L7 9.5M13 2.5L9 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
          <button className="mini-timer__bar-btn mini-timer__bar-btn--close" onClick={handleClose} title="Fechar">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="mini-timer__display">
        <span className="mini-timer__digits">{h}</span>
        <span className="mini-timer__colon">:</span>
        <span className="mini-timer__digits">{min}</span>
        <span className="mini-timer__colon">:</span>
        <span className="mini-timer__digits">{seg}</span>
        <span className="mini-timer__cs">,{cs}</span>
      </div>
      <div className="mini-timer__sub-labels">
        <span>h</span>
        <span>min</span>
        <span>seg</span>
      </div>

      <div className="mini-timer__controls">
        <button
          className={`mini-timer__play-btn ${timer.isRunning ? 'mini-timer__play-btn--running' : ''}`}
          onClick={handleToggle}
        >
          {timer.isRunning ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1"/>
              <rect x="14" y="5" width="4" height="14" rx="1"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.14v14l11-7-11-7z"/>
            </svg>
          )}
        </button>
        <button
          className="mini-timer__reset-btn"
          onClick={() => resetTimer(timerId)}
          title="Zerar"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 12a8 8 0 1 1 1.5 4.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M4 17v-4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export const MiniTimer = (props: MiniTimerProps) => {
  const { loadFromStorage } = useTimerStore()
  useEffect(() => {
    loadFromStorage()
  }, [])

  return <MiniTimerInner {...props} />
}
