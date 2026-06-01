import { useTerminalStore } from '../store/terminalStore';

const BACKGROUND_MESSAGES = [
  'Satellite heartbeat received.',
  'Threat database synchronized.',
  'Signal relay refreshed.',
  'Monitoring node online.',
  'Encryption keys rotated.',
  'Network scan completed.',
  'Intelligence feed updated.',
  'Secure channel verified.',
  'Backup sync completed.',
  'Anomaly detection active.',
];

let backgroundInterval: ReturnType<typeof setInterval> | null = null;

export function startBackgroundEngine(): void {
  if (backgroundInterval) return;

  backgroundInterval = setInterval(() => {
    const store = useTerminalStore.getState();
    if (store.isProcessing || store.isBooting || store.monitorActive) return;

    if (Math.random() < 0.3) {
      const msg = BACKGROUND_MESSAGES[Math.floor(Math.random() * BACKGROUND_MESSAGES.length)];
      store.addLine(`[BACKGROUND] ${msg}`, 'system');
    }
  }, 15000);
}

export function stopBackgroundEngine(): void {
  if (backgroundInterval) {
    clearInterval(backgroundInterval);
    backgroundInterval = null;
  }
}
