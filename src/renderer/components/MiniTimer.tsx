import { useEffect } from "react";
import { useTimerStore } from "../store/timersStore";
import { useTimerTick } from "../hooks/useTimer";
import { formatTime } from "../utils/formatTime";
import { VscDebugRestart } from "react-icons/vsc";

interface MiniTimerProps {
  timerId: string;
  label: string;
}

const MiniTimerInner = ({ timerId, label }: MiniTimerProps) => {
  const { getTimer, startTimer, pauseTimer, resetTimer } = useTimerStore();
  const timer = getTimer(timerId);

  const displayMs = useTimerTick(
    timer ?? {
      id: timerId,
      elapsedMs: 0,
      isRunning: false,
      startedAt: null,
      label,
      createdAt: Date.now(),
    },
  );
  const { h, min, seg, cs } = formatTime(displayMs);

  if (!timer) return null;

  const handleToggle = () => {
    if (timer.isRunning) pauseTimer(timerId);
    else startTimer(timerId);
  };

  const handleExpand = () => {
    window.electronAPI?.expandMini(timerId);
  };

  const handleClose = () => {
    window.electronAPI?.closeMini(timerId);
  };

  return (
    <div className="mini-timer">
      <div className="mini-timer__drag-bar">
        <span className="mini-timer__label" title={label}>
          {label}
        </span>
        <div className="mini-timer__bar-actions">
          <button
            className="mini-timer__bar-btn"
            onClick={handleExpand}
            title="Voltar para vizualização completa"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="currentColor"
            >
              <path d="M146.67-160q-27 0-46.84-19.83Q80-199.67 80-226.67V-520h66.67v293.33h666.66v-506.66H440V-800h373.33q27 0 46.84 19.83Q880-760.33 880-733.33v506.66q0 27-19.83 46.84Q840.33-160 813.33-160H146.67Zm545.66-140L740-347.67l-142-141h113.33v-66.66H484.67v226.66h66.66V-441l141 141ZM80-586.67V-800h293.33v213.33H80ZM480-480Z" />
            </svg>
          </button>
          {/* <button
            className="mini-timer__bar-btn mini-timer__bar-btn--close"
            onClick={handleClose}
            title="Fechar"
          >
            <svg viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button> */}
        </div>
      </div>

      <div className="mini-timer__display">
        <div className="mini-timer__display-row">
          <div className="mini-timer__unit">
            <span className="mini-timer__digits">{h}</span>
            <span className="mini-timer__unit-label">h</span>
          </div>
          <span className="mini-timer__colon">:</span>
          <div className="mini-timer__unit">
            <span className="mini-timer__digits">{min}</span>
            <span className="mini-timer__unit-label">min</span>
          </div>
          <span className="mini-timer__colon">:</span>
          <div className="mini-timer__unit">
            <span className="mini-timer__digits">{seg}</span>
            <span className="mini-timer__unit-label">seg</span>
          </div>
          <span className="mini-timer__cs">,{cs}</span>
        </div>
      </div>

      <div className="mini-timer__controls">
        <button
          className={`mini-timer__play-btn ${timer.isRunning ? "mini-timer__play-btn--running" : ""}`}
          onClick={handleToggle}
        >
          {timer.isRunning ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          )}
        </button>
        <button
          className="mini-timer__reset-btn"
          onClick={() => resetTimer(timerId)}
          title="Zerar"
        >
          <VscDebugRestart />
        </button>
      </div>
    </div>
  );
};

export const MiniTimer = (props: MiniTimerProps) => {
  const { loadFromStorage } = useTimerStore();
  useEffect(() => {
    loadFromStorage();
  }, []);

  return <MiniTimerInner {...props} />;
};
