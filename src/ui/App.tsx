import { useEffect, useState } from 'react';
import { Terminal } from './components/Terminal';
import { useTerminalStore } from './store/terminalStore';

function App() {
  const threatLevel = useTerminalStore((s) => s.threatLevel);
  const sessionId = useTerminalStore((s) => s.sessionId);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const unsubscribe = window.electron.onWindowStateChange((maximized) => {
      setIsMaximized(maximized);
    });

    window.electron.getIsMaximized().then(setIsMaximized);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="app-wrapper">
      <header className="app-titlebar">
        <div className="app-titlebar-left">
          <span className="app-titlebar-title">HACKER TERMINAL</span>
        </div>
        <div className="app-titlebar-center">
          {sessionId && (
            <span className="session-id">SESSION: {sessionId}</span>
          )}
        </div>
        <div className="app-titlebar-right">
          <span className={`threat-badge threat-badge-${threatLevel.toLowerCase()}`}>
            THREAT: {threatLevel}
          </span>
          <div className="app-titlebar-buttons">
            <button
              className="titlebar-button"
              onClick={() => window.electron.sendFrameAction('MINIMIZE')}
              aria-label="Minimize"
            >
              <svg width="12" height="12" viewBox="0 0 12 12">
                <rect y="5" width="12" height="1" fill="currentColor" />
              </svg>
            </button>
            <button
              className="titlebar-button"
              onClick={() => window.electron.sendFrameAction('MAXIMIZE')}
              aria-label={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? (
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <rect x="2" y="0" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1" />
                  <rect x="0" y="2" width="9" height="9" fill="var(--term-bg)" stroke="currentColor" strokeWidth="1" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <rect x="1" y="1" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              )}
            </button>
            <button
              className="titlebar-button titlebar-button-close"
              onClick={() => window.electron.sendFrameAction('CLOSE')}
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <Terminal />
    </div>
  );
}

export default App;
