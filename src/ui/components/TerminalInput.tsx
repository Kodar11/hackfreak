import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useTerminalStore } from '../store/terminalStore';
import { executeCommand } from '../terminal/commands';
import { getDisplayPath } from '../terminal/fileSystem';

interface TerminalInputProps {
  disabled: boolean;
}

export function TerminalInput({ disabled }: TerminalInputProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentDir = useTerminalStore((s) => s.currentDir);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = input.trim();
      if (trimmed) {
        setHistory((prev) => [...prev, trimmed]);
      }
      setHistoryIndex(-1);
      setInput('');
      if (trimmed) {
        await executeCommand(trimmed);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  const displayPath = getDisplayPath(currentDir);

  return (
    <div className="terminal-prompt-row" onClick={() => inputRef.current?.focus()}>
      <span className="terminal-prompt">
        <span className="terminal-prompt-user">user@friction</span>
        <span className="terminal-prompt-sep">:</span>
        <span className="terminal-prompt-dir">{displayPath}</span>
        <span className="terminal-prompt-sep"> $ </span>
      </span>
      <input
        ref={inputRef}
        className="terminal-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
      />
      {!disabled && <span className="terminal-cursor" />}
    </div>
  );
}
