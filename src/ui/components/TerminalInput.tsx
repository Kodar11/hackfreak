import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useTerminalStore } from '../store/terminalStore';
import { usePersonaStore } from '../store/personaStore';
import { executeCommand, ALL_COMMANDS } from '../terminal/commands';
import { getDisplayPath } from '../terminal/fileSystem';

interface TerminalInputProps {
  disabled: boolean;
}

export function TerminalInput({ disabled }: TerminalInputProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [pendingFields, setPendingFields] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const currentDir = useTerminalStore((s) => s.currentDir);
  const personaMode = useTerminalStore((s) => s.personaMode);
  const isProcessing = useTerminalStore((s) => s.isProcessing);
  const setPersonaMode = useTerminalStore((s) => s.setPersonaMode);
  const addLine = useTerminalStore((s) => s.addLine);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, personaMode]);

  const handlePersonaInput = (trimmed: string) => {
    if (trimmed === 'done') {
      const personaStore = usePersonaStore.getState();
      for (const [field, value] of Object.entries(pendingFields)) {
        personaStore.setField(personaMode!, field, value);
      }
      addLine('', 'output');
      addLine(`Persona "${personaMode}" saved with ${Object.keys(pendingFields).length} fields.`, 'success');
      addLine('', 'output');
      setPersonaMode(null);
      setPendingFields({});
      return;
    }

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex > 0) {
      const field = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      if (field && value) {
        setPendingFields((prev) => ({ ...prev, [field]: value }));
        addLine(`  ${field} = ${value}`, 'output');
        return;
      }
    }

    addLine('Use field=value or type "done" to finish.', 'error');
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'c' && e.ctrlKey) {
      const store = useTerminalStore.getState();
      if (store.monitorActive) {
        store.setMonitorActive(false);
        addLine('^C', 'input');
        addLine('Monitor stopped.', 'system');
      }
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed) return;
      
      const matches = ALL_COMMANDS.filter(cmd => cmd.startsWith(trimmed));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        addLine(trimmed, 'input');
        matches.forEach(m => addLine(`  ${m}`, 'output'));
      }
      return;
    }

    if (e.key === 'Enter') {
      const trimmed = input.trim();
      if (trimmed) {
        setHistory((prev) => [...prev, trimmed]);
      }
      setHistoryIndex(-1);
      setInput('');

      if (!trimmed) return;

      if (personaMode) {
        handlePersonaInput(trimmed);
      } else {
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

  if (isProcessing) {
    return (
      <div className="terminal-prompt-row">
        <span className="terminal-process-active">
          [PROCESS ACTIVE — INPUT LOCKED]
        </span>
      </div>
    );
  }

  const displayPath = getDisplayPath(currentDir);

  if (personaMode) {
    return (
      <div className="terminal-prompt-row" onClick={() => inputRef.current?.focus()}>
        <span className="terminal-prompt">
          <span className="terminal-persona-prompt">persona({personaMode})&gt; </span>
        </span>
        <input
          ref={inputRef}
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
      </div>
    );
  }

  return (
    <div className="terminal-prompt-row" onClick={() => inputRef.current?.focus()}>
      <span className="terminal-prompt">
        <span className="terminal-prompt-user">user@hacker</span>
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
    </div>
  );
}
