import { describe, it, expect } from 'vitest';
import { usePersonaStore } from './personaStore';

describe('personaStore', () => {
  describe('createPersona', () => {
    it('should create a new persona', () => {
      const store = usePersonaStore.getState();
      store.createPersona('rahul');
      
      expect(store.personaExists('rahul')).toBe(true);
    });

    it('should normalize persona name to lowercase', () => {
      const store = usePersonaStore.getState();
      store.createPersona('RAHUL');
      
      expect(store.personaExists('rahul')).toBe(true);
      expect(store.personaExists('RAHUL')).toBe(true);
    });

    it('should create persona with empty fields', () => {
      const store = usePersonaStore.getState();
      store.createPersona('john');
      
      const persona = store.getPersona('john');
      expect(persona).toEqual({});
    });

    it('should allow creating multiple personas', () => {
      const store = usePersonaStore.getState();
      store.createPersona('rahul');
      store.createPersona('john');
      store.createPersona('alice');
      
      expect(store.personaExists('rahul')).toBe(true);
      expect(store.personaExists('john')).toBe(true);
      expect(store.personaExists('alice')).toBe(true);
    });
  });

  describe('setField', () => {
    it('should set a field on a persona', () => {
      const store = usePersonaStore.getState();
      store.createPersona('rahul');
      store.setField('rahul', 'city', 'Mumbai');
      
      const persona = store.getPersona('rahul');
      expect(persona?.city).toBe('Mumbai');
    });

    it('should set multiple fields', () => {
      const store = usePersonaStore.getState();
      store.createPersona('rahul');
      store.setField('rahul', 'city', 'Mumbai');
      store.setField('rahul', 'email', 'rahul@example.com');
      store.setField('rahul', 'phone', '1234567890');
      
      const persona = store.getPersona('rahul');
      expect(persona?.city).toBe('Mumbai');
      expect(persona?.email).toBe('rahul@example.com');
      expect(persona?.phone).toBe('1234567890');
    });

    it('should update existing field', () => {
      const store = usePersonaStore.getState();
      store.createPersona('rahul');
      store.setField('rahul', 'city', 'Mumbai');
      store.setField('rahul', 'city', 'Delhi');
      
      const persona = store.getPersona('rahul');
      expect(persona?.city).toBe('Delhi');
    });

    it('should normalize persona name to lowercase', () => {
      const store = usePersonaStore.getState();
      store.createPersona('rahul');
      store.setField('RAHUL', 'city', 'Mumbai');
      
      const persona = store.getPersona('rahul');
      expect(persona?.city).toBe('Mumbai');
    });
  });

  describe('getPersona', () => {
    it('should return persona data', () => {
      const store = usePersonaStore.getState();
      store.createPersona('rahul');
      store.setField('rahul', 'city', 'Mumbai');
      store.setField('rahul', 'email', 'rahul@example.com');
      
      const persona = store.getPersona('rahul');
      expect(persona).toEqual({
        city: 'Mumbai',
        email: 'rahul@example.com',
      });
    });

    it('should return null for non-existent persona', () => {
      const store = usePersonaStore.getState();
      const persona = store.getPersona('nonexistent');
      expect(persona).toBeNull();
    });

    it('should normalize persona name to lowercase', () => {
      const store = usePersonaStore.getState();
      store.createPersona('rahul');
      store.setField('rahul', 'city', 'Mumbai');
      
      const persona = store.getPersona('RAHUL');
      expect(persona?.city).toBe('Mumbai');
    });
  });

  describe('deletePersona', () => {
    it('should delete a persona', () => {
      const store = usePersonaStore.getState();
      store.createPersona('rahul');
      store.setField('rahul', 'city', 'Mumbai');
      
      store.deletePersona('rahul');
      
      expect(store.personaExists('rahul')).toBe(false);
      expect(store.getPersona('rahul')).toBeNull();
    });

    it('should normalize persona name to lowercase', () => {
      const store = usePersonaStore.getState();
      store.createPersona('rahul');
      
      store.deletePersona('RAHUL');
      
      expect(store.personaExists('rahul')).toBe(false);
    });

    it('should not affect other personas', () => {
      const store = usePersonaStore.getState();
      store.createPersona('rahul');
      store.createPersona('john');
      
      store.deletePersona('rahul');
      
      expect(store.personaExists('rahul')).toBe(false);
      expect(store.personaExists('john')).toBe(true);
    });
  });

  describe('listPersonas', () => {
    it('should return empty array when no personas exist', () => {
      const store = usePersonaStore.getState();
      const personas = store.listPersonas();
      expect(personas).toEqual([]);
    });

    it('should return all persona names', () => {
      const store = usePersonaStore.getState();
      store.createPersona('rahul');
      store.createPersona('john');
      store.createPersona('alice');
      
      const personas = store.listPersonas();
      expect(personas).toHaveLength(3);
      expect(personas).toContain('rahul');
      expect(personas).toContain('john');
      expect(personas).toContain('alice');
    });

    it('should return lowercase names', () => {
      const store = usePersonaStore.getState();
      store.createPersona('RAHUL');
      store.createPersona('JOHN');
      
      const personas = store.listPersonas();
      expect(personas).toContain('rahul');
      expect(personas).toContain('john');
    });
  });

  describe('personaExists', () => {
    it('should return true for existing persona', () => {
      const store = usePersonaStore.getState();
      store.createPersona('rahul');
      
      expect(store.personaExists('rahul')).toBe(true);
    });

    it('should return false for non-existent persona', () => {
      const store = usePersonaStore.getState();
      expect(store.personaExists('nonexistent')).toBe(false);
    });

    it('should normalize persona name to lowercase', () => {
      const store = usePersonaStore.getState();
      store.createPersona('rahul');
      
      expect(store.personaExists('RAHUL')).toBe(true);
      expect(store.personaExists('Rahul')).toBe(true);
    });
  });
});
