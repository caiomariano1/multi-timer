interface TitleBarProps {
  onAddTimer: () => void
}

export const TitleBar = ({ onAddTimer }: TitleBarProps) => {
  const handleMinimize = () => window.electronAPI?.minimizeApp()
  const handleClose = () => window.electronAPI?.closeApp()

  return (
    <div className="titlebar">
      <div className="titlebar__drag" />
      <button className="titlebar__btn titlebar__btn--add" onClick={onAddTimer} title="Novo cronômetro">
        <svg viewBox="0 0 20 20" fill="none">
          <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <span className="titlebar__title">Multi Timer</span>
      <div className="titlebar__window-controls">
        <button className="titlebar__wbtn" onClick={handleMinimize} title="Minimizar">
          <svg viewBox="0 0 12 12" fill="currentColor">
            <rect x="1" y="5.5" width="10" height="1.2" rx="0.6"/>
          </svg>
        </button>
        <button className="titlebar__wbtn titlebar__wbtn--close" onClick={handleClose} title="Fechar">
          <svg viewBox="0 0 12 12" fill="currentColor">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
