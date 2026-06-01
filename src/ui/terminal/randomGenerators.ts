export function randomIP(): string {
  const octets = [
    Math.floor(Math.random() * 223) + 1,
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 254) + 1,
  ];
  return octets.join('.');
}

export function randomHash(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function randomShortHash(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 16; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function randomServerName(): string {
  const prefixes = ['NODE', 'SRV', 'HOST', 'GATEWAY', 'PROXY', 'RELAY', 'DAEMON', 'CORE'];
  const suffixes = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'OMEGA', 'SIGMA', 'THETA', 'ZETA'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${prefix}-${suffix}-${num}`;
}

export function randomPort(): number {
  const ports = [22, 80, 443, 8080, 8443, 3306, 5432, 6379, 27017, 9200, 1433, 3389, 5900, 8888, 9090];
  return ports[Math.floor(Math.random() * ports.length)];
}

export function randomMAC(): string {
  const hex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
  return Array.from({ length: 6 }, hex).join(':');
}

export function randomPID(): number {
  return Math.floor(Math.random() * 65535) + 1;
}

export function randomHexBlock(): string {
  const chars = '0123456789ABCDEF';
  let block = '';
  for (let i = 0; i < 4; i++) {
    block += chars[Math.floor(Math.random() * chars.length)];
  }
  return block;
}

export function randomCoordinate(): string {
  const lat = (Math.random() * 180 - 90).toFixed(4);
  const lon = (Math.random() * 360 - 180).toFixed(4);
  const latDir = parseFloat(lat) >= 0 ? 'N' : 'S';
  const lonDir = parseFloat(lon) >= 0 ? 'E' : 'W';
  return `${Math.abs(parseFloat(lat)).toFixed(4)}${latDir}, ${Math.abs(parseFloat(lon)).toFixed(4)}${lonDir}`;
}

export function randomPercent(): number {
  return Math.floor(Math.random() * 100) + 1;
}

export function randomLatency(): number {
  return Math.floor(Math.random() * 200) + 1;
}

export function randomBytes(): string {
  const units = ['KB', 'MB', 'GB'];
  const unit = units[Math.floor(Math.random() * units.length)];
  const value = (Math.random() * 1000).toFixed(1);
  return `${value} ${unit}`;
}

export function randomProtocol(): string {
  const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'SSH', 'FTP', 'DNS'];
  return protocols[Math.floor(Math.random() * protocols.length)];
}
