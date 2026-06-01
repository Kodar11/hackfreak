import { useTerminalStore } from '../store/terminalStore';

const ALERT_MESSAGES = [
  'WARNING: Unauthorized activity detected on port 8443.',
  'WARNING: Signal integrity compromised — channel 7.',
  'WARNING: Satellite relay unstable — switching backup.',
  'WARNING: Encryption mismatch detected in transit.',
  'WARNING: Threat signature identified — CODENAME WRAITH.',
  'WARNING: Anomalous traffic pattern observed.',
  'WARNING: Firewall rule bypass attempted from external.',
  'WARNING: Intrusion detection alert — sector 4.',
  'WARNING: Unusual login attempt from unknown origin.',
  'WARNING: Data exfiltration pattern detected.',
  'WARNING: Network probe detected on subnet 10.0.0.0/24.',
  'WARNING: Certificate validation failure on relay node.',
];

export function maybeInjectAlert(): void {
  if (Math.random() < 0.15) {
    const store = useTerminalStore.getState();
    const message = ALERT_MESSAGES[Math.floor(Math.random() * ALERT_MESSAGES.length)];
    store.addLine(message, 'alert');
  }
}
