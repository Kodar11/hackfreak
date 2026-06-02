import { describe, it, expect } from 'vitest';
import {
  listDir,
  changeDir,
  getDisplayPath,
  pathExists,
  readFile,
  writeFile,
  ensureDirectory,
} from './fileSystem';

describe('fileSystem', () => {
  describe('listDir', () => {
    it('should list root directories', () => {
      const entries = listDir('/');
      expect(entries.length).toBeGreaterThan(0);
      expect(entries).toContain('intelligence');
      expect(entries).toContain('network');
      expect(entries).toContain('targets');
    });

    it('should list subdirectory contents', () => {
      const entries = listDir('/intelligence');
      expect(entries.length).toBeGreaterThan(0);
      expect(entries).toContain('operations');
      expect(entries).toContain('dossiers');
    });

    it('should return empty array for non-existent directory', () => {
      const entries = listDir('/nonexistent');
      expect(entries).toEqual([]);
    });

    it('should return empty array for file path', () => {
      const entries = listDir('/intelligence/intercepts.log');
      expect(entries).toEqual([]);
    });

    it('should return sorted entries', () => {
      const entries = listDir('/');
      const sorted = [...entries].sort();
      expect(entries).toEqual(sorted);
    });
  });

  describe('changeDir', () => {
    it('should navigate to subdirectory', () => {
      const result = changeDir('/', 'intelligence');
      expect(result.success).toBe(true);
      expect(result.newPath).toBe('/intelligence');
    });

    it('should navigate to parent directory', () => {
      const result = changeDir('/intelligence', '..');
      expect(result.success).toBe(true);
      expect(result.newPath).toBe('/');
    });

    it('should navigate to nested directory', () => {
      const result = changeDir('/intelligence', 'operations');
      expect(result.success).toBe(true);
      expect(result.newPath).toBe('/intelligence/operations');
    });

    it('should handle absolute paths', () => {
      const result = changeDir('/intelligence', '/network');
      expect(result.success).toBe(true);
      expect(result.newPath).toBe('/network');
    });

    it('should handle home directory shortcut', () => {
      const result = changeDir('/intelligence/operations', '~');
      expect(result.success).toBe(true);
      expect(result.newPath).toBe('/');
    });

    it('should fail for non-existent directory', () => {
      const result = changeDir('/', 'nonexistent');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.newPath).toBe('/');
    });

    it('should fail for file path', () => {
      const result = changeDir('/', 'intelligence/intercepts.log');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle multiple parent navigations', () => {
      const result = changeDir('/intelligence/operations', '../..');
      expect(result.success).toBe(true);
      expect(result.newPath).toBe('/');
    });
  });

  describe('getDisplayPath', () => {
    it('should display root as ~', () => {
      const display = getDisplayPath('/');
      expect(display).toBe('~');
    });

    it('should display subdirectory with ~ prefix', () => {
      const display = getDisplayPath('/intelligence');
      expect(display).toBe('~/intelligence');
    });

    it('should display nested directory', () => {
      const display = getDisplayPath('/intelligence/operations');
      expect(display).toBe('~/intelligence/operations');
    });
  });

  describe('pathExists', () => {
    it('should return true for existing directory', () => {
      expect(pathExists('/intelligence')).toBe(true);
      expect(pathExists('/network')).toBe(true);
      expect(pathExists('/targets')).toBe(true);
    });

    it('should return true for existing file', () => {
      expect(pathExists('/intelligence/intercepts.log')).toBe(true);
    });

    it('should return false for non-existent path', () => {
      expect(pathExists('/nonexistent')).toBe(false);
      expect(pathExists('/intelligence/nonexistent')).toBe(false);
    });

    it('should return true for root', () => {
      expect(pathExists('/')).toBe(true);
    });
  });

  describe('readFile', () => {
    it('should read file with content', () => {
      const result = readFile('/', 'intelligence/intercepts.log');
      expect(result.success).toBe(true);
      expect(result.content).toBeDefined();
      expect(result.content?.length).toBeGreaterThan(0);
    });

    it('should fail for non-existent file', () => {
      const result = readFile('/', 'nonexistent.txt');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should fail for directory', () => {
      const result = readFile('/', 'intelligence');
      expect(result.success).toBe(false);
      expect(result.error).toContain('is a directory');
    });

    it('should handle absolute paths', () => {
      const result = readFile('/intelligence', 'intercepts.log');
      expect(result.success).toBe(true);
      expect(result.content).toBeDefined();
    });

    it('should return binary data message for files without content', () => {
      const result = readFile('/', 'intelligence/operations/op_falcon.dat');
      expect(result.success).toBe(false);
      expect(result.error).toContain('BINARY DATA');
    });
  });

  describe('writeFile', () => {
    it('should write file to existing directory', () => {
      const result = writeFile('/intelligence/test.txt', 'Test content');
      expect(result.success).toBe(true);
      
      const readResult = readFile('/', 'intelligence/test.txt');
      expect(readResult.success).toBe(true);
      expect(readResult.content).toBe('Test content');
    });

    it('should create directory if it does not exist', () => {
      const result = writeFile('/newdir/test.txt', 'Test content');
      expect(result.success).toBe(true);
      
      expect(pathExists('/newdir')).toBe(true);
      expect(pathExists('/newdir/test.txt')).toBe(true);
    });

    it('should create nested directories', () => {
      const result = writeFile('/a/b/c/test.txt', 'Test content');
      expect(result.success).toBe(true);
      
      expect(pathExists('/a')).toBe(true);
      expect(pathExists('/a/b')).toBe(true);
      expect(pathExists('/a/b/c')).toBe(true);
      expect(pathExists('/a/b/c/test.txt')).toBe(true);
    });

    it('should overwrite existing file', () => {
      writeFile('/intelligence/overwrite.txt', 'Initial content');
      const result = writeFile('/intelligence/overwrite.txt', 'Updated content');
      
      expect(result.success).toBe(true);
      
      const readResult = readFile('/', 'intelligence/overwrite.txt');
      expect(readResult.content).toBe('Updated content');
    });
  });

  describe('ensureDirectory', () => {
    it('should create directory', () => {
      ensureDirectory('/testdir');
      expect(pathExists('/testdir')).toBe(true);
    });

    it('should create nested directories', () => {
      ensureDirectory('/x/y/z');
      expect(pathExists('/x')).toBe(true);
      expect(pathExists('/x/y')).toBe(true);
      expect(pathExists('/x/y/z')).toBe(true);
    });

    it('should not fail if directory already exists', () => {
      ensureDirectory('/intelligence');
      expect(pathExists('/intelligence')).toBe(true);
    });

    it('should handle root path', () => {
      ensureDirectory('/');
      expect(pathExists('/')).toBe(true);
    });
  });
});
