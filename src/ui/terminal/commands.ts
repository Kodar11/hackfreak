import { useTerminalStore, type ThreatLevel } from '../store/terminalStore';
import { usePersonaStore } from '../store/personaStore';
import { listDir, changeDir, getDisplayPath, readFile, writeFile } from './fileSystem';
import { parseCommand } from './commandParser';
import { runScene } from './sceneEngine';
import { randomScore, randomClassification } from './randomGenerators';
import { THEMES, applyTheme } from './themes';
import { maybeTriggerGlitch } from './glitchEngine';
import { runAuthorizationSequence } from './authorizationHelper';
import scanScene from './scenes/scan.json';
import traceScene from './scenes/trace.json';
import decryptScene from './scenes/decrypt.json';
import breachScene from './scenes/breach.json';
import analyzeScene from './scenes/analyze.json';
import locateScene from './scenes/locate.json';
import statusScene from './scenes/status.json';
import satelliteScene from './scenes/satellite.json';
import aiAnalyzeScene from './scenes/ai_analyze.json';
import lockdownScene from './scenes/lockdown.json';
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
  '  network <target>      Display target network graph',
  '  timeline <target>     Show target timeline',
  '  monitor <target>      Start live monitoring (Ctrl+C to stop)',
  '  report <target>       Generate intelligence report',
  '  investigate <target>  Run full investigation workflow',
  '',
  '  persona create <name> Create a new persona',
  '  persona show <name>   Display persona intelligence report',
  '  persona list          List all personas',
  '  persona set <n> <f> <v>  Set persona field',
  '  persona delete <name> Delete a persona',
  '',
  '  export report <name>  Export report to filesystem',
  '  lockdown              Initiate emergency lockdown',
  '  fullscreen            Toggle fullscreen mode (or press F11)',
  '  theme <name>          Change terminal theme (matrix/military/cyberpunk/amber)',
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
  lockdown: lockdownScene as Scene,
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
  lockdown: 'CRITICAL',
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
  store.addLine(`user@hackfreak:${displayPath} $ ${input}`, 'input');

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
        await runAuthorizationSequence('ai_analyze');
        const vars = buildVariables(target);
        const sceneKey = 'ai_analyze';
        store.setThreatLevel(THREAT_LEVELS[sceneKey] ?? 'LOW');
        await maybeTriggerGlitch();
        await runScene(sceneKey, SCENE_MAP[sceneKey], vars);
        store.setThreatLevel('LOW');
      } else {
        store.addLine(`ERROR: Unknown command "ai ${subcommand || ''}".`, 'error');
        store.addLine('Usage: ai analyze <target>', 'error');
      }
      break;
    }

    case 'theme': {
      const themeName = args[0]?.toLowerCase();
      if (!themeName || !THEMES[themeName]) {
        store.addLine('Available themes: matrix, military, cyberpunk, amber', 'output');
        store.addLine('Usage: theme <name>', 'output');
        break;
      }
      store.setTheme(themeName);
      applyTheme(themeName);
      store.addLine(`Theme changed to: ${themeName}`, 'success');
      break;
    }

    case 'network': {
      const target = args[0];
      if (!target) {
        store.addLine('Usage: network <target>', 'error');
        break;
      }

      const persona = usePersonaStore.getState().getPersona(target);
      if (!persona) {
        store.addLine(`Target "${target}" not found.`, 'error');
        break;
      }

      store.addLine('', 'output');
      store.addLine('--- Network Analysis ---', 'header');
      store.addLine('', 'output');
      store.addLine(target, 'system');

      const fields = Object.keys(persona).filter((k) => k !== 'name');
      fields.forEach((field, i) => {
        const isLast = i === fields.length - 1;
        const prefix = isLast ? '`-- ' : '|-- ';
        store.addLine(`${prefix}${field}`, 'output');
      });

      store.addLine('', 'output');
      break;
    }

    case 'timeline': {
      const target = args[0];
      if (!target) {
        store.addLine('Usage: timeline <target>', 'error');
        break;
      }

      const persona = usePersonaStore.getState().getPersona(target);
      const classification = randomClassification();

      store.addLine('', 'output');
      store.addLine('--- Timeline Reconstruction ---', 'header');
      store.addLine(`CLASSIFICATION: ${classification}`, 'system');
      store.addLine('', 'output');

      const events = [
        { time: '09:14', event: 'Device Activated' },
        { time: '09:22', event: 'Network Connected' },
        { time: '10:01', event: `Location Updated${persona?.city ? ` (${persona.city})` : ''}` },
        { time: '10:17', event: 'Social Activity Detected' },
        { time: '10:41', event: 'Signal Lost' },
        { time: '11:03', event: 'Signal Recovered' },
        { time: '11:28', event: 'Communication Intercepted' },
      ];

      events.forEach(({ time, event }) => {
        store.addLine(`[${time}] ${event}`, 'output');
      });

      store.addLine('', 'output');
      break;
    }

    case 'monitor': {
      const target = args[0];
      if (!target) {
        store.addLine('Usage: monitor <target>', 'error');
        break;
      }

      store.addLine(`Starting live monitor: ${target}`, 'system');
      store.addLine('Press Ctrl+C to stop', 'output');
      store.addLine('', 'output');
      store.setMonitorActive(true);

      const monitorLoop = async () => {
        while (useTerminalStore.getState().monitorActive) {
          const signal = randomScore(60, 99);
          const drift = randomScore(5, 50);
          const packets = randomScore(100, 500);

          store.addLine(`Signal Strength: ${signal}%`, 'output');
          store.addLine(`Location Drift: ${drift}m`, 'output');
          store.addLine('Connection Status: ACTIVE', 'success');
          store.addLine(`Packet Flow: ${packets}/s`, 'output');
          store.addLine('', 'output');

          await maybeTriggerGlitch();
          await new Promise((r) => setTimeout(r, 3000));
        }
      };

      monitorLoop();
      break;
    }

    case 'fullscreen': {
      const isCurrentlyFullscreen = store.isFullscreen;
      if (isCurrentlyFullscreen) {
        store.setFullscreen(false);
        store.addLine('Exiting Fullscreen Mode...', 'system');
        store.addLine('System Interface Restored.', 'success');
      } else {
        store.setFullscreen(true);
        store.addLine('Entering Fullscreen Mode...', 'system');
        store.addLine('System Interface Expanded.', 'success');
        store.addLine('Use F11 or fullscreen to exit.', 'output');
      }
      break;
    }

    case 'report': {
      const target = args[0];
      if (!target) {
        store.addLine('Usage: report <target>', 'error');
        break;
      }

      const persona = usePersonaStore.getState().getPersona(target);
      if (!persona) {
        store.addLine(`Target "${target}" not found. Create with: persona create ${target}`, 'error');
        break;
      }

      await generateReport(target, persona);
      break;
    }

    case 'investigate': {
      const target = args[0];
      if (!target) {
        store.addLine('Usage: investigate <target>', 'error');
        break;
      }

      await runAuthorizationSequence('investigate');
      await runInvestigation(target);
      break;
    }

    case 'export': {
      if (subcommand === 'report') {
        const target = args[0];
        if (!target) {
          store.addLine('Usage: export report <target>', 'error');
          break;
        }

        const persona = usePersonaStore.getState().getPersona(target);
        if (!persona) {
          store.addLine(`Target "${target}" not found.`, 'error');
          break;
        }

        await exportReport(target, persona);
      } else {
        store.addLine(`ERROR: Unknown export type "${subcommand || ''}".`, 'error');
        store.addLine('Usage: export report <target>', 'error');
      }
      break;
    }

    case 'satellite': {
      const target = args[0];
      await runAuthorizationSequence('satellite');
      const vars = buildVariables(target);
      store.setThreatLevel(THREAT_LEVELS['satellite'] ?? 'LOW');
      await maybeTriggerGlitch();
      await runScene('satellite', SCENE_MAP['satellite'], vars);
      store.setThreatLevel('LOW');
      break;
    }

    case 'lockdown': {
      await runAuthorizationSequence('lockdown');
      store.setThreatLevel('CRITICAL');
      await runScene('lockdown', SCENE_MAP['lockdown'], {});
      break;
    }

    default: {
      const scene = SCENE_MAP[command];
      if (scene) {
        const target = args[0];
        const vars = buildVariables(target);
        store.setThreatLevel(THREAT_LEVELS[command] ?? 'LOW');

        const glitchScenes = ['satellite', 'locate', 'ai_analyze'];
        if (glitchScenes.includes(command)) {
          await maybeTriggerGlitch();
        }

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

      const classification = randomClassification();
      const behaviorScore = randomScore(50, 95);
      const riskScore = randomScore(40, 90);
      const confidence = randomScore(70, 99);

      store.addLine('', 'output');
      store.addLine('=================================================', 'header');
      store.addLine('TARGET PROFILE', 'header');
      store.addLine('==============', 'header');
      store.addLine('', 'output');
      store.addLine(`NAME: ${persona.name || name}`, 'output');
      store.addLine(`LOCATION: ${persona.city || 'UNKNOWN'}`, 'output');
      store.addLine('', 'output');
      store.addLine(`CLASSIFICATION: ${classification}`, 'system');
      store.addLine('', 'output');
      store.addLine(`Behavior Score: ${behaviorScore}`, 'output');
      store.addLine(`Risk Score: ${riskScore}`, 'output');
      store.addLine(`Confidence: ${confidence}%`, 'output');
      store.addLine('', 'output');
      store.addLine('Known Assets:', 'system');

      const assets = Object.keys(persona).filter((k) => k !== 'name');
      assets.forEach((asset) => {
        store.addLine(`  - ${asset}`, 'output');
      });

      store.addLine('', 'output');
      store.addLine('Status: ACTIVE', 'success');
      store.addLine('=================================================', 'header');
      store.addLine('', 'output');
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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateReport(target: string, persona: Record<string, string>): Promise<void> {
  const store = useTerminalStore.getState();

  const classification = randomClassification();
  const behaviorScore = randomScore(50, 95);
  const riskScore = randomScore(40, 90);
  const confidence = randomScore(70, 99);

  const assets = Object.keys(persona).filter((k) => k !== 'name');
  const targetName = persona.name || target;

  store.addLine('', 'output');
  store.addLine('================================================', 'header');
  store.addLine('INTELLIGENCE REPORT', 'header');
  store.addLine('================================================', 'header');
  store.addLine('', 'output');
  store.addLine(`Target: ${targetName}`, 'output');
  store.addLine('', 'output');
  store.addLine(`Classification: ${classification}`, 'system');
  store.addLine('', 'output');
  store.addLine(`Risk Score: ${riskScore}`, 'output');
  store.addLine(`Behavior Score: ${behaviorScore}`, 'output');
  store.addLine(`Confidence: ${confidence}%`, 'output');
  store.addLine('', 'output');
  store.addLine('Known Assets:', 'system');

  assets.forEach((asset) => {
    store.addLine(`  - ${asset}`, 'output');
  });

  store.addLine('', 'output');
  store.addLine('Summary:', 'system');
  store.addLine('  Target exhibits elevated communication activity', 'output');
  store.addLine('  across multiple channels.', 'output');
  store.addLine('', 'output');
  store.addLine('  Behavioral indicators suggest moderate', 'output');
  store.addLine('  operational risk.', 'output');
  store.addLine('', 'output');
  store.addLine('================================================', 'header');
  store.addLine('', 'output');
}

async function runInvestigation(target: string): Promise<void> {
  const store = useTerminalStore.getState();
  const persona = usePersonaStore.getState().getPersona(target);

  store.setProcessing(true);
  store.setThreatLevel('HIGH');

  try {
    store.addLine('', 'output');
    store.addLine('--- INVESTIGATION PROTOCOL ---', 'header');
    store.addLine(`Target: ${target}`, 'system');
    store.addLine('', 'output');

    store.addLine('Phase 1: Asset Discovery', 'header');
    await delay(500);
    store.addLine('  Scanning Assets...', 'system');
    await delay(800);
    store.addLine('  Locating Endpoints...', 'system');
    await delay(800);
    store.addLine('  Correlating Identities...', 'system');
    await delay(800);
    store.addLine('  Generating Profile...', 'system');
    await delay(600);
    store.addLine('', 'output');

    await maybeTriggerGlitch();

    store.addLine('Phase 2: Deep Analysis', 'header');
    await delay(500);

    if (persona) {
      store.addLine(`  Running: persona show ${target}`, 'output');
      await delay(300);
      await generateReport(target, persona);

      store.addLine(`  Running: network ${target}`, 'output');
      await delay(300);
      const fields = Object.keys(persona).filter((k) => k !== 'name');
      store.addLine('', 'output');
      store.addLine('--- Network Analysis ---', 'header');
      store.addLine(target, 'system');
      fields.forEach((field, i) => {
        const isLast = i === fields.length - 1;
        const prefix = isLast ? '`-- ' : '|-- ';
        store.addLine(`${prefix}${field}`, 'output');
      });
      store.addLine('', 'output');
      await delay(500);

      store.addLine(`  Running: timeline ${target}`, 'output');
      await delay(300);
      const classification = randomClassification();
      store.addLine('', 'output');
      store.addLine('--- Timeline Reconstruction ---', 'header');
      store.addLine(`CLASSIFICATION: ${classification}`, 'system');
      store.addLine('', 'output');
      const events = [
        { time: '09:14', event: 'Device Activated' },
        { time: '09:22', event: 'Network Connected' },
        { time: '10:01', event: `Location Updated${persona?.city ? ` (${persona.city})` : ''}` },
        { time: '10:17', event: 'Social Activity Detected' },
        { time: '10:41', event: 'Signal Lost' },
        { time: '11:03', event: 'Signal Recovered' },
        { time: '11:28', event: 'Communication Intercepted' },
      ];
      events.forEach(({ time, event }) => {
        store.addLine(`[${time}] ${event}`, 'output');
      });
      store.addLine('', 'output');
      await delay(500);

      store.addLine(`  Running: ai analyze ${target}`, 'output');
      await delay(300);
      const vars = buildVariables(target);
      await runScene('ai_analyze', SCENE_MAP['ai_analyze'], vars);
    } else {
      store.addLine(`  Target "${target}" has no persona data.`, 'error');
      store.addLine(`  Create with: persona create ${target}`, 'output');
    }

    await maybeTriggerGlitch();

    store.addLine('', 'output');
    store.addLine('Phase 3: Investigation Summary', 'header');
    await delay(600);

    const assetCount = persona ? Object.keys(persona).filter((k) => k !== 'name').length : 0;
    const finalConfidence = randomScore(85, 98);
    const threatLevel: ThreatLevel = assetCount > 3 ? 'HIGH' : assetCount > 1 ? 'MEDIUM' : 'LOW';

    store.addLine('', 'output');
    store.addLine('================================================', 'header');
    store.addLine('INVESTIGATION COMPLETE', 'header');
    store.addLine('================================================', 'header');
    store.addLine('', 'output');
    store.addLine(`Assets Correlated: ${assetCount}`, 'output');
    store.addLine(`Threat Level: ${threatLevel}`, 'system');
    store.addLine(`Confidence: ${finalConfidence}%`, 'output');
    store.addLine('', 'output');
    store.addLine('================================================', 'header');
    store.addLine('', 'output');

    store.setThreatLevel(threatLevel);
  } finally {
    store.setProcessing(false);
  }
}

async function exportReport(target: string, persona: Record<string, string>): Promise<void> {
  const store = useTerminalStore.getState();

  store.addLine(`Exporting report for ${target}...`, 'system');
  await delay(500);

  const classification = randomClassification();
  const behaviorScore = randomScore(50, 95);
  const riskScore = randomScore(40, 90);
  const confidence = randomScore(70, 99);
  const assets = Object.keys(persona).filter((k) => k !== 'name');
  const targetName = persona.name || target;

  const reportContent = [
    '================================================',
    'INTELLIGENCE REPORT',
    '================================================',
    '',
    `Target: ${targetName}`,
    '',
    `Classification: ${classification}`,
    '',
    `Risk Score: ${riskScore}`,
    `Behavior Score: ${behaviorScore}`,
    `Confidence: ${confidence}%`,
    '',
    'Known Assets:',
    ...assets.map((a) => `  - ${a}`),
    '',
    'Summary:',
    '  Target exhibits elevated communication activity',
    '  across multiple channels.',
    '',
    '  Behavioral indicators suggest moderate',
    '  operational risk.',
    '',
    '================================================',
  ].join('\n');

  const filePath = `/intelligence/reports/${target}_report.txt`;
  const result = writeFile(filePath, reportContent);

  if (result.success) {
    store.addLine('Report exported successfully.', 'success');
    store.addLine(`Location: ${filePath}`, 'output');
    store.addLine(`View with: cat ${filePath}`, 'output');
  } else {
    store.addLine(`Export failed: ${result.error}`, 'error');
  }
}

export const ALL_COMMANDS = [
  'help', 'ls', 'cd', 'pwd', 'cat', 'clear',
  'scan', 'trace', 'decrypt', 'breach', 'analyze', 'locate', 'status',
  'satellite', 'ai analyze',
  'network', 'monitor', 'timeline', 'report', 'investigate',
  'persona create', 'persona show', 'persona list', 'persona set', 'persona delete',
  'export report',
  'lockdown', 'fullscreen', 'theme',
];
