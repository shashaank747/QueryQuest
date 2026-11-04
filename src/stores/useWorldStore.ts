import { create } from 'zustand';
import { WorldDefinition, WorldProgress } from '../types/world';
import { WORLDS_REGISTRY, getWorldById } from '../modules/worlds/registry';
import { persistenceService } from '../services/persistence/db-store';

interface WorldState {
  worlds: WorldDefinition[];
  activeWorld: WorldDefinition | null;
  worldProgress: Record<string, WorldProgress>;
  setActiveWorld: (worldId: string | null) => void;
  refreshWorldProgress: (worldId: string) => Promise<void>;
  initWorlds: () => Promise<void>;
}

export const useWorldStore = create<WorldState>((set, get) => ({
  worlds: WORLDS_REGISTRY,
  activeWorld: null,
  worldProgress: {},

  setActiveWorld: (worldId: string | null) => {
    if (!worldId) {
      set({ activeWorld: null });
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

