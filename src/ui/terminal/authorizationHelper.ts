import { useTerminalStore } from '../store/terminalStore';

export type ClearanceLevel = 'LEVEL-3' | 'LEVEL-5' | 'LEVEL-7';

const CLEARANCE_REQUIREMENTS: Record<string, ClearanceLevel> = {
  satellite: 'LEVEL-5',
  ai_analyze: 'LEVEL-5',
  investigate: 'LEVEL-7',
  lockdown: 'LEVEL-7',
};

const CURRENT_CLEARANCE: ClearanceLevel = 'LEVEL-7';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRequiredClearance(command: string): ClearanceLevel | null {
  return CLEARANCE_REQUIREMENTS[command] ?? null;
}

export async function runAuthorizationSequence(command: string): Promise<boolean> {
  const store = useTerminalStore.getState();
  const required = getRequiredClearance(command);
  
  if (!required) {
    return true;
  }

  store.addLine('', 'output');
  store.addLine('AUTHORIZATION REQUIRED', 'header');
  store.addLine('', 'output');
  store.addLine(`Current Clearance:  ${CURRENT_CLEARANCE}`, 'system');
  store.addLine(`Required Clearance: ${required}`, 'system');
  store.addLine('', 'output');
  
  await delay(600);
  
  store.addLine('Verifying Clearance...', 'system');
  await delay(500);
  
  store.addLine('Checking Session Credentials...', 'system');
  await delay(500);
  
  store.addLine('Evaluating Access Policy...', 'system');
  await delay(700);
  
  store.addLine('', 'output');
  store.addLine('ACCESS GRANTED', 'success');
  store.addLine('', 'output');
  
  await delay(500);
  
  return true;
}
