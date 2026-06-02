import { beforeEach, describe, it, expect } from 'vitest';
import { useTerminalStore } from './terminalStore';

const initialState = {
  lines: [],
  currentDir: '/',
  isProcessing: false,
  isBooting: false,
  bootComplete: false,
  threatLevel: 'LOW' as const,
  personaMode: null,
  sessionId: '',
  monitorActive: false,
  theme: 'matrix',
  isFullscreen: false,
  isGlitching: false,
};

const state = () => useTerminalStore.getState();

describe('terminalStore', () => {
  beforeEach(() => {
    useTerminalStore.setState(initialState);
  });

  describe('initial state', () => {
    it('should have correct initial values', () => {
      expect(state().lines).toEqual([]);
      expect(state().currentDir).toBe('/');
      expect(state().isProcessing).toBe(false);
      expect(state().isBooting).toBe(false);
      expect(state().bootComplete).toBe(false);
      expect(state().threatLevel).toBe('LOW');
      expect(state().personaMode).toBeNull();
      expect(state().sessionId).toBe('');
      expect(state().monitorActive).toBe(false);
      expect(state().theme).toBe('matrix');
      expect(state().isFullscreen).toBe(false);
      expect(state().isGlitching).toBe(false);
    });
  });

  describe('threat level management', () => {
    it('should set threat level to MEDIUM', () => {
      state().setThreatLevel('MEDIUM');
      expect(state().threatLevel).toBe('MEDIUM');
    });

    it('should set threat level to HIGH', () => {
      state().setThreatLevel('HIGH');
      expect(state().threatLevel).toBe('HIGH');
    });

    it('should set threat level to CRITICAL', () => {
      state().setThreatLevel('CRITICAL');
      expect(state().threatLevel).toBe('CRITICAL');
    });

    it('should set threat level back to LOW', () => {
      state().setThreatLevel('CRITICAL');
      state().setThreatLevel('LOW');
      expect(state().threatLevel).toBe('LOW');
    });

    it('should handle multiple threat level transitions', () => {
      state().setThreatLevel('MEDIUM');
      expect(state().threatLevel).toBe('MEDIUM');

      state().setThreatLevel('HIGH');
      expect(state().threatLevel).toBe('HIGH');

      state().setThreatLevel('CRITICAL');
      expect(state().threatLevel).toBe('CRITICAL');

      state().setThreatLevel('LOW');
      expect(state().threatLevel).toBe('LOW');
    });
  });

  describe('line management', () => {
    it('should add a line and return unique ID', () => {
      const id1 = state().addLine('Test line 1', 'output');
      const id2 = state().addLine('Test line 2', 'output');

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(state().lines).toHaveLength(2);
    });

    it('should add lines with correct type', () => {
      state().addLine('Output line', 'output');
      state().addLine('Error line', 'error');
      state().addLine('System line', 'system');
      state().addLine('Success line', 'success');

      expect(state().lines[0].type).toBe('output');
      expect(state().lines[1].type).toBe('error');
      expect(state().lines[2].type).toBe('system');
      expect(state().lines[3].type).toBe('success');
    });

    it('should update existing line', () => {
      const id = state().addLine('Initial text', 'output');

      state().updateLine(id, { text: 'Updated text' });

      const line = state().lines.find((l) => l.id === id);
      expect(line?.text).toBe('Updated text');
    });

    it('should update line progress', () => {
      const id = state().addLine('Progress', 'progress');

      state().updateLine(id, { progress: 50, progressLabel: 'Loading' });

      const line = state().lines.find((l) => l.id === id);
      expect(line?.progress).toBe(50);
      expect(line?.progressLabel).toBe('Loading');
    });

    it('should clear all lines', () => {
      state().addLine('Line 1', 'output');
      state().addLine('Line 2', 'output');
      state().addLine('Line 3', 'output');

      expect(state().lines).toHaveLength(3);

      state().clearLines();

      expect(state().lines).toHaveLength(0);
    });
  });

  describe('directory management', () => {
    it('should set current directory', () => {
      state().setCurrentDir('/intelligence');
      expect(state().currentDir).toBe('/intelligence');
    });

    it('should handle nested directories', () => {
      state().setCurrentDir('/intelligence/operations');
      expect(state().currentDir).toBe('/intelligence/operations');
    });
  });

  describe('processing state', () => {
    it('should set processing state', () => {
      state().setProcessing(true);
      expect(state().isProcessing).toBe(true);

      state().setProcessing(false);
      expect(state().isProcessing).toBe(false);
    });
  });

  describe('boot state', () => {
    it('should set booting state', () => {
      state().setBooting(true);
      expect(state().isBooting).toBe(true);

      state().setBooting(false);
      expect(state().isBooting).toBe(false);
    });

    it('should complete boot sequence', () => {
      state().setBooting(true);
      state().setBootComplete();

      expect(state().bootComplete).toBe(true);
      expect(state().isBooting).toBe(false);
    });
  });

  describe('persona mode', () => {
    it('should set persona mode', () => {
      state().setPersonaMode('rahul');
      expect(state().personaMode).toBe('rahul');

      state().setPersonaMode(null);
      expect(state().personaMode).toBeNull();
    });
  });

  describe('session management', () => {
    it('should set session ID', () => {
      state().setSessionId('ABC123');
      expect(state().sessionId).toBe('ABC123');
    });
  });

  describe('monitor state', () => {
    it('should set monitor active state', () => {
      state().setMonitorActive(true);
      expect(state().monitorActive).toBe(true);

      state().setMonitorActive(false);
      expect(state().monitorActive).toBe(false);
    });
  });

  describe('theme management', () => {
    it('should set theme', () => {
      state().setTheme('cyberpunk');
      expect(state().theme).toBe('cyberpunk');

      state().setTheme('military');
      expect(state().theme).toBe('military');

      state().setTheme('amber');
      expect(state().theme).toBe('amber');
    });
  });

  describe('fullscreen state', () => {
    it('should set fullscreen state', () => {
      state().setFullscreen(true);
      expect(state().isFullscreen).toBe(true);

      state().setFullscreen(false);
      expect(state().isFullscreen).toBe(false);
    });
  });

  describe('glitch state', () => {
    it('should set glitching state', () => {
      state().setGlitching(true);
      expect(state().isGlitching).toBe(true);

      state().setGlitching(false);
      expect(state().isGlitching).toBe(false);
    });
  });
});
