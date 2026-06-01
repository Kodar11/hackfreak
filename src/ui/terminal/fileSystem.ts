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
    },
  },
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
