interface TitleBarProps {
  onAddTimer: () => void;
}

export const TitleBar = ({ onAddTimer }: TitleBarProps) => {
  const handleMinimize = () => window.electronAPI?.minimizeApp();
  const handleMaximize = () => window.electronAPI?.maximizeApp();
  const handleClose = () => window.electronAPI?.closeApp();

  return (
    <div className="titlebar">
      <button
        className="titlebar__btn titlebar__btn--add"
        onClick={onAddTimer}
        title="Novo cronômetro"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="40px"
          viewBox="0 -960 960 960"
          width="40px"
          fill="currentColor"
        >
          <path d="M299.5-148.33q-65.5-28.34-114.17-77-48.66-48.67-77-114.17Q80-405 80-480t28.33-140.5q28.34-65.5 77.34-114.17 49-48.66 114.5-77Q365.67-840 440.67-840q24.33 0 48.5 3.5 24.16 3.5 49.5 10.5v70q-24-8.67-48.5-13t-49.5-4.33Q318-773.33 232.33-688q-85.66 85.33-85.66 208T232-272q85.33 85.33 208 85.33T648-272q85.33-85.33 85.33-208 0-13.67-1.33-27.67-1.33-14-4.67-31.66h68q2.67 15 3.67 29.66 1 14.67 1 29.67 0 75-28.33 140.5-28.34 65.5-77 114.17-48.67 48.66-114.17 77Q515-120 440-120t-140.5-28.33Zm255.17-164.34-152-152V-680h66.66v188.67l132 132-46.66 46.66ZM729.33-606v-123.33h-124V-796h124v-124H796v124h124v66.67H796V-606h-66.67Z" />
        </svg>
      </button>
      <div className="titlebar__drag" />
      <span className="titlebar__title">MultiTimer</span>
      <div className="titlebar__window-controls">
        <button
          className="titlebar__wbtn"
          onClick={handleMinimize}
          title="Minimizar"
        >
          <svg viewBox="0 0 12 12" fill="currentColor">
            <rect x="1" y="5.5" width="10" height="1.2" rx="0.6" />
          </svg>
        </button>
        <button
          className="titlebar__wbtn"
          onClick={handleMaximize}
          title="Maximizar"
        >
          <svg viewBox="0 0 12 12" fill="none">
            <rect
              x="1.5"
              y="1.5"
              width="9"
              height="9"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </button>
        <button
          className="titlebar__wbtn titlebar__wbtn--close"
          onClick={handleClose}
          title="Fechar"
        >
          <svg viewBox="0 0 12 12" fill="currentColor">
            <path
              d="M2 2l8 8M10 2l-8 8"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
