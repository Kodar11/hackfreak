import { Terminal } from './components/Terminal';
import { useTerminalStore } from './store/terminalStore';

function App() {
  const threatLevel = useTerminalStore((s) => s.threatLevel);

  return (
    <div className="app-wrapper">
      <header className="app-titlebar">
        <div className="app-titlebar-left">
          <div className="app-titlebar-dots">
            <span className="app-titlebar-dot app-titlebar-dot-red" />
            <span className="app-titlebar-dot app-titlebar-dot-yellow" />
            <span className="app-titlebar-dot app-titlebar-dot-green" />
          </div>
          <span className="app-titlebar-title">Hacker Terminal</span>
          <span className={`threat-badge threat-badge-${threatLevel.toLowerCase()}`}>
            {threatLevel}
          </span>
        </div>
        <div className="app-titlebar-buttons">
          <button
            className="app-titlebar-btn"
            onClick={() => window.electron.sendFrameAction('MINIMIZE')}
            aria-label="Minimize"
          >
            &#x2014;
          </button>
          <button
            className="app-titlebar-btn"
            onClick={() => window.electron.sendFrameAction('MAXIMIZE')}
            aria-label="Maximize"
          >
            &#x25A1;
          </button>
          <button
            className="app-titlebar-btn app-titlebar-btn-close"
            onClick={() => window.electron.sendFrameAction('CLOSE')}
            aria-label="Close"
          >
            &#x2715;
          </button>
        </div>
      </header>
      <Terminal />
    </div>
  );
}

export default App;
