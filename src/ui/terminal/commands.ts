import { useTerminalStore } from '../store/terminalStore';
import { listDir, changeDir, getDisplayPath } from './fileSystem';
import { parseCommand } from './commandParser';
import { runScene } from './sceneEngine';
import scanScene from './scenes/scan.json';
import traceScene from './scenes/trace.json';
import decryptScene from './scenes/decrypt.json';
import breachScene from './scenes/breach.json';
import analyzeScene from './scenes/analyze.json';
import locateScene from './scenes/locate.json';
import statusScene from './scenes/status.json';

const HELP_TEXT = [
  'Available commands:',
  '',
  '  help       Show this help message',
  '  ls         List directory contents',
  '  cd <dir>   Change directory',
  '  pwd        Print working directory',
  '  clear      Clear terminal output',
  '',
  '  scan       Run network scan simulation',
  '  trace      Trace target activity',
  '  decrypt    Decrypt encrypted files',
  '  breach     Launch breach simulation',
  '  analyze    Analyze collected data',
  '  locate     Search for target location',
  '  status     Show system status',
];

import type { Scene } from './sceneEngine';

const SCENE_MAP: Record<string, Scene> = {
  scan: scanScene as Scene,
  trace: traceScene as Scene,
  decrypt: decryptScene as Scene,
  breach: breachScene as Scene,
  analyze: analyzeScene as Scene,
  locate: locateScene as Scene,
  status: statusScene as Scene,
};

export async function executeCommand(input: string): Promise<void> {
  const store = useTerminalStore.getState();
  const displayPath = getDisplayPath(store.currentDir);
  store.addLine(`user@friction:${displayPath} $ ${input}`, 'input');

  const { command, args } = parseCommand(input);

  if (!command) return;

  switch (command) {
    case 'help': {
      for (const line of HELP_TEXT) {
        store.addLine(line, 'output');
      }
      break;
    }

    case 'ls': {
      const entries = listDir(store.currentDir);
      if (entries.length === 0) {
        store.addLine('(empty directory)', 'output');
      } else {
        for (const entry of entries) {
          store.addLine(`  ${entry}`, 'output');
        }
      }
      break;
    }

    case 'cd': {
      const target = args[0] ?? '~';
      const result = changeDir(store.currentDir, target);
      if (result.success) {
        store.setCurrentDir(result.newPath);
      } else {
        store.addLine(result.error ?? 'cd: error', 'error');
      }
      break;
    }

    case 'pwd': {
      store.addLine(getDisplayPath(store.currentDir), 'output');
      break;
    }

    case 'clear': {
      store.clearLines();
      break;
    }

    default: {
      const scene = SCENE_MAP[command];
      if (scene) {
        await runScene(command, scene);
      } else {
        store.addLine(`ERROR: Unknown command "${command}".`, 'error');
        store.addLine('Type "help" to view available commands.', 'error');
      }
    }
  }
}
