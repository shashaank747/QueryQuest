import { create } from 'zustand';

interface WorldState {
  activeWorld: any | null;
  setActiveWorld: (world: any | null) => void;
  initWorlds: () => Promise<void>;
}

export const useWorldStore = create<WorldState>((set) => ({
  activeWorld: null,
  setActiveWorld: (world) => set({ activeWorld: world }),
  initWorlds: async () => {},
}));
