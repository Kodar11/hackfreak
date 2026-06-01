import { useTerminalStore } from '../store/terminalStore';

const GLITCH_PROBABILITY = 0.12;

const GLITCH_MESSAGES = [
  { text: 'SIGNAL LOST', type: 'alert' as const },
  { text: 'RECONNECTING...', type: 'system' as const },
  { text: 'RE-ESTABLISHING SECURE CHANNEL...', type: 'system' as const },
  { text: 'LINK RESTORED', type: 'success' as const },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function maybeTriggerGlitch(): Promise<void> {
  if (Math.random() > GLITCH_PROBABILITY) {
    return;
  }

  const store = useTerminalStore.getState();
  
  store.addLine('', 'output');
  store.setGlitching(true);
  
  for (const msg of GLITCH_MESSAGES) {
    store.addLine(msg.text, msg.type);
    await delay(400 + Math.random() * 300);
  }
  
  store.addLine('', 'output');
  store.setGlitching(false);
}

export async function forceGlitch(): Promise<void> {
  const store = useTerminalStore.getState();
  
  store.addLine('', 'output');
  store.setGlitching(true);
  
  for (const msg of GLITCH_MESSAGES) {
    store.addLine(msg.text, msg.type);
    await delay(400 + Math.random() * 300);
  }
  
  store.addLine('', 'output');
  store.setGlitching(false);
}
