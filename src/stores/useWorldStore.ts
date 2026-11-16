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
  getWorldUnlockRequirement: (worldId: string) => {
    isUnlocked: boolean;
    requiredTier: string;
    completedInTier: number;
    requiredCount: number;
    description: string;
  };
}

export const useWorldStore = create<WorldState>((set, get) => ({
  worlds: WORLDS_REGISTRY,
  activeWorld: null,
  worldProgress: {},

  isWorldUnlocked: (worldId: string): boolean => {
    return get().getWorldUnlockRequirement(worldId).isUnlocked;
  },

  getWorldUnlockRequirement: (worldId: string) => {
    const { worlds, worldProgress } = get();
    const world = worlds.find((w) => w.id === worldId);
    if (!world) {
      return {
        isUnlocked: false,
        requiredTier: 'Unknown',
        completedInTier: 0,
        requiredCount: 0,
        description: 'World not found',
      };
    }

    // All Beginner worlds are unlocked by default
    if (world.difficulty === 'Beginner') {
      return {
        isUnlocked: true,
        requiredTier: 'Beginner',
        completedInTier: 0,
        requiredCount: 0,
        description: 'Unlocked by default',
      };
    }

    const isWorldDone = (id: string) => {
      if (worldProgress[id]?.isCompleted) return true;
      try {
        const { profile } = useUserStore.getState();
        if (profile?.completedWorlds?.includes(id)) return true;
      } catch {
        // User store fallback
      }
      return false;
    };

    const beginnerWorlds = worlds.filter((w) => w.difficulty === 'Beginner');
    const intermediateWorlds = worlds.filter((w) => w.difficulty === 'Intermediate');

    const completedBeginnerCount = beginnerWorlds.filter((w) => isWorldDone(w.id)).length;
    const completedIntermediateCount = intermediateWorlds.filter((w) => isWorldDone(w.id)).length;

    if (world.difficulty === 'Intermediate') {
      const required = Math.min(2, beginnerWorlds.length);
      const isUnlocked = completedBeginnerCount >= required;
      const remaining = Math.max(0, required - completedBeginnerCount);
      return {
        isUnlocked,
        requiredTier: 'Beginner',
        completedInTier: completedBeginnerCount,
        requiredCount: required,
        description: isUnlocked
          ? 'Unlocked'
          : `Complete ${remaining} more Beginner World${remaining > 1 ? 's' : ''} to unlock`,
      };
    }

    if (world.difficulty === 'Advanced') {
      const required = Math.min(2, intermediateWorlds.length);
      const isUnlocked = completedIntermediateCount >= required;
      const remaining = Math.max(0, required - completedIntermediateCount);
      return {
        isUnlocked,
        requiredTier: 'Intermediate',
        completedInTier: completedIntermediateCount,
        requiredCount: required,
        description: isUnlocked
          ? 'Unlocked'
          : `Complete ${remaining} more Intermediate World${remaining > 1 ? 's' : ''} to unlock`,
      };
    }

    return {
      isUnlocked: true,
      requiredTier: 'Beginner',
      completedInTier: 0,
      requiredCount: 0,
      description: 'Unlocked',
    };
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

