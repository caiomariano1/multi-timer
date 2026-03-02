import { useEffect } from "react";
import { useTimerStore } from "./store/timersStore";
import { TimerCard } from "./components/TimerCard";
import { MiniTimer } from "./components/MiniTimer";
import { TitleBar } from "./components/TitleBar";
import { Timer } from "./types/timer";
import "./styles.css";

// Detecta se está rodando como mini window via query params
const params = new URLSearchParams(window.location.search);
const isMini = params.get("mini") === "true";
const miniTimerId = params.get("timerId") ?? "";
const miniLabel = decodeURIComponent(params.get("label") ?? "Cronômetro");

export default function App() {
  const { timers, addTimer, loadFromStorage } = useTimerStore();

  useEffect(() => {
    loadFromStorage();
  }, []);

  // Escuta fechamento de mini windows pelo processo principal
  useEffect(() => {
    window.electronAPI?.onMiniClosed((_timerId: string) => {
      // Nada necessário, o timer continua no estado
    });
  }, []);

  if (isMini) {
    return <MiniTimer timerId={miniTimerId} label={miniLabel} />;
  }

  const handleMinimize = (timer: Timer) => {
    window.electronAPI?.openMini(timer.id, timer.label);
  };

  return (
    <div className="app">
      <TitleBar onAddTimer={() => addTimer()} />

      <div className="app__content">
        {timers.length === 0 ? (
          <div className="app__empty">
            <div className="app__empty-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="40px"
                viewBox="0 -960 960 960"
                width="40px"
                fill="currentColor"
              >
                <path d="m622-288.67 48.67-48.66-155.34-156v-195.34h-66.66v222l173.33 178ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-82.33 31.5-155.33 31.5-73 85.83-127.34Q251.67-817 324.67-848.5T480-880q82.33 0 155.33 31.5 73 31.5 127.34 85.83Q817-708.33 848.5-635.33T880-480q0 82.33-31.5 155.33-31.5 73-85.83 127.34Q708.33-143 635.33-111.5T480-80Zm0-400Zm0 333.33q137.67 0 235.5-97.83 97.83-97.83 97.83-235.5 0-137.67-97.83-235.5-97.83-97.83-235.5-97.83-137.67 0-235.5 97.83-97.83 97.83-97.83 235.5 0 137.67 97.83 235.5 97.83 97.83 235.5 97.83Z" />
              </svg>
            </div>
            <p className="app__empty-title">Nenhum cronômetro ativo</p>
            <p className="app__empty-sub">
              Clique no botão do canto superior esquerdo para adicionar
            </p>
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
  );
}
