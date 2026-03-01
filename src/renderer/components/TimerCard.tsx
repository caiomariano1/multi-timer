import { useState, useRef } from 'react'
import { Timer } from '../types/timer'
import { useTimerStore } from '../store/timersStore'
import { useTimerTick } from '../hooks/useTimer'
import { formatTime } from '../utils/formatTime'

interface TimerCardProps {
  timer: Timer
  onMinimize: (timer: Timer) => void
}

export const TimerCard = ({ timer, onMinimize }: TimerCardProps) => {
  const { startTimer, pauseTimer, resetTimer, renameTimer, removeTimer } = useTimerStore()
  const displayMs = useTimerTick(timer)
  const { h, min, seg, cs } = formatTime(displayMs)
  const [editing, setEditing] = useState(false)
  const [labelValue, setLabelValue] = useState(timer.label)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleLabelBlur = () => {
    setEditing(false)
    const trimmed = labelValue.trim() || 'Nova demanda'
    setLabelValue(trimmed)
    renameTimer(timer.id, trimmed)
  }

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') inputRef.current?.blur()
  }

  const handleToggle = () => {
    if (timer.isRunning) pauseTimer(timer.id)
    else startTimer(timer.id)
  }

  return (
    <div className="timer-card">
      <div className="timer-card__header">
        <div className="timer-card__label-wrapper">
          {editing ? (
            <input
              ref={inputRef}
              className="timer-card__label-input"
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
              onBlur={handleLabelBlur}
              onKeyDown={handleLabelKeyDown}
              autoFocus
              maxLength={40}
            />
          ) : (
            <span
              className="timer-card__label"
              onClick={() => setEditing(true)}
              title="Clique para renomear"
            >
              {timer.label}
              <svg className="timer-card__edit-icon" viewBox="0 0 16 16" fill="none">
                <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
        </div>
        <div className="timer-card__actions">
          <button
            className="timer-card__icon-btn"
            onClick={() => onMinimize(timer)}
            title="Minimizar para flutuante"
          >
            <svg viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            className="timer-card__icon-btn timer-card__icon-btn--danger"
            onClick={() => removeTimer(timer.id)}
            title="Remover cronômetro"
          >
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="timer-card__display">
        <span className="timer-card__digits">{h}</span>
        <span className="timer-card__colon">:</span>
        <span className="timer-card__digits">{min}</span>
        <span className="timer-card__colon">:</span>
        <span className="timer-card__digits">{seg}</span>
        <span className="timer-card__centiseconds">,{cs}</span>
      </div>
      <div className="timer-card__labels">
        <span>h</span>
        <span>min</span>
        <span>seg</span>
      </div>

      <div className="timer-card__controls">
        <button
          className={`timer-card__play-btn ${timer.isRunning ? 'timer-card__play-btn--running' : ''}`}
          onClick={handleToggle}
          title={timer.isRunning ? 'Pausar' : 'Iniciar'}
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
          className="timer-card__secondary-btn"
          onClick={() => resetTimer(timer.id)}
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
