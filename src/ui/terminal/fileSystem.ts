interface FileNode {
  type: 'file' | 'directory';
  children?: Record<string, FileNode>;
}

const fileSystem: Record<string, FileNode> = {
  '/': {
    type: 'directory',
    children: {
      intelligence: {
        type: 'directory',
        children: {
          operations: {
            type: 'directory',
            children: {
              'op_falcon.dat': { type: 'file' },
              'op_nightfall.dat': { type: 'file' },
              'op_specter.enc': { type: 'file' },
            },
          },
          dossiers: {
            type: 'directory',
            children: {
              'target_alpha.txt': { type: 'file' },
              'target_bravo.txt': { type: 'file' },
              'handler_contacts.enc': { type: 'file' },
            },
          },
          signals: {
            type: 'directory',
            children: {
              'intercepts.db': { type: 'file' },
              'frequency_log.dat': { type: 'file' },
            },
          },
          satellites: {
            type: 'directory',
            children: {
              'sat_feed.db': { type: 'file' },
              'orbit_data.json': { type: 'file' },
            },
          },
          'intercepts.log': { type: 'file' },
          'threat_assessment.pdf': { type: 'file' },
        },
      },
      archives: {
        type: 'directory',
        children: {
          '2024': {
            type: 'directory',
            children: {
              'jan_backup.tar.gz': { type: 'file' },
              'feb_backup.tar.gz': { type: 'file' },
              'mar_backup.tar.gz': { type: 'file' },
            },
          },
          '2025': {
            type: 'directory',
            children: {
              'jan_backup.tar.gz': { type: 'file' },
              'feb_backup.tar.gz': { type: 'file' },
            },
          },
          'legacy_data.zip': { type: 'file' },
          'old_keys.pem': { type: 'file' },
        },
      },
      network: {
        type: 'directory',
        children: {
          configs: {
            type: 'directory',
            children: {
              'firewall.rules': { type: 'file' },
              'routing.conf': { type: 'file' },
              'proxy.cfg': { type: 'file' },
            },
          },
          scans: {
            type: 'directory',
            children: {
              'last_scan.xml': { type: 'file' },
              'vuln_report.html': { type: 'file' },
            },
          },
          'hosts.txt': { type: 'file' },
          'network_map.svg': { type: 'file' },
        },
      },
      systems: {
        type: 'directory',
        children: {
          kernel: {
            type: 'directory',
            children: {
              'modules.conf': { type: 'file' },
              'sysctl.conf': { type: 'file' },
            },
          },
          services: {
            type: 'directory',
            children: {
              'ssh.service': { type: 'file' },
              'httpd.service': { type: 'file' },
              'cron.service': { type: 'file' },
            },
          },
          'boot.log': { type: 'file' },
          'uptime.dat': { type: 'file' },
        },
      },
      logs: {
        type: 'directory',
        children: {
          'auth.log': { type: 'file' },
          'syslog': { type: 'file' },
          'access.log': { type: 'file' },
          'error.log': { type: 'file' },
          'kern.log': { type: 'file' },
        },
      },
      projects: {
        type: 'directory',
        children: {
          cipher: {
            type: 'directory',
            children: {
              'main.py': { type: 'file' },
              'keys.py': { type: 'file' },
              'README.md': { type: 'file' },
            },
          },
          phantom: {
            type: 'directory',
            children: {
              'exploit.sh': { type: 'file' },
              'payload.bin': { type: 'file' },
              'config.yml': { type: 'file' },
            },
          },
          'notes.txt': { type: 'file' },
        },
      },
      targets: {
        type: 'directory',
        children: {
          'active_targets.db': { type: 'file' },
          'assets.db': { type: 'file' },
          'watchlist.csv': { type: 'file' },
        },
      },
      personas: {
        type: 'directory',
        children: {},
      },
    },
  },
};

const fileContents: Record<string, string> = {
  '/intelligence/intercepts.log': [
    '=== SIGNAL INTERCEPT LOG ===',
    'Timestamp: 2025-06-01 03:14:22 UTC',
    'Source: 185.220.101.34 -> 10.0.0.47',
    'Protocol: Encrypted (TLS 1.3)',
    'Payload size: 4,096 bytes',
    'Status: CAPTURED — awaiting decryption',
    '',
    'Timestamp: 2025-06-01 03:17:58 UTC',
    'Source: 91.219.236.18 -> 10.0.0.12',
    'Protocol: Custom (unknown)',
    'Payload size: 512 bytes',
    'Status: FLAGGED — anomalous pattern detected',
  ].join('\n'),

  '/intelligence/threat_assessment.pdf': [
    '[BINARY FILE — PDF]',
    'Title: Quarterly Threat Assessment Q2-2025',
    'Classification: TOP SECRET // NOFORN',
    'Pages: 47',
    'Author: SIGINT Division',
  ].join('\n'),

  '/intelligence/signals/intercepts.db': [
    '=== SIGNALS DATABASE ===',
    'Total records: 14,892',
    'Active channels: 23',
    'Last update: 2025-06-01 04:00:00 UTC',
    '',
    'Channel 1: 142.5 MHz — ACTIVE',
    'Channel 2: 437.2 MHz — ACTIVE',
    'Channel 3: 1.2 GHz  — INTERMITTENT',
    'Channel 4: 2.4 GHz  — ENCRYPTED',
  ].join('\n'),

  '/intelligence/signals/frequency_log.dat': [
    '=== FREQUENCY ANALYSIS LOG ===',
    'Scan period: 2025-05-28 to 2025-06-01',
    'Anomalies detected: 7',
    'New signals: 3',
    'Decommissioned: 1',
    '',
    'Peak activity: 0300-0400 UTC',
    'Dominant modulation: QPSK',
  ].join('\n'),

  '/intelligence/satellites/sat_feed.db': [
    '=== SATELLITE FEED DATABASE ===',
    'Active satellites: 12',
    'Coverage: Global',
    'Resolution: 0.12m (optical) / 0.5m (SAR)',
    '',
    'KH-18 CRYSTAL  — Orbit: LEO 264km — Status: ONLINE',
    'KH-19 ONYX     — Orbit: LEO 312km — Status: ONLINE',
    'SIGINT-7       — Orbit: GEO       — Status: ONLINE',
    'RELAY-3        — Orbit: MEO       — Status: STANDBY',
  ].join('\n'),

  '/intelligence/satellites/orbit_data.json': [
    '{',
    '  "satellite": "KH-18 CRYSTAL",',
    '  "orbit": {',
    '    "altitude_km": 264,',
    '    "inclination_deg": 97.4,',
    '    "period_min": 89.2',
    '  },',
    '  "next_pass": "2025-06-01T05:23:00Z",',
    '  "coverage_window_sec": 847',
    '}',
  ].join('\n'),

  '/targets/active_targets.db': [
    '=== ACTIVE TARGETS DATABASE ===',
    'Classification: SECRET',
    'Last sync: 2025-06-01 02:00:00 UTC',
    '',
    'ID: TGT-0001  Codename: FALCON     Status: UNDER SURVEILLANCE',
    'ID: TGT-0002  Codename: SPECTER    Status: ACTIVE',
    'ID: TGT-0003  Codename: NIGHTFALL  Status: DORMANT',
    'ID: TGT-0004  Codename: WRAITH     Status: ACTIVE',
    'ID: TGT-0005  Codename: PHANTOM    Status: PENDING REVIEW',
    '',
    'Total active: 3 | Dormant: 1 | Pending: 1',
  ].join('\n'),

  '/targets/assets.db': [
    '=== FIELD ASSETS DATABASE ===',
    'Classification: TOP SECRET',
    '',
    'Asset: AGENT-7    Location: Southeast Asia   Status: DEPLOYED',
    'Asset: AGENT-12   Location: Eastern Europe   Status: DEPLOYED',
    'Asset: AGENT-19   Location: North Africa     Status: STANDBY',
    'Asset: AGENT-23   Location: South America    Status: RECALLED',
    '',
    'Total deployed: 2 | Standby: 1 | Recalled: 1',
  ].join('\n'),

  '/targets/watchlist.csv': [
    'id,codename,priority,last_seen,status',
    'TGT-0001,FALCON,HIGH,2025-05-31,ACTIVE',
    'TGT-0002,SPECTER,CRITICAL,2025-06-01,ACTIVE',
    'TGT-0003,NIGHTFALL,MEDIUM,2025-05-15,DORMANT',
    'TGT-0004,WRAITH,HIGH,2025-05-30,ACTIVE',
    'TGT-0005,PHANTOM,LOW,2025-04-22,PENDING',
  ].join('\n'),

  '/network/hosts.txt': [
    '# Hacker Terminal Network Hosts',
    '10.0.0.1      gateway.local',
    '10.0.0.10     sigint.local',
    '10.0.0.11     crypto.local',
    '10.0.0.12     relay.local',
    '10.0.0.20     archive.local',
    '10.0.0.50     satellite.local',
  ].join('\n'),

  '/logs/auth.log': [
    'Jun  1 02:14:33 ht sshd[4821]: Accepted publickey for operator from 10.0.0.5',
    'Jun  1 02:15:01 ht sudo: operator : TTY=pts/0 ; COMMAND=/bin/systemctl status sshd',
    'Jun  1 03:22:17 ht sshd[5102]: Failed password for invalid user admin from 185.220.101.34',
    'Jun  1 03:22:19 ht sshd[5102]: Connection closed by 185.220.101.34 [preauth]',
    'Jun  1 04:01:44 ht sshd[5340]: Accepted publickey for analyst from 10.0.0.8',
  ].join('\n'),

  '/logs/syslog': [
    'Jun  1 00:00:01 ht CRON[3201]: (root) CMD (/usr/local/bin/signal_scan)',
    'Jun  1 01:00:01 ht CRON[3412]: (root) CMD (/usr/local/bin/signal_scan)',
    'Jun  1 02:00:01 ht CRON[3601]: (root) CMD (/usr/local/bin/db_sync)',
    'Jun  1 03:00:01 ht CRON[3801]: (root) CMD (/usr/local/bin/signal_scan)',
    'Jun  1 03:14:22 ht intercept[4012]: Signal captured from 185.220.101.34',
    'Jun  1 04:00:01 ht CRON[4201]: (root) CMD (/usr/local/bin/signal_scan)',
  ].join('\n'),

  '/systems/boot.log': [
    '[    0.000000] Hacker Terminal OS v4.2.1-hardened',
    '[    0.001234] CPU: Intel Xeon E-2388G @ 3.20GHz',
    '[    0.005678] Memory: 64GB DDR4 ECC',
    '[    0.123456] Loading kernel modules...',
    '[    0.234567] Mounting encrypted volumes...',
    '[    0.345678] Initializing network interfaces...',
    '[    0.456789] Starting security services...',
    '[    0.567890] System ready.',
  ].join('\n'),

  '/intelligence/dossiers/target_alpha.txt': [
    '=== TARGET DOSSIER: ALPHA ===',
    'Classification: TOP SECRET',
    '',
    'Codename: ALPHA',
    'Real Identity: [REDACTED]',
    'Last Known Location: Eastern Europe',
    'Threat Level: HIGH',
    'Known Associates: 4',
    'Communication Method: Encrypted satellite',
    'Status: UNDER ACTIVE SURVEILLANCE',
  ].join('\n'),

  '/intelligence/dossiers/target_bravo.txt': [
    '=== TARGET DOSSIER: BRAVO ===',
    'Classification: SECRET',
    '',
    'Codename: BRAVO',
    'Real Identity: [REDACTED]',
    'Last Known Location: Southeast Asia',
    'Threat Level: MEDIUM',
    'Known Associates: 2',
    'Communication Method: Encrypted messaging',
    'Status: MONITORING',
  ].join('\n'),
};

function resolvePathSegments(currentPath: string, target: string): string {
  if (target.startsWith('/')) {
    return normalizePath(target);
  }

  const currentSegments = currentPath === '/' ? [] : currentPath.split('/').filter(Boolean);
  const targetSegments = target.split('/').filter(Boolean);

  for (const seg of targetSegments) {
    if (seg === '..') {
      currentSegments.pop();
    } else if (seg !== '.') {
      currentSegments.push(seg);
    }
  }

  return normalizePath('/' + currentSegments.join('/'));
}

function normalizePath(p: string): string {
  const segments = p.split('/').filter(Boolean);
  const result: string[] = [];
  for (const seg of segments) {
    if (seg === '..') {
      result.pop();
    } else if (seg !== '.') {
      result.push(seg);
    }
  }
  return '/' + result.join('/');
}

function getNode(path: string): FileNode | null {
  const normalized = normalizePath(path);
  if (normalized === '/') return fileSystem['/'];

  const segments = normalized.split('/').filter(Boolean);
  let current: FileNode = fileSystem['/'];

  for (const seg of segments) {
    if (current.type !== 'directory' || !current.children) return null;
    const child = current.children[seg];
    if (!child) return null;
    current = child;
  }

  return current;
}

export function listDir(currentPath: string): string[] {
  const node = getNode(currentPath);
  if (!node || node.type !== 'directory' || !node.children) return [];
  return Object.keys(node.children).sort();
}

export function changeDir(currentPath: string, target: string): { success: boolean; newPath: string; error?: string } {
  if (target === '~') {
    return { success: true, newPath: '/' };
  }

  const resolved = resolvePathSegments(currentPath, target);
  const node = getNode(resolved);

  if (!node) {
    return { success: false, newPath: currentPath, error: `cd: no such file or directory: ${target}` };
  }
  if (node.type !== 'directory') {
    return { success: false, newPath: currentPath, error: `cd: not a directory: ${target}` };
  }

  return { success: true, newPath: resolved };
}

export function getDisplayPath(path: string): string {
  if (path === '/') return '~';
  return '~/' + path.split('/').filter(Boolean).join('/');
}

export function pathExists(path: string): boolean {
  return getNode(path) !== null;
}

export function resolvePath(currentPath: string, target: string): string {
  if (target.startsWith('/')) {
    return normalizePath(target);
  }
  return resolvePathSegments(currentPath, target);
}

export function readFile(currentPath: string, target: string): { success: boolean; content?: string; error?: string } {
  const resolved = resolvePath(currentPath, target);
  const node = getNode(resolved);

  if (!node) {
    return { success: false, error: `cat: no such file: ${target}` };
  }
  if (node.type === 'directory') {
    return { success: false, error: `cat: is a directory: ${target}` };
  }

  const content = fileContents[resolved];
  if (content) {
    return { success: true, content };
  }

  return { success: false, error: `cat: ${target}: [BINARY DATA — cannot display]` };
}
