import { useTerminalStore } from '../store/terminalStore';
import {
  randomIP,
  randomHash,
  randomShortHash,
  randomServerName,
  randomPort,
  randomMAC,
  randomPID,
  randomHexBlock,
  randomCoordinate,
  randomPercent,
  randomLatency,
  randomBytes,
  randomProtocol,
} from './randomGenerators';

export interface SceneStep {
  type: 'log' | 'delay' | 'progress' | 'success' | 'error' | 'header' | 'system';
  text?: string;
  duration?: number;
  label?: string;
  progressDuration?: number;
}

export interface Scene {
  steps: SceneStep[];
}

function applyTemplates(text: string): string {
  return text
    .replace(/\{\{ip\}\}/g, randomIP())
    .replace(/\{\{hash\}\}/g, randomHash())
    .replace(/\{\{shortHash\}\}/g, randomShortHash())
    .replace(/\{\{server\}\}/g, randomServerName())
    .replace(/\{\{port\}\}/g, String(randomPort()))
    .replace(/\{\{mac\}\}/g, randomMAC())
    .replace(/\{\{pid\}\}/g, String(randomPID()))
    .replace(/\{\{hex\}\}/g, randomHexBlock())
    .replace(/\{\{coord\}\}/g, randomCoordinate())
    .replace(/\{\{percent\}\}/g, String(randomPercent()))
    .replace(/\{\{latency\}\}/g, String(randomLatency()))
    .replace(/\{\{bytes\}\}/g, randomBytes())
    .replace(/\{\{protocol\}\}/g, randomProtocol());
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runScene(sceneName: string, sceneData: Scene): Promise<void> {
  const store = useTerminalStore.getState();
  store.setProcessing(true);

  try {
    for (const step of sceneData.steps) {
      const currentState = useTerminalStore.getState();
      if (!currentState.isProcessing) break;

      switch (step.type) {
        case 'log':
          if (step.text) {
            store.addLine(applyTemplates(step.text), 'output');
          }
          await delay(80 + Math.random() * 120);
          break;

        case 'success':
          if (step.text) {
            store.addLine(applyTemplates(step.text), 'success');
          }
          await delay(100);
          break;

        case 'error':
          if (step.text) {
            store.addLine(applyTemplates(step.text), 'error');
          }
          await delay(100);
          break;

        case 'header':
          if (step.text) {
            store.addLine(applyTemplates(step.text), 'header');
          }
          await delay(150);
          break;

        case 'system':
          if (step.text) {
            store.addLine(applyTemplates(step.text), 'system');
          }
          await delay(100);
          break;

        case 'delay':
          await delay(step.duration ?? 1000);
          break;

        case 'progress': {
          const label = step.label ? applyTemplates(step.label) : 'Processing';
          const lineId = store.addLine('', 'progress');
          const totalDuration = step.progressDuration ?? 2000;
          const steps = 20;
          const stepDelay = totalDuration / steps;

          for (let i = 0; i <= steps; i++) {
            const progress = Math.round((i / steps) * 100);
            const filled = Math.round((i / steps) * 30);
            const empty = 30 - filled;
            const bar = '█'.repeat(filled) + '░'.repeat(empty);
            store.updateLine(lineId, {
              text: `${label}: [${bar}] ${progress}%`,
              progress,
              progressLabel: label,
            });
            await delay(stepDelay);
          }
          break;
        }
      }
    }

    store.addLine('', 'output');
  } finally {
    store.setProcessing(false);
  }
}
