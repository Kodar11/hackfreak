import { beforeEach } from 'vitest';
import { usePersonaStore } from '../ui/store/personaStore';
import { useTerminalStore } from '../ui/store/terminalStore';

beforeEach(() => {
  // Reset persona store before each test
  usePersonaStore.setState({ personas: {} });
  
  // Reset terminal store before each test
  useTerminalStore.setState({
    lines: [],
    currentDir: '/',
    isProcessing: false,
    isBooting: false,
    bootComplete: false,
    threatLevel: 'LOW',
    personaMode: null,
    sessionId: '',
    monitorActive: false,
    theme: 'matrix',
    isFullscreen: false,
    isGlitching: false,
  });
});
