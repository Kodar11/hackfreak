import { useTerminalStore } from '../store/terminalStore';
import { randomSessionId } from './randomGenerators';

const BOOT_LINES: { text: string; type: 'system' | 'success' | 'header'; delay: number }[] = [
  { text: 'Initializing Hacker Terminal OS v4.2.1...', type: 'system', delay: 300 },
  { text: 'Loading Intelligence Module...          [OK]', type: 'success', delay: 250 },
  { text: 'Loading Signal Processing Layer...     [OK]', type: 'success', delay: 200 },
  { text: 'Loading Cryptography Engine...         [OK]', type: 'success', delay: 280 },
  { text: 'Loading Threat Database...             [OK]', type: 'success', delay: 220 },
  { text: 'Loading Satellite Uplink...            [OK]', type: 'success', delay: 300 },
  { text: 'Loading AI Core...                     [OK]', type: 'success', delay: 250 },
  { text: 'Establishing secure channels...        [OK]', type: 'success', delay: 350 },
  { text: '────────────────────────────────────────────────────', type: 'header', delay: 200 },
  { text: 'System Ready.', type: 'success', delay: 400 },
  { text: 'Type "help" to view available commands.', type: 'system', delay: 200 },
  { text: '', type: 'system', delay: 100 },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runBootSequence(): Promise<void> {
  const store = useTerminalStore.getState();
  store.setBooting(true);

  const sessionId = randomSessionId();
  store.setSessionId(sessionId);

  for (const line of BOOT_LINES) {
    store.addLine(line.text, line.type);
    await delay(line.delay);
  }

  store.addLine(`SESSION: ${sessionId}`, 'system');
  store.addLine('', 'output');

  store.setBootComplete();
}
