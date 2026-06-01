import { create } from 'zustand';

interface PersonaState {
  personas: Record<string, Record<string, string>>;
  createPersona: (name: string) => void;
  setField: (name: string, field: string, value: string) => void;
  deletePersona: (name: string) => void;
  getPersona: (name: string) => Record<string, string> | null;
  listPersonas: () => string[];
  personaExists: (name: string) => boolean;
}

export const usePersonaStore = create<PersonaState>((set, get) => ({
  personas: {},

  createPersona: (name) => {
    set((state) => ({
      personas: { ...state.personas, [name.toLowerCase()]: {} },
    }));
  },

  setField: (name, field, value) => {
    const key = name.toLowerCase();
    set((state) => ({
      personas: {
        ...state.personas,
        [key]: { ...state.personas[key], [field]: value },
      },
    }));
  },

  deletePersona: (name) => {
    const key = name.toLowerCase();
    set((state) => {
      const { [key]: _, ...rest } = state.personas;
      return { personas: rest };
    });
  },

  getPersona: (name) => {
    return get().personas[name.toLowerCase()] ?? null;
  },

  listPersonas: () => {
    return Object.keys(get().personas);
  },

  personaExists: (name) => {
    return name.toLowerCase() in get().personas;
  },
}));
