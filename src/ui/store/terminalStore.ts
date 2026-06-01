import { create } from 'zustand';

export type LineType = 'input' | 'output' | 'error' | 'system' | 'progress' | 'header' | 'success' | 'alert';

export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TerminalLine {
  id: string;
  type: LineType;
  text: string;
  progress?: number;
  progressLabel?: string;
}

interface TerminalState {
  lines: TerminalLine[];
  currentDir: string;
  isProcessing: boolean;
  isBooting: boolean;
  bootComplete: boolean;
  threatLevel: ThreatLevel;
  personaMode: string | null;
  addLine: (text: string, type: LineType) => string;
  updateLine: (id: string, updates: Partial<TerminalLine>) => void;
  clearLines: () => void;
  setCurrentDir: (dir: string) => void;
  setProcessing: (processing: boolean) => void;
  setBooting: (booting: boolean) => void;
  setBootComplete: () => void;
  setThreatLevel: (level: ThreatLevel) => void;
  setPersonaMode: (name: string | null) => void;
}

let lineCounter = 0;

export const useTerminalStore = create<TerminalState>((set) => ({
  lines: [],
  currentDir: '/',
  isProcessing: false,
  isBooting: false,
  bootComplete: false,
  threatLevel: 'LOW',
  personaMode: null,

  addLine: (text, type) => {
    const id = `line-${++lineCounter}-${Date.now()}`;
    set((state) => ({
      lines: [...state.lines, { id, type, text }],
    }));
    return id;
  },

  updateLine: (id, updates) => {
    set((state) => ({
      lines: state.lines.map((line) =>
        line.id === id ? { ...line, ...updates } : line
      ),
    }));
  },

  clearLines: () => set({ lines: [] }),

  setCurrentDir: (dir) => set({ currentDir: dir }),

  setProcessing: (processing) => set({ isProcessing: processing }),

  setBooting: (booting) => set({ isBooting: booting }),

  setBootComplete: () => set({ bootComplete: true, isBooting: false }),

  setThreatLevel: (level) => set({ threatLevel: level }),

  setPersonaMode: (name) => set({ personaMode: name }),
}));
