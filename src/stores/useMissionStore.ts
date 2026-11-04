import { create } from 'zustand';
import confetti from 'canvas-confetti';
import { Mission, MissionProgress } from '../types/mission';
import { WorldDefinition } from '../types/world';
import { ValidationFeedback } from '../types/validation';
import { ValidationEngine } from '../modules/validation/validation-engine';
import { persistenceService } from '../services/persistence/db-store';
import { useSqlStore } from './useSqlStore';
import { useUserStore } from './useUserStore';
import { useWorldStore } from './useWorldStore';
import { sqlEngine } from '../modules/sql-engine/worker-client';

interface MissionState {
  missions: Mission[];
  activeMission: Mission | null;
  progressMap: Record<string, MissionProgress>;
  validationFeedback: ValidationFeedback | null;
  isValidating: boolean;
  isWorldCompletedModalOpen: boolean;

  loadMissionsForWorld: (world: WorldDefinition) => Promise<void>;
  selectMission: (missionId: string) => void;
  revealNextHint: () => Promise<void>;
  submitMissionQuery: () => Promise<boolean>;
  advanceToNextMission: () => void;
  closeWorldCompletedModal: () => void;
  resetMissionsProgress: (world: WorldDefinition) => Promise<void>;
}

export const useMissionStore = create<MissionState>((set, get) => ({
  missions: [],
  activeMission: null,
  progressMap: {},
  validationFeedback: null,
  isValidating: false,
  isWorldCompletedModalOpen: false,

  loadMissionsForWorld: async (world: WorldDefinition) => {
    const saved = await persistenceService.loadWorldMissionProgress(world.id);
    const missions = world.missions;
    const progressMap: Record<string, MissionProgress> = { ...saved };

    // Ensure Mission 1 is unlocked by default if not set
    missions.forEach((m, idx) => {
      if (!progressMap[m.id]) {
        progressMap[m.id] = {
          missionId: m.id,
          status: idx === 0 ? 'unlocked' : 'locked',
          attemptsCount: 0,
          hintsRevealed: 0,
        };
      }
    });

    // Find first incomplete unlocked mission, or default to first
    let initialMission = missions.find(
      (m) => progressMap[m.id]?.status === 'unlocked' || progressMap[m.id]?.status === 'in_progress'
    );
    if (!initialMission && missions.length > 0) {
      initialMission = missions[0];
    }

    set({
      missions,
      activeMission: initialMission || null,
      progressMap,
      validationFeedback: null,
    });

    // Set editor text to initial placeholder
    if (initialMission?.initialSqlPlaceholder) {
      useSqlStore.getState().setQuery(initialMission.initialSqlPlaceholder);
    }
  },

  selectMission: (missionId: string) => {
    const { missions, progressMap } = get();
    const mission = missions.find((m) => m.id === missionId);
    if (!mission) return;

    // Check if locked
    const prog = progressMap[missionId];
    if (prog?.status === 'locked') return;

    set({
      activeMission: mission,
      validationFeedback: null,
    });

    // If completed and has bestSql, set that, otherwise set placeholder
    if (prog?.bestSql) {
      useSqlStore.getState().setQuery(prog.bestSql);
    } else if (mission.initialSqlPlaceholder) {
      useSqlStore.getState().setQuery(mission.initialSqlPlaceholder);
    }
  },

  revealNextHint: async () => {
    const { activeMission, progressMap } = get();
    if (!activeMission) return;

    const currentProg = progressMap[activeMission.id] || {
      missionId: activeMission.id,
      status: 'unlocked',
      attemptsCount: 0,
      hintsRevealed: 0,
    };

    if (currentProg.hintsRevealed < 3) {
      const updatedProg: MissionProgress = {
        ...currentProg,
        hintsRevealed: currentProg.hintsRevealed + 1,
      };

      const updatedMap = {
        ...progressMap,
        [activeMission.id]: updatedProg,
      };

      set({ progressMap: updatedMap });

      const activeWorld = useWorldStore.getState().activeWorld;
      if (activeWorld) {
        await persistenceService.saveMissionProgress(
          activeWorld.id,
          activeMission.id,
          updatedProg
        );
      }
    }
  },

  submitMissionQuery: async (): Promise<boolean> => {
    const { activeMission, missions, progressMap } = get();
    const activeWorld = useWorldStore.getState().activeWorld;
    if (!activeMission || !activeWorld) return false;

    set({ isValidating: true });

    // 1. Run the query through the SQL executor
    const response = await useSqlStore.getState().runQuery();

    if (!response.success) {
      set({
        isValidating: false,
        validationFeedback: {
          passed: false,
          message: 'Query failed to execute.',
          details: {
            hint: response.hint || response.error,
          },
        },
      });
      return false;
    }

    // 2. Validate against Mission validation rules
    const validationContext = {
      studentSql: response.query,
      executionResponse: response,
      executeSql: (sql: string) => sqlEngine.execute(sql),
      getSchema: () => sqlEngine.getSchema(),
      getTableData: async (tableName: string, limit = 50) => {
        const res = await sqlEngine.previewTable(tableName, limit);
        return res[0]?.values || [];
      },
    };

    const feedback = await ValidationEngine.validate(
      activeMission.validationRules,
      validationContext
    );

    const currentProg = progressMap[activeMission.id] || {
      missionId: activeMission.id,
      status: 'unlocked',
      attemptsCount: 0,
      hintsRevealed: 0,
    };

    if (feedback.passed) {
      // Mission Success!
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Ignored
      }

      const wasAlreadyCompleted = currentProg.status === 'completed';
      const updatedProg: MissionProgress = {
        ...currentProg,
        status: 'completed',
        completedAt: Date.now(),
        attemptsCount: currentProg.attemptsCount + 1,
        bestSql: response.query,
      };

      const updatedMap: Record<string, MissionProgress> = {
        ...progressMap,
        [activeMission.id]: updatedProg,
      };

      // Unlock next mission if exists
      const currentIndex = missions.findIndex((m) => m.id === activeMission.id);
      const nextMission = missions[currentIndex + 1];
      if (nextMission && (!updatedMap[nextMission.id] || updatedMap[nextMission.id].status === 'locked')) {
        updatedMap[nextMission.id] = {
          missionId: nextMission.id,
          status: 'unlocked',
          attemptsCount: 0,
          hintsRevealed: 0,
        };
        await persistenceService.saveMissionProgress(
          activeWorld.id,
          nextMission.id,
          updatedMap[nextMission.id]
        );
      }

      set({
        isValidating: false,
        validationFeedback: feedback,
        progressMap: updatedMap,
      });

      // Persist progress
      await persistenceService.saveMissionProgress(
        activeWorld.id,
        activeMission.id,
        updatedProg
      );

      // Award XP if first completion
      if (!wasAlreadyCompleted) {
        await useUserStore.getState().addXp(activeMission.xpReward);
      }

      // Check for mission badges
      if (activeMission.badge) {
        await useUserStore.getState().unlockAchievement(activeMission.badge.id);
      }

      // Check if all missions in world are completed!
      const allCompleted = missions.every(
        (m) => updatedMap[m.id]?.status === 'completed'
      );
      if (allCompleted) {
        await useUserStore.getState().markWorldCompleted(activeWorld.id);
        await useUserStore.getState().unlockAchievement('supermarket_master');
        set({ isWorldCompletedModalOpen: true });
      }

      await useWorldStore.getState().refreshWorldProgress(activeWorld.id);
      return true;
    } else {
      // Objective not met
      const updatedProg: MissionProgress = {
        ...currentProg,
        attemptsCount: currentProg.attemptsCount + 1,
      };

      set({
        isValidating: false,
        validationFeedback: feedback,
        progressMap: {
          ...progressMap,
          [activeMission.id]: updatedProg,
        },
      });

      await persistenceService.saveMissionProgress(
        activeWorld.id,
        activeMission.id,
        updatedProg
      );

      return false;
    }
  },

  advanceToNextMission: () => {
    const { activeMission, missions, selectMission } = get();
    if (!activeMission) return;
    const currentIndex = missions.findIndex((m) => m.id === activeMission.id);
    const nextMission = missions[currentIndex + 1];
    if (nextMission) {
      selectMission(nextMission.id);
    }
  },

  closeWorldCompletedModal: () => set({ isWorldCompletedModalOpen: false }),

  resetMissionsProgress: async (world: WorldDefinition) => {
    const freshMap: Record<string, MissionProgress> = {};
    world.missions.forEach((m, idx) => {
      freshMap[m.id] = {
        missionId: m.id,
        status: idx === 0 ? 'unlocked' : 'locked',
        attemptsCount: 0,
        hintsRevealed: 0,
      };
    });

    for (const m of world.missions) {
      await persistenceService.saveMissionProgress(world.id, m.id, freshMap[m.id]);
    }

    set({
      progressMap: freshMap,
      activeMission: world.missions[0] || null,
      validationFeedback: null,
    });

    if (world.missions[0]?.initialSqlPlaceholder) {
      useSqlStore.getState().setQuery(world.missions[0].initialSqlPlaceholder);
    }

    await useWorldStore.getState().refreshWorldProgress(world.id);
  },
}));
