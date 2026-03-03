import { useState, useRef } from "react";
import { Timer } from "../types/timer";
import { useTimerStore } from "../store/timersStore";
import { useTimerTick } from "../hooks/useTimer";
import { formatTime } from "../utils/formatTime";
import { VscDebugRestart } from "react-icons/vsc";

interface TimerCardProps {
  timer: Timer;
  onMinimize: (timer: Timer) => void;
}

export const TimerCard = ({ timer, onMinimize }: TimerCardProps) => {
  const { startTimer, pauseTimer, resetTimer, renameTimer, removeTimer } =
    useTimerStore();
  const displayMs = useTimerTick(timer);
  const { h, min, seg, cs } = formatTime(displayMs);
  const [editing, setEditing] = useState(false);
  const [labelValue, setLabelValue] = useState(timer.label);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLabelBlur = () => {
    setEditing(false);
    const trimmed = labelValue.trim() || "Novo título";
    setLabelValue(trimmed);
    renameTimer(timer.id, trimmed);
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") inputRef.current?.blur();
  };

  const handleToggle = () => {
    if (timer.isRunning) pauseTimer(timer.id);
    else startTimer(timer.id);
  };

  return (
    <div className="timer-card">
      <div className="timer-card__header">
        {confirmingDelete ? (
          <>
            <span className="timer-card__delete-confirm-msg">
              Excluir <strong>"{timer.label}"</strong>?
            </span>
            <div className="timer-card__delete-confirm-actions">
              <button
                className="timer-card__confirm-btn timer-card__confirm-btn--cancel"
                onClick={() => setConfirmingDelete(false)}
              >
                Cancelar
              </button>
              <button
                className="timer-card__confirm-btn timer-card__confirm-btn--danger"
                onClick={() => removeTimer(timer.id)}
              >
                Excluir
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              className="timer-card__icon-btn"
              onClick={() => onMinimize(timer)}
              title="Manter na parte inferior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                fill="currentColor"
              >
                <path d="M80-520v-66.67h166.67L55.33-777.33l47.34-47.34L293.33-634v-166H360v280H80Zm66.67 360q-27 0-46.84-19.83Q80-199.67 80-226.67v-220h66.67v220H480V-160H146.67Zm666.66-280v-293.33h-380V-800h380q27 0 46.84 19.83Q880-760.33 880-733.33V-440h-66.67ZM546.67-160v-213.33H880V-160H546.67Z" />
              </svg>
            </button>
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
                  <span className="timer-card__label-text">{timer.label}</span>
                  <svg
                    className="timer-card__edit-icon"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>
            <button
              className="timer-card__icon-btn timer-card__icon-btn--danger"
              onClick={() => setConfirmingDelete(true)}
              title="Remover cronômetro"
            >
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="timer-card__display">
        <div className="timer-card__unit">
          <span className="timer-card__digits">{h}</span>
          <span className="timer-card__unit-label">h</span>
        </div>
        <span className="timer-card__colon">:</span>
        <div className="timer-card__unit">
          <span className="timer-card__digits">{min}</span>
          <span className="timer-card__unit-label">min</span>
        </div>
        <span className="timer-card__colon">:</span>
        <div className="timer-card__unit">
          <span className="timer-card__digits">{seg}</span>
          <span className="timer-card__unit-label">seg</span>
        </div>
        <span className="timer-card__centiseconds">,{cs}</span>
      </div>

      <div className="timer-card__controls">
        <button
          className={`timer-card__play-btn ${timer.isRunning ? "timer-card__play-btn--running" : ""}`}
          onClick={handleToggle}
          title={timer.isRunning ? "Pausar" : "Iniciar"}
        >
          {timer.isRunning ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="#fff"
            >
              <path d="M320-263v-438q0-15 10-24.17 10-9.16 23.33-9.16 4.34 0 8.84 1.16 4.5 1.17 8.83 3.5L715.67-510q7.66 5.33 11.5 12.33 3.83 7 3.83 15.67t-3.83 15.67q-3.84 7-11.5 12.33L371-234.33q-4.33 2.33-8.83 3.5-4.5 1.16-8.84 1.16-13.33 0-23.33-9.16Q320-248 320-263Z" />
            </svg>
          )}
        </button>
        <button
          className="timer-card__secondary-btn"
          onClick={() => resetTimer(timer.id)}
          title="Zerar"
        >
          <VscDebugRestart />
        </button>
      </div>
    </div>
  );
};
