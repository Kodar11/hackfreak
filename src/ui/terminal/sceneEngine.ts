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
import { maybeInjectAlert } from './alerts';

export interface SceneStep {
  type: 'log' | 'delay' | 'progress' | 'success' | 'error' | 'header' | 'system' | 'target_acquired' | 'access_granted';
  text?: string;
  duration?: number;
  label?: string;
  progressDuration?: number;
}

export interface Scene {
  steps: SceneStep[];
}

type Variables = Record<string, string>;

export function applyTemplates(text: string, variables: Variables): string {
  let result = text
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

  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }

  result = result.replace(/\{\{target\}\}/g, variables['target'] ?? 'UNSPECIFIED');
  result = result.replace(/\{\{name\}\}/g, variables['name'] ?? variables['target'] ?? 'UNKNOWN');
  result = result.replace(/\{\{(\w+)\}\}/g, (_match, key) => variables[key] ?? 'CLASSIFIED');

  return result;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function renderTargetAcquired(
  store: ReturnType<typeof useTerminalStore.getState>
): Promise<void> {
  store.addLine('', 'output');
  await delay(800);
  store.addLine('', 'output');
  store.addLine('>>>  Target Acquired  <<<', 'header');
  store.addLine('', 'output');
  await delay(1200);
}

async function renderAccessGranted(
  store: ReturnType<typeof useTerminalStore.getState>
): Promise<void> {
  store.addLine('', 'output');
  await delay(500);
  store.addLine('AUTHENTICATION ACCEPTED', 'success');
  await delay(300);
  store.addLine('ACCESS GRANTED', 'header');
  await delay(800);
  store.addLine('', 'output');
}

export async function runScene(sceneName: string, sceneData: Scene, variables: Variables = {}): Promise<void> {
  const store = useTerminalStore.getState();
  store.setProcessing(true);

  let stepCount = 0;

  try {
    for (const step of sceneData.steps) {
      const currentState = useTerminalStore.getState();
      if (!currentState.isProcessing) break;

      stepCount++;
      if (stepCount % 4 === 0) {
        maybeInjectAlert();
      }

      switch (step.type) {
        case 'log':
          if (step.text) {
            store.addLine(applyTemplates(step.text, variables), 'output');
          }
          await delay(80 + Math.random() * 120);
          break;

        case 'success':
          if (step.text) {
            store.addLine(applyTemplates(step.text, variables), 'success');
          }
          await delay(100);
          break;

        case 'error':
          if (step.text) {
            store.addLine(applyTemplates(step.text, variables), 'error');
          }
          await delay(100);
          break;

        case 'header':
          if (step.text) {
            store.addLine(applyTemplates(step.text, variables), 'header');
          }
          await delay(150);
          break;

        case 'system':
          if (step.text) {
            store.addLine(applyTemplates(step.text, variables), 'system');
          }
          await delay(100);
          break;

        case 'delay':
          await delay(step.duration ?? 1000);
          break;

        case 'target_acquired':
          await renderTargetAcquired(store);
          break;

        case 'access_granted':
          await renderAccessGranted(store);
          break;

        case 'progress': {
          const label = step.label ? applyTemplates(step.label, variables) : 'Processing';
          const lineId = store.addLine('', 'progress');
          const totalDuration = step.progressDuration ?? 2000;
          const steps = 20;
          const stepDelay = totalDuration / steps;

          for (let i = 0; i <= steps; i++) {
            const progress = Math.round((i / steps) * 100);
            const filled = Math.round((i / steps) * 30);
            const empty = 30 - filled;
            const bar = '#'.repeat(filled) + '.'.repeat(empty);
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
