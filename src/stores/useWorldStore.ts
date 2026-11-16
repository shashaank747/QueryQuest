import { create } from 'zustand';
import { WorldDefinition, WorldProgress } from '../types/world';
import { WORLDS_REGISTRY, getWorldById } from '../modules/worlds/registry';
import { persistenceService } from '../services/persistence/db-store';
import { useUserStore } from './useUserStore';

interface WorldState {
  worlds: WorldDefinition[];
  activeWorld: WorldDefinition | null;
  worldProgress: Record<string, WorldProgress>;
  setActiveWorld: (worldId: string | null) => void;
  refreshWorldProgress: (worldId: string) => Promise<void>;
  initWorlds: () => Promise<void>;
  isWorldUnlocked: (worldId: string) => boolean;
}

export const useWorldStore = create<WorldState>((set, get) => ({
  worlds: WORLDS_REGISTRY,
  activeWorld: null,
  worldProgress: {},

  isWorldUnlocked: (worldId: string): boolean => {
    const { worlds, worldProgress } = get();
    const index = worlds.findIndex((w) => w.id === worldId);
    if (index <= 0) return true; // World 1 is always unlocked

    const prevWorld = worlds[index - 1];
    if (!prevWorld) return false;

    // Check if previous world is completed in worldProgress
    if (worldProgress[prevWorld.id]?.isCompleted) {
      return true;
    }

    // Check if previous world is marked completed in user profile
    try {
      const { profile } = useUserStore.getState();
      if (profile?.completedWorlds?.includes(prevWorld.id)) {
        return true;
      }
    } catch {
      // User store fallback
    }

    return false;
  },

  setActiveWorld: (worldId: string | null) => {
    if (!worldId) {
      set({ activeWorld: null });
      return;
    }
    // Only allow setting active world if it is unlocked
    if (!get().isWorldUnlocked(worldId)) {
      return;
    }
    const world = getWorldById(worldId);
    if (world) {
      set({ activeWorld: world });
      get().refreshWorldProgress(worldId);
    }
  },

  refreshWorldProgress: async (worldId: string) => {
    const world = getWorldById(worldId);
    if (!world) return;

    const missionProgressMap = await persistenceService.loadWorldMissionProgress(worldId);
    const totalMissions = world.missions.length;
    let completedCount = 0;

    for (const mission of world.missions) {
      if (missionProgressMap[mission.id]?.status === 'completed') {
        completedCount++;
      }
    }

    const percentComplete = totalMissions > 0 ? Math.round((completedCount / totalMissions) * 100) : 0;
    const isCompleted = totalMissions > 0 && completedCount === totalMissions;

    set((state) => ({
      worldProgress: {
        ...state.worldProgress,
        [worldId]: {
          worldId,
          completedMissionsCount: completedCount,
          totalMissionsCount: totalMissions,
          isCompleted,
          percentComplete,
        },
      },
    }));
  },

  initWorlds: async () => {
    for (const w of WORLDS_REGISTRY) {
      await get().refreshWorldProgress(w.id);
    }
  },
}));

