import { describe, it, expect } from 'vitest';
import { useTerminalStore } from './terminalStore';

describe('terminalStore', () => {
  describe('initial state', () => {
    it('should have correct initial values', () => {
      const store = useTerminalStore.getState();
      
      expect(store.lines).toEqual([]);
      expect(store.currentDir).toBe('/');
      expect(store.isProcessing).toBe(false);
      expect(store.isBooting).toBe(false);
      expect(store.bootComplete).toBe(false);
      expect(store.threatLevel).toBe('LOW');
      expect(store.personaMode).toBeNull();
      expect(store.sessionId).toBe('');
      expect(store.monitorActive).toBe(false);
      expect(store.theme).toBe('matrix');
      expect(store.isFullscreen).toBe(false);
      expect(store.isGlitching).toBe(false);
    });
  });

  describe('threat level management', () => {
    it('should set threat level to MEDIUM', () => {
      const store = useTerminalStore.getState();
      store.setThreatLevel('MEDIUM');
      expect(store.threatLevel).toBe('MEDIUM');
    });

    it('should set threat level to HIGH', () => {
      const store = useTerminalStore.getState();
      store.setThreatLevel('HIGH');
      expect(store.threatLevel).toBe('HIGH');
    });

    it('should set threat level to CRITICAL', () => {
      const store = useTerminalStore.getState();
      store.setThreatLevel('CRITICAL');
      expect(store.threatLevel).toBe('CRITICAL');
    });

    it('should set threat level back to LOW', () => {
      const store = useTerminalStore.getState();
      store.setThreatLevel('CRITICAL');
      store.setThreatLevel('LOW');
      expect(store.threatLevel).toBe('LOW');
    });

    it('should handle multiple threat level transitions', () => {
      const store = useTerminalStore.getState();
      
      store.setThreatLevel('MEDIUM');
      expect(store.threatLevel).toBe('MEDIUM');
      
      store.setThreatLevel('HIGH');
      expect(store.threatLevel).toBe('HIGH');
      
      store.setThreatLevel('CRITICAL');
      expect(store.threatLevel).toBe('CRITICAL');
      
      store.setThreatLevel('LOW');
      expect(store.threatLevel).toBe('LOW');
    });
  });

  describe('line management', () => {
    it('should add a line and return unique ID', () => {
      const store = useTerminalStore.getState();
      const id1 = store.addLine('Test line 1', 'output');
      const id2 = store.addLine('Test line 2', 'output');
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(store.lines).toHaveLength(2);
    });

    it('should add lines with correct type', () => {
      const store = useTerminalStore.getState();
      store.addLine('Output line', 'output');
      store.addLine('Error line', 'error');
      store.addLine('System line', 'system');
      store.addLine('Success line', 'success');
      
      expect(store.lines[0].type).toBe('output');
      expect(store.lines[1].type).toBe('error');
      expect(store.lines[2].type).toBe('system');
      expect(store.lines[3].type).toBe('success');
    });

    it('should update existing line', () => {
      const store = useTerminalStore.getState();
      const id = store.addLine('Initial text', 'output');
      
      store.updateLine(id, { text: 'Updated text' });
      
      const line = store.lines.find(l => l.id === id);
      expect(line?.text).toBe('Updated text');
    });

    it('should update line progress', () => {
      const store = useTerminalStore.getState();
      const id = store.addLine('Progress', 'progress');
      
      store.updateLine(id, { progress: 50, progressLabel: 'Loading' });
      
      const line = store.lines.find(l => l.id === id);
      expect(line?.progress).toBe(50);
      expect(line?.progressLabel).toBe('Loading');
    });

    it('should clear all lines', () => {
      const store = useTerminalStore.getState();
      store.addLine('Line 1', 'output');
      store.addLine('Line 2', 'output');
      store.addLine('Line 3', 'output');
      
      expect(store.lines).toHaveLength(3);
      
      store.clearLines();
      
      expect(store.lines).toHaveLength(0);
    });
  });

  describe('directory management', () => {
    it('should set current directory', () => {
      const store = useTerminalStore.getState();
      store.setCurrentDir('/intelligence');
      expect(store.currentDir).toBe('/intelligence');
    });

    it('should handle nested directories', () => {
      const store = useTerminalStore.getState();
      store.setCurrentDir('/intelligence/operations');
      expect(store.currentDir).toBe('/intelligence/operations');
    });
  });

  describe('processing state', () => {
    it('should set processing state', () => {
      const store = useTerminalStore.getState();
      
      store.setProcessing(true);
      expect(store.isProcessing).toBe(true);
      
      store.setProcessing(false);
      expect(store.isProcessing).toBe(false);
    });
  });

  describe('boot state', () => {
    it('should set booting state', () => {
      const store = useTerminalStore.getState();
      
      store.setBooting(true);
      expect(store.isBooting).toBe(true);
      
      store.setBooting(false);
      expect(store.isBooting).toBe(false);
    });

    it('should complete boot sequence', () => {
      const store = useTerminalStore.getState();
      
      store.setBooting(true);
      store.setBootComplete();
      
      expect(store.bootComplete).toBe(true);
      expect(store.isBooting).toBe(false);
    });
  });

  describe('persona mode', () => {
    it('should set persona mode', () => {
      const store = useTerminalStore.getState();
      
      store.setPersonaMode('rahul');
      expect(store.personaMode).toBe('rahul');
      
      store.setPersonaMode(null);
      expect(store.personaMode).toBeNull();
    });
  });

  describe('session management', () => {
    it('should set session ID', () => {
      const store = useTerminalStore.getState();
      store.setSessionId('ABC123');
      expect(store.sessionId).toBe('ABC123');
    });
  });

  describe('monitor state', () => {
    it('should set monitor active state', () => {
      const store = useTerminalStore.getState();
      
      store.setMonitorActive(true);
      expect(store.monitorActive).toBe(true);
      
      store.setMonitorActive(false);
      expect(store.monitorActive).toBe(false);
    });
  });

  describe('theme management', () => {
    it('should set theme', () => {
      const store = useTerminalStore.getState();
      
      store.setTheme('cyberpunk');
      expect(store.theme).toBe('cyberpunk');
      
      store.setTheme('military');
      expect(store.theme).toBe('military');
      
      store.setTheme('amber');
      expect(store.theme).toBe('amber');
    });
  });

  describe('fullscreen state', () => {
    it('should set fullscreen state', () => {
      const store = useTerminalStore.getState();
      
      store.setFullscreen(true);
      expect(store.isFullscreen).toBe(true);
      
      store.setFullscreen(false);
      expect(store.isFullscreen).toBe(false);
    });
  });

  describe('glitch state', () => {
    it('should set glitching state', () => {
      const store = useTerminalStore.getState();
      
      store.setGlitching(true);
      expect(store.isGlitching).toBe(true);
      
      store.setGlitching(false);
      expect(store.isGlitching).toBe(false);
    });
  });
});
