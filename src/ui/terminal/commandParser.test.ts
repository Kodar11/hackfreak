import { describe, it, expect } from 'vitest';
import { parseCommand } from './commandParser';

describe('parseCommand', () => {
  describe('simple commands', () => {
    it('should parse help command', () => {
      const result = parseCommand('help');
      expect(result.command).toBe('help');
      expect(result.subcommand).toBe('');
      expect(result.args).toEqual([]);
      expect(result.raw).toBe('help');
    });

    it('should parse command with single argument', () => {
      const result = parseCommand('scan target');
      expect(result.command).toBe('scan');
      expect(result.subcommand).toBe('');
      expect(result.args).toEqual(['target']);
      expect(result.raw).toBe('scan target');
    });

    it('should parse command with multiple arguments', () => {
      const result = parseCommand('scan target1 target2');
      expect(result.command).toBe('scan');
      expect(result.subcommand).toBe('');
      expect(result.args).toEqual(['target1', 'target2']);
    });

    it('should parse status command', () => {
      const result = parseCommand('status');
      expect(result.command).toBe('status');
      expect(result.subcommand).toBe('');
      expect(result.args).toEqual([]);
    });
  });

  describe('compound commands', () => {
    it('should parse ai analyze command', () => {
      const result = parseCommand('ai analyze rahul');
      expect(result.command).toBe('ai');
      expect(result.subcommand).toBe('analyze');
      expect(result.args).toEqual(['rahul']);
      expect(result.raw).toBe('ai analyze rahul');
    });

    it('should parse persona create command', () => {
      const result = parseCommand('persona create john');
      expect(result.command).toBe('persona');
      expect(result.subcommand).toBe('create');
      expect(result.args).toEqual(['john']);
    });

    it('should parse persona set command with multiple args', () => {
      const result = parseCommand('persona set john city Mumbai');
      expect(result.command).toBe('persona');
      expect(result.subcommand).toBe('set');
      expect(result.args).toEqual(['john', 'city', 'Mumbai']);
    });

    it('should parse export report command', () => {
      const result = parseCommand('export report rahul');
      expect(result.command).toBe('export');
      expect(result.subcommand).toBe('report');
      expect(result.args).toEqual(['rahul']);
    });

    it('should parse persona show command', () => {
      const result = parseCommand('persona show john');
      expect(result.command).toBe('persona');
      expect(result.subcommand).toBe('show');
      expect(result.args).toEqual(['john']);
    });

    it('should parse persona list command', () => {
      const result = parseCommand('persona list');
      expect(result.command).toBe('persona');
      expect(result.subcommand).toBe('list');
      expect(result.args).toEqual([]);
    });

    it('should parse persona delete command', () => {
      const result = parseCommand('persona delete john');
      expect(result.command).toBe('persona');
      expect(result.subcommand).toBe('delete');
      expect(result.args).toEqual(['john']);
    });
  });

  describe('edge cases', () => {
    it('should handle empty input', () => {
      const result = parseCommand('');
      expect(result.command).toBe('');
      expect(result.subcommand).toBe('');
      expect(result.args).toEqual([]);
      expect(result.raw).toBe('');
    });

    it('should handle whitespace-only input', () => {
      const result = parseCommand('   ');
      expect(result.command).toBe('');
      expect(result.subcommand).toBe('');
      expect(result.args).toEqual([]);
      expect(result.raw).toBe('');
    });

    it('should trim extra whitespace', () => {
      const result = parseCommand('  scan   target  ');
      expect(result.command).toBe('scan');
      expect(result.args).toEqual(['target']);
      expect(result.raw).toBe('scan   target');
    });

    it('should convert command to lowercase', () => {
      const result = parseCommand('SCAN TARGET');
      expect(result.command).toBe('scan');
      expect(result.args).toEqual(['TARGET']);
    });

    it('should convert subcommand to lowercase', () => {
      const result = parseCommand('AI ANALYZE rahul');
      expect(result.command).toBe('ai');
      expect(result.subcommand).toBe('analyze');
      expect(result.args).toEqual(['rahul']);
    });

    it('should handle unknown compound command as simple command', () => {
      const result = parseCommand('persona unknown john');
      expect(result.command).toBe('persona');
      expect(result.subcommand).toBe('');
      expect(result.args).toEqual(['unknown', 'john']);
    });

    it('should handle command without subcommand when subcommand expected', () => {
      const result = parseCommand('ai');
      expect(result.command).toBe('ai');
      expect(result.subcommand).toBe('');
      expect(result.args).toEqual([]);
    });
  });
});
