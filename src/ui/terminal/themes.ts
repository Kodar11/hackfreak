export interface Theme {
  name: string;
  bg: string;
  text: string;
  textDim: string;
  system: string;
  header: string;
  success: string;
  error: string;
  alert: string;
  promptUser: string;
  promptDir: string;
  promptSep: string;
  scanline: string;
  glow: string;
}

export const THEMES: Record<string, Theme> = {
  matrix: {
    name: 'matrix',
    bg: '#0a0a0a',
    text: '#00ff41',
    textDim: '#00cc33',
    system: '#00bfff',
    header: '#ffcc00',
    success: '#00ff41',
    error: '#ff3333',
    alert: '#ff8800',
    promptUser: '#00bfff',
    promptDir: '#ffcc00',
    promptSep: '#00ff41',
    scanline: 'rgba(0, 255, 65, 0.03)',
    glow: 'rgba(0, 255, 65, 0.15)',
  },
  military: {
    name: 'military',
    bg: '#1a1f1a',
    text: '#7c9473',
    textDim: '#5a7050',
    system: '#8b9d83',
    header: '#a8b89f',
    success: '#7c9473',
    error: '#c44e52',
    alert: '#d4a84b',
    promptUser: '#8b9d83',
    promptDir: '#a8b89f',
    promptSep: '#7c9473',
    scanline: 'rgba(124, 148, 115, 0.03)',
    glow: 'rgba(124, 148, 115, 0.15)',
  },
  cyberpunk: {
    name: 'cyberpunk',
    bg: '#0d0d1a',
    text: '#00ffff',
    textDim: '#00cccc',
    system: '#ff00ff',
    header: '#ffff00',
    success: '#00ff00',
    error: '#ff0066',
    alert: '#ff9900',
    promptUser: '#ff00ff',
    promptDir: '#ffff00',
    promptSep: '#00ffff',
    scanline: 'rgba(0, 255, 255, 0.03)',
    glow: 'rgba(0, 255, 255, 0.15)',
  },
  amber: {
    name: 'amber',
    bg: '#1a1400',
    text: '#ffb000',
    textDim: '#cc8c00',
    system: '#ffcc00',
    header: '#ffe066',
    success: '#ffb000',
    error: '#ff4444',
    alert: '#ff8800',
    promptUser: '#ffcc00',
    promptDir: '#ffe066',
    promptSep: '#ffb000',
    scanline: 'rgba(255, 176, 0, 0.03)',
    glow: 'rgba(255, 176, 0, 0.15)',
  },
};

export function applyTheme(themeName: string): void {
  const theme = THEMES[themeName];
  if (!theme) return;

  const root = document.documentElement;
  root.style.setProperty('--term-bg', theme.bg);
  root.style.setProperty('--term-text', theme.text);
  root.style.setProperty('--term-text-dim', theme.textDim);
  root.style.setProperty('--term-input', theme.text);
  root.style.setProperty('--term-error', theme.error);
  root.style.setProperty('--term-system', theme.system);
  root.style.setProperty('--term-header', theme.header);
  root.style.setProperty('--term-success', theme.success);
  root.style.setProperty('--term-alert', theme.alert);
  root.style.setProperty('--term-prompt-user', theme.promptUser);
  root.style.setProperty('--term-prompt-dir', theme.promptDir);
  root.style.setProperty('--term-prompt-sep', theme.promptSep);
  root.style.setProperty('--term-scanline', theme.scanline);
  root.style.setProperty('--term-glow', theme.glow);
}
