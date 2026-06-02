import { describe, it, expect } from 'vitest';
import { applyTemplates } from './sceneEngine';

describe('sceneEngine', () => {
  describe('applyTemplates', () => {
    describe('variable replacement', () => {
      it('should replace single variable', () => {
        const result = applyTemplates('Scanning {{target}}', { target: 'rahul' });
        expect(result).toBe('Scanning rahul');
      });

      it('should replace multiple variables', () => {
        const result = applyTemplates('{{name}} from {{city}}', {
          name: 'Rahul',
          city: 'Mumbai',
        });
        expect(result).toBe('Rahul from Mumbai');
      });

      it('should replace same variable multiple times', () => {
        const result = applyTemplates('{{target}} and {{target}}', { target: 'rahul' });
        expect(result).toBe('rahul and rahul');
      });

      it('should handle empty variables object', () => {
        const result = applyTemplates('No variables here', {});
        expect(result).toBe('No variables here');
      });

      it('should preserve text without placeholders', () => {
        const result = applyTemplates('Plain text', { target: 'rahul' });
        expect(result).toBe('Plain text');
      });
    });

    describe('missing variables', () => {
      it('should replace missing target with UNSPECIFIED', () => {
        const result = applyTemplates('Target: {{target}}', {});
        expect(result).toBe('Target: UNSPECIFIED');
      });

      it('should replace missing name with UNKNOWN', () => {
        const result = applyTemplates('Name: {{name}}', {});
        expect(result).toBe('Name: UNKNOWN');
      });

      it('should use target as fallback for name', () => {
        const result = applyTemplates('Name: {{name}}', { target: 'rahul' });
        expect(result).toBe('Name: rahul');
      });

      it('should replace unknown placeholders with CLASSIFIED', () => {
        const result = applyTemplates('Data: {{unknown}}', {});
        expect(result).toBe('Data: CLASSIFIED');
      });

      it('should handle multiple unknown placeholders', () => {
        const result = applyTemplates('{{foo}} and {{bar}}', {});
        expect(result).toBe('CLASSIFIED and CLASSIFIED');
      });
    });

    describe('built-in placeholders', () => {
      it('should replace {{ip}} with valid IP format', () => {
        const result = applyTemplates('IP: {{ip}}', {});
        expect(result).toMatch(/^IP: \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
      });

      it('should replace {{hash}} with 64-char hex string', () => {
        const result = applyTemplates('Hash: {{hash}}', {});
        expect(result).toMatch(/^Hash: [0-9a-f]{64}$/);
      });

      it('should replace {{shortHash}} with 16-char hex string', () => {
        const result = applyTemplates('Hash: {{shortHash}}', {});
        expect(result).toMatch(/^Hash: [0-9a-f]{16}$/);
      });

      it('should replace {{server}} with server name format', () => {
        const result = applyTemplates('Server: {{server}}', {});
        expect(result).toMatch(/^Server: [A-Z]+-[A-Z]+-\d+$/);
      });

      it('should replace {{port}} with valid port number', () => {
        const result = applyTemplates('Port: {{port}}', {});
        expect(result).toMatch(/^Port: \d+$/);
      });

      it('should replace {{mac}} with MAC address format', () => {
        const result = applyTemplates('MAC: {{mac}}', {});
        expect(result).toMatch(/^MAC: ([0-9A-F]{2}:){5}[0-9A-F]{2}$/);
      });

      it('should replace {{pid}} with process ID', () => {
        const result = applyTemplates('PID: {{pid}}', {});
        expect(result).toMatch(/^PID: \d+$/);
      });

      it('should replace {{hex}} with 4-char hex block', () => {
        const result = applyTemplates('Hex: {{hex}}', {});
        expect(result).toMatch(/^Hex: [0-9A-F]{4}$/);
      });

      it('should replace {{coord}} with coordinate format', () => {
        const result = applyTemplates('Coord: {{coord}}', {});
        expect(result).toMatch(/^Coord: \d+\.\d{4}[NS], \d+\.\d{4}[EW]$/);
      });

      it('should replace {{percent}} with number', () => {
        const result = applyTemplates('Percent: {{percent}}', {});
        expect(result).toMatch(/^Percent: \d+$/);
      });

      it('should replace {{latency}} with number', () => {
        const result = applyTemplates('Latency: {{latency}}', {});
        expect(result).toMatch(/^Latency: \d+$/);
      });

      it('should replace {{bytes}} with size format', () => {
        const result = applyTemplates('Size: {{bytes}}', {});
        expect(result).toMatch(/^Size: \d+\.\d (KB|MB|GB)$/);
      });

      it('should replace {{protocol}} with valid protocol', () => {
        const result = applyTemplates('Protocol: {{protocol}}', {});
        const validProtocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'SSH', 'FTP', 'DNS'];
        const protocol = result.replace('Protocol: ', '');
        expect(validProtocols).toContain(protocol);
      });
    });

    describe('mixed placeholders', () => {
      it('should handle mix of built-in and custom variables', () => {
        const result = applyTemplates('Scanning {{target}} at {{ip}}', { target: 'rahul' });
        expect(result).toMatch(/^Scanning rahul at \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
      });

      it('should handle multiple built-in placeholders', () => {
        const result = applyTemplates('{{ip}}:{{port}}', {});
        expect(result).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d+$/);
      });

      it('should prioritize custom variables over built-in', () => {
        const result = applyTemplates('Target: {{target}}', { target: 'custom' });
        expect(result).toBe('Target: custom');
      });
    });

    describe('edge cases', () => {
      it('should handle empty text', () => {
        const result = applyTemplates('', { target: 'rahul' });
        expect(result).toBe('');
      });

      it('should handle text with no placeholders', () => {
        const result = applyTemplates('Just plain text', {});
        expect(result).toBe('Just plain text');
      });

      it('should handle special characters in text', () => {
        const result = applyTemplates('Special: !@#$%^&*()', {});
        expect(result).toBe('Special: !@#$%^&*()');
      });

      it('should handle newlines in text', () => {
        const result = applyTemplates('Line 1\nLine 2', {});
        expect(result).toBe('Line 1\nLine 2');
      });

      it('should handle variables with special characters', () => {
        const result = applyTemplates('Value: {{data}}', { data: 'test-value_123' });
        expect(result).toBe('Value: test-value_123');
      });
    });
  });
});
