import { describe, it, expect } from 'vitest';
import {
  randomScore,
  randomClassification,
  randomSessionId,
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

describe('randomGenerators', () => {
  describe('randomScore', () => {
    it('should return values within specified range', () => {
      for (let i = 0; i < 100; i++) {
        const score = randomScore(50, 95);
        expect(score).toBeGreaterThanOrEqual(50);
        expect(score).toBeLessThanOrEqual(95);
      }
    });

    it('should return integers only', () => {
      for (let i = 0; i < 100; i++) {
        const score = randomScore(1, 100);
        expect(Number.isInteger(score)).toBe(true);
      }
    });

    it('should handle min equals max', () => {
      const score = randomScore(50, 50);
      expect(score).toBe(50);
    });
  });

  describe('randomClassification', () => {
    it('should return valid classification levels', () => {
      const validLevels = ['PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL', 'LEVEL-7'];
      for (let i = 0; i < 50; i++) {
        const classification = randomClassification();
        expect(validLevels).toContain(classification);
      }
    });
  });

  describe('randomSessionId', () => {
    it('should match format XXXX-XXXX', () => {
      const pattern = /^[0-9A-F]{4}-[0-9A-F]{4}$/;
      for (let i = 0; i < 50; i++) {
        const sessionId = randomSessionId();
        expect(sessionId).toMatch(pattern);
      }
    });

    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 50; i++) {
        ids.add(randomSessionId());
      }
      // At least 45 out of 50 should be unique (allowing for rare collisions)
      expect(ids.size).toBeGreaterThanOrEqual(45);
    });
  });

  describe('randomIP', () => {
    it('should match IP format', () => {
      const pattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
      for (let i = 0; i < 50; i++) {
        const ip = randomIP();
        expect(ip).toMatch(pattern);
      }
    });

    it('should have valid octets (0-255)', () => {
      for (let i = 0; i < 50; i++) {
        const ip = randomIP();
        const octets = ip.split('.').map(Number);
        expect(octets).toHaveLength(4);
        octets.forEach(octet => {
          expect(octet).toBeGreaterThanOrEqual(0);
          expect(octet).toBeLessThanOrEqual(255);
        });
      }
    });
  });

  describe('randomHash', () => {
    it('should be 64 characters long', () => {
      for (let i = 0; i < 20; i++) {
        const hash = randomHash();
        expect(hash).toHaveLength(64);
      }
    });

    it('should contain only hex characters', () => {
      const pattern = /^[0-9a-f]{64}$/;
      for (let i = 0; i < 20; i++) {
        const hash = randomHash();
        expect(hash).toMatch(pattern);
      }
    });
  });

  describe('randomShortHash', () => {
    it('should be 16 characters long', () => {
      for (let i = 0; i < 20; i++) {
        const hash = randomShortHash();
        expect(hash).toHaveLength(16);
      }
    });

    it('should contain only hex characters', () => {
      const pattern = /^[0-9a-f]{16}$/;
      for (let i = 0; i < 20; i++) {
        const hash = randomShortHash();
        expect(hash).toMatch(pattern);
      }
    });
  });

  describe('randomServerName', () => {
    it('should match format PREFIX-SUFFIX-NUMBER', () => {
      const pattern = /^[A-Z]+-[A-Z]+-\d+$/;
      for (let i = 0; i < 50; i++) {
        const name = randomServerName();
        expect(name).toMatch(pattern);
      }
    });
  });

  describe('randomPort', () => {
    it('should return valid port numbers', () => {
      const validPorts = [22, 80, 443, 8080, 8443, 3306, 5432, 6379, 27017, 9200, 1433, 3389, 5900, 8888, 9090];
      for (let i = 0; i < 50; i++) {
        const port = randomPort();
        expect(validPorts).toContain(port);
      }
    });
  });

  describe('randomMAC', () => {
    it('should match MAC address format', () => {
      const pattern = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;
      for (let i = 0; i < 50; i++) {
        const mac = randomMAC();
        expect(mac).toMatch(pattern);
      }
    });
  });

  describe('randomPID', () => {
    it('should return values between 1 and 65535', () => {
      for (let i = 0; i < 100; i++) {
        const pid = randomPID();
        expect(pid).toBeGreaterThanOrEqual(1);
        expect(pid).toBeLessThanOrEqual(65535);
        expect(Number.isInteger(pid)).toBe(true);
      }
    });
  });

  describe('randomHexBlock', () => {
    it('should be 4 characters long', () => {
      for (let i = 0; i < 50; i++) {
        const block = randomHexBlock();
        expect(block).toHaveLength(4);
      }
    });

    it('should contain only uppercase hex characters', () => {
      const pattern = /^[0-9A-F]{4}$/;
      for (let i = 0; i < 50; i++) {
        const block = randomHexBlock();
        expect(block).toMatch(pattern);
      }
    });
  });

  describe('randomCoordinate', () => {
    it('should match coordinate format', () => {
      const pattern = /^\d+\.\d{4}[NS], \d+\.\d{4}[EW]$/;
      for (let i = 0; i < 50; i++) {
        const coord = randomCoordinate();
        expect(coord).toMatch(pattern);
      }
    });
  });

  describe('randomPercent', () => {
    it('should return values between 1 and 100', () => {
      for (let i = 0; i < 100; i++) {
        const percent = randomPercent();
        expect(percent).toBeGreaterThanOrEqual(1);
        expect(percent).toBeLessThanOrEqual(100);
        expect(Number.isInteger(percent)).toBe(true);
      }
    });
  });

  describe('randomLatency', () => {
    it('should return values between 1 and 200', () => {
      for (let i = 0; i < 100; i++) {
        const latency = randomLatency();
        expect(latency).toBeGreaterThanOrEqual(1);
        expect(latency).toBeLessThanOrEqual(200);
        expect(Number.isInteger(latency)).toBe(true);
      }
    });
  });

  describe('randomBytes', () => {
    it('should match format with unit', () => {
      const pattern = /^\d+\.\d (KB|MB|GB)$/;
      for (let i = 0; i < 50; i++) {
        const bytes = randomBytes();
        expect(bytes).toMatch(pattern);
      }
    });
  });

  describe('randomProtocol', () => {
    it('should return valid protocols', () => {
      const validProtocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'SSH', 'FTP', 'DNS'];
      for (let i = 0; i < 50; i++) {
        const protocol = randomProtocol();
        expect(validProtocols).toContain(protocol);
      }
    });
  });
});
