import { useEffect, useRef } from 'react';
import { useTerminalStore, type TerminalLine } from '../store/terminalStore';
import { TerminalInput } from './TerminalInput';
import { runBootSequence } from '../terminal/bootSequence';
import { startBackgroundEngine } from '../terminal/backgroundEngine';

let bootStarted = false;

function LineRenderer({ line }: { line: TerminalLine }) {
  const classMap: Record<string, string> = {
    input: 'terminal-input-line',
    output: 'terminal-output-line',
    error: 'terminal-error-line',
    system: 'terminal-system-line',
    progress: 'terminal-progress-line',
    header: 'terminal-header-line',
    success: 'terminal-success-line',
    alert: 'terminal-alert-line',
  };

  return (
    <div className={classMap[line.type] ?? 'terminal-output-line'}>
      {line.text || '\u00A0'}
    </div>
  );
}

export function Terminal() {
  const lines = useTerminalStore((s) => s.lines);
  const isProcessing = useTerminalStore((s) => s.isProcessing);
  const isBooting = useTerminalStore((s) => s.isBooting);
  const bootComplete = useTerminalStore((s) => s.bootComplete);
  const isGlitching = useTerminalStore((s) => s.isGlitching);
  const isFullscreen = useTerminalStore((s) => s.isFullscreen);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bootStarted && !bootComplete && !isBooting) {
      bootStarted = true;
      runBootSequence().then(() => {
        startBackgroundEngine();
      });
    }
  }, [bootComplete, isBooting]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (isFullscreen) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [isFullscreen]);

  const inputDisabled = isProcessing || isBooting;

  const containerClasses = [
    'terminal-container',
    isGlitching ? 'terminal-glitch' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className="terminal-output" ref={scrollRef}>
        {lines.map((line) => (
          <LineRenderer key={line.id} line={line} />
        ))}
      </div>
      <TerminalInput disabled={inputDisabled} />
    </div>
  );
}
