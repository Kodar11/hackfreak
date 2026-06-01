import { useEffect, useRef } from 'react';
import { useTerminalStore, type TerminalLine } from '../store/terminalStore';
import { TerminalInput } from './TerminalInput';

function LineRenderer({ line }: { line: TerminalLine }) {
  const classMap: Record<string, string> = {
    input: 'terminal-input-line',
    output: 'terminal-output-line',
    error: 'terminal-error-line',
    system: 'terminal-system-line',
    progress: 'terminal-progress-line',
    header: 'terminal-header-line',
    success: 'terminal-success-line',
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="terminal-container">
      <div className="terminal-output" ref={scrollRef}>
        <div className="terminal-boot">
          <div className="terminal-header-line">╔══════════════════════════════════════════════════════╗</div>
          <div className="terminal-header-line">║         FRICTION OS v4.2.1 — SECURE TERMINAL        ║</div>
          <div className="terminal-header-line">╚══════════════════════════════════════════════════════╝</div>
          <div className="terminal-system-line">[*] System initialized. All modules loaded.</div>
          <div className="terminal-system-line">[*] Type "help" to view available commands.</div>
          <div className="terminal-output-line">&nbsp;</div>
        </div>
        {lines.map((line) => (
          <LineRenderer key={line.id} line={line} />
        ))}
      </div>
      <TerminalInput disabled={isProcessing} />
    </div>
  );
}
