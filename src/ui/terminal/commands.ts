import { useTerminalStore, type ThreatLevel } from '../store/terminalStore';
import { usePersonaStore } from '../store/personaStore';
import { listDir, changeDir, getDisplayPath, readFile } from './fileSystem';
import { parseCommand } from './commandParser';
import { runScene } from './sceneEngine';
import scanScene from './scenes/scan.json';
import traceScene from './scenes/trace.json';
import decryptScene from './scenes/decrypt.json';
import breachScene from './scenes/breach.json';
import analyzeScene from './scenes/analyze.json';
import locateScene from './scenes/locate.json';
import statusScene from './scenes/status.json';
import satelliteScene from './scenes/satellite.json';
import aiAnalyzeScene from './scenes/ai_analyze.json';
import type { Scene } from './sceneEngine';

const HELP_TEXT = [
  'Available commands:',
  '',
  '  help                  Show this help message',
  '  ls                    List directory contents',
  '  cd <dir>              Change directory',
  '  pwd                   Print working directory',
  '  cat <file>            Display file contents',
  '  clear                 Clear terminal output',
  '',
  '  scan [target]         Run network scan simulation',
  '  trace [target]        Trace target activity',
  '  decrypt [target]      Decrypt encrypted files',
  '  breach [target]       Launch breach simulation',
  '  analyze [target]      Analyze collected data',
  '  locate [target]       Search for target location',
  '  status                Show system status',
  '  satellite [target]    Acquire satellite feed',
  '  ai analyze [target]   AI behavioral analysis',
  '',
  '  persona create <name> Create a new persona',
  '  persona show <name>   Display persona details',
  '  persona list          List all personas',
  '  persona set <n> <f> <v>  Set persona field',
  '  persona delete <name> Delete a persona',
];

const SCENE_MAP: Record<string, Scene> = {
  scan: scanScene as Scene,
  trace: traceScene as Scene,
  decrypt: decryptScene as Scene,
  breach: breachScene as Scene,
  analyze: analyzeScene as Scene,
  locate: locateScene as Scene,
  status: statusScene as Scene,
  satellite: satelliteScene as Scene,
  ai_analyze: aiAnalyzeScene as Scene,
};

const THREAT_LEVELS: Record<string, ThreatLevel> = {
  scan: 'LOW',
  trace: 'MEDIUM',
  analyze: 'MEDIUM',
  locate: 'HIGH',
  satellite: 'HIGH',
  decrypt: 'MEDIUM',
  breach: 'CRITICAL',
  ai_analyze: 'MEDIUM',
};

function buildVariables(target: string | undefined): Record<string, string> {
  const vars: Record<string, string> = {};
  if (target) {
    vars['target'] = target;
    const persona = usePersonaStore.getState().getPersona(target);
    if (persona) {
      for (const [key, value] of Object.entries(persona)) {
        vars[key] = value;
      }
    }
  }
  return vars;
}

export async function executeCommand(input: string): Promise<void> {
  const store = useTerminalStore.getState();
  const displayPath = getDisplayPath(store.currentDir);
  store.addLine(`user@hacker:${displayPath} $ ${input}`, 'input');

  const { command, subcommand, args } = parseCommand(input);

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

    case 'cat': {
      if (!args[0]) {
        store.addLine('cat: missing file argument', 'error');
        break;
      }
      const result = readFile(store.currentDir, args[0]);
      if (result.success && result.content) {
        for (const line of result.content.split('\n')) {
          store.addLine(line, 'output');
        }
      } else {
        store.addLine(result.error ?? 'cat: error', 'error');
      }
      break;
    }

    case 'clear': {
      store.clearLines();
      break;
    }

    case 'persona': {
      await handlePersona(subcommand, args);
      break;
    }

    case 'ai': {
      if (subcommand === 'analyze') {
        const target = args[0];
        const vars = buildVariables(target);
        const sceneKey = 'ai_analyze';
        store.setThreatLevel(THREAT_LEVELS[sceneKey] ?? 'LOW');
        await runScene(sceneKey, SCENE_MAP[sceneKey], vars);
        store.setThreatLevel('LOW');
      } else {
        store.addLine(`ERROR: Unknown command "ai ${subcommand || ''}".`, 'error');
        store.addLine('Usage: ai analyze <target>', 'error');
      }
      break;
    }

    default: {
      const scene = SCENE_MAP[command];
      if (scene) {
        const target = args[0];
        const vars = buildVariables(target);
        store.setThreatLevel(THREAT_LEVELS[command] ?? 'LOW');
        await runScene(command, scene, vars);
        store.setThreatLevel('LOW');
      } else {
        store.addLine(`ERROR: Unknown command "${command}".`, 'error');
        store.addLine('Type "help" to view available commands.', 'error');
      }
    }
  }
}

async function handlePersona(subcommand: string, args: string[]): Promise<void> {
  const store = useTerminalStore.getState();
  const personaStore = usePersonaStore.getState();

  switch (subcommand) {
    case 'create': {
      const name = args[0];
      if (!name) {
        store.addLine('Usage: persona create <name>', 'error');
        break;
      }
      if (personaStore.personaExists(name)) {
        store.addLine(`Persona "${name}" already exists. Use "persona set" to update.`, 'error');
        break;
      }
      personaStore.createPersona(name);
      store.addLine(`Creating persona: ${name}`, 'system');
      store.addLine('', 'output');
      store.addLine('Enter data using:', 'output');
      store.addLine('  field=value', 'output');
      store.addLine('', 'output');
      store.addLine('Type "done" when finished.', 'output');
      store.addLine('', 'output');
      store.setPersonaMode(name.toLowerCase());
      break;
    }

    case 'show': {
      const name = args[0];
      if (!name) {
        store.addLine('Usage: persona show <name>', 'error');
        break;
      }
      const persona = personaStore.getPersona(name);
      if (!persona) {
        store.addLine(`Persona "${name}" not found.`, 'error');
        break;
      }
      store.addLine(`── PERSONA: ${name.toUpperCase()} ──`, 'header');
      const entries = Object.entries(persona);
      if (entries.length === 0) {
        store.addLine('  (no fields set)', 'output');
      } else {
        for (const [field, value] of entries) {
          store.addLine(`  ${field.padEnd(16)} ${value}`, 'output');
        }
      }
      break;
    }

    case 'list': {
      const names = personaStore.listPersonas();
      if (names.length === 0) {
        store.addLine('No personas found.', 'output');
      } else {
        store.addLine('Stored personas:', 'system');
        for (const name of names) {
          const fields = Object.keys(personaStore.getPersona(name) ?? {}).length;
          store.addLine(`  ${name}  (${fields} fields)`, 'output');
        }
      }
      break;
    }

    case 'set': {
      const name = args[0];
      const field = args[1];
      const value = args.slice(2).join(' ');
      if (!name || !field || !value) {
        store.addLine('Usage: persona set <name> <field> <value>', 'error');
        break;
      }
      if (!personaStore.personaExists(name)) {
        store.addLine(`Persona "${name}" not found.`, 'error');
        break;
      }
      personaStore.setField(name, field, value);
      store.addLine(`Updated ${name}.${field} = ${value}`, 'success');
      break;
    }

    case 'delete': {
      const name = args[0];
      if (!name) {
        store.addLine('Usage: persona delete <name>', 'error');
        break;
      }
      if (!personaStore.personaExists(name)) {
        store.addLine(`Persona "${name}" not found.`, 'error');
        break;
      }
      personaStore.deletePersona(name);
      store.addLine(`Persona "${name}" deleted.`, 'success');
      break;
    }

    default: {
      store.addLine('Usage: persona <create|show|list|set|delete>', 'error');
    }
  }
}
