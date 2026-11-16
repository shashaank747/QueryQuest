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
  getMissionTimeSpent: (missionId: string) => number;
}

export const useMissionStore = create<MissionState>((set, get) => ({
  missions: [],
  activeMission: null,
  progressMap: {},
  validationFeedback: null,
  isValidating: false,
  isWorldCompletedModalOpen: false,

  loadMissionsForWorld: async (world: WorldDefinition) => {
    set({ validationFeedback: null });
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
          timeSpentSeconds: 0,
          errorsCount: 0,
          mistakes: [],
          sessionStartedAt: idx === 0 ? Date.now() : undefined,
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

    if (initialMission && progressMap[initialMission.id]?.status !== 'completed') {
      progressMap[initialMission.id] = {
        ...progressMap[initialMission.id],
        sessionStartedAt: Date.now(),
      };
    }

    set({
      missions,
      activeMission: initialMission || null,
      progressMap,
      validationFeedback: null,
    });

    // Reset SQL execution response and track current active mission
    useSqlStore.getState().clearResults();
    useSqlStore.getState().setActiveMissionId(initialMission?.id || null);

    // Set editor text to initial placeholder
    if (initialMission?.initialSqlPlaceholder) {
      useSqlStore.getState().setQuery(initialMission.initialSqlPlaceholder);
    }
  },

  selectMission: (missionId: string) => {
    const { activeMission, missions, progressMap } = get();
    const activeWorld = useWorldStore.getState().activeWorld;
    const targetMission = missions.find((m) => m.id === missionId);
    if (!targetMission) return;

    // Check if locked
    const targetProg = progressMap[missionId];
    if (targetProg?.status === 'locked') return;

    const now = Date.now();
    const updatedMap: Record<string, MissionProgress> = { ...progressMap };

    // Accumulate elapsed seconds on previous active mission if it wasn't completed
    if (activeMission && activeMission.id !== missionId) {
      const prevProg = updatedMap[activeMission.id];
      if (prevProg && prevProg.status !== 'completed' && prevProg.sessionStartedAt) {
        const elapsed = Math.round((now - prevProg.sessionStartedAt) / 1000);
        const updatedPrev: MissionProgress = {
          ...prevProg,
          timeSpentSeconds: (prevProg.timeSpentSeconds || 0) + elapsed,
          sessionStartedAt: undefined,
        };
        updatedMap[activeMission.id] = updatedPrev;
        if (activeWorld) {
          persistenceService.saveMissionProgress(activeWorld.id, activeMission.id, updatedPrev);
        }
      }
    }

    // Set sessionStartedAt on target mission if not completed
    const currentTargetProg = updatedMap[missionId] || {
      missionId,
      status: 'unlocked',
      attemptsCount: 0,
      hintsRevealed: 0,
      timeSpentSeconds: 0,
      errorsCount: 0,
      mistakes: [],
    };

    if (currentTargetProg.status !== 'completed') {
      const updatedTarget: MissionProgress = {
        ...currentTargetProg,
        sessionStartedAt: now,
      };
      updatedMap[missionId] = updatedTarget;
    }

    set({
      activeMission: targetMission,
      validationFeedback: null,
      progressMap: updatedMap,
    });

    // Reset SQL execution response and track current active mission
    useSqlStore.getState().clearResults();
    useSqlStore.getState().setActiveMissionId(targetMission.id);

    // If completed and has bestSql, set that, otherwise set placeholder
    if (currentTargetProg?.bestSql) {
      useSqlStore.getState().setQuery(currentTargetProg.bestSql);
    } else if (targetMission.initialSqlPlaceholder) {
      useSqlStore.getState().setQuery(targetMission.initialSqlPlaceholder);
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

    // Check if the current query has already been run by the user
    // "submit objective will not rerun the already executed code"
    const currentQuery = useSqlStore.getState().query.trim();
    const lastResponse = useSqlStore.getState().lastResponse;

    let response = lastResponse;
    const wasAlreadyRun = Boolean(
      lastResponse &&
      lastResponse.query &&
      lastResponse.query.trim() === currentQuery
    );

    if (!wasAlreadyRun) {
      response = await useSqlStore.getState().runQuery(currentQuery);
    }

    const currentProg = progressMap[activeMission.id] || {
      missionId: activeMission.id,
      status: 'unlocked',
      attemptsCount: 0,
      hintsRevealed: 0,
      timeSpentSeconds: 0,
      errorsCount: 0,
      mistakes: [],
    };

    if (!response || !response.success) {
      // Check if this failure is because the table was already created in a previous Run attempt
      const isCreateTable = /^\s*create\s+table/i.test(response?.query || currentQuery);
      const isTableAlreadyExists = /already exists/i.test(response?.error || '');
      const hasTableExistsRule = activeMission.validationRules.some((r) => r.type === 'TABLE_EXISTS');

      if (isCreateTable && isTableAlreadyExists && hasTableExistsRule) {
        // Table was already created in a previous execution — treat as success for downstream validation
        if (response) response.success = true;
      } else {
        const errorMsg = response?.hint || response?.error || 'Execution failed';
        const existingMistakes = currentProg.mistakes || [];
        const updatedMistakes = existingMistakes.includes(errorMsg)
          ? existingMistakes
          : [...existingMistakes, errorMsg];

        const updatedProg: MissionProgress = {
          ...currentProg,
          attemptsCount: currentProg.attemptsCount + 1,
          errorsCount: (currentProg.errorsCount || 0) + 1,
          mistakes: updatedMistakes.slice(-10),
        };

        const updatedMap = {
          ...progressMap,
          [activeMission.id]: updatedProg,
        };

        set({
          isValidating: false,
          validationFeedback: {
            passed: false,
            message: 'Query failed to execute.',
            details: {
              hint: response?.hint || response?.error,
            },
          },
          progressMap: updatedMap,
        });

        await persistenceService.saveMissionProgress(
          activeWorld.id,
          activeMission.id,
          updatedProg
        );

        return false;
      }
    }

    // 2. Validate against Mission validation rules
    const validationContext = {
      studentSql: response?.query || currentQuery,
      executionResponse: response || {
        success: true,
        query: currentQuery,
        action: 'OTHER' as const,
        rowsAffected: 0,
        executionTimeMs: 0,
      },
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
      const now = Date.now();
      const sessionSeconds = currentProg.sessionStartedAt
        ? Math.max(1, Math.round((now - currentProg.sessionStartedAt) / 1000))
        : 0;
      const finalTimeSpent = (currentProg.timeSpentSeconds || 0) + sessionSeconds;

      const updatedProg: MissionProgress = {
        ...currentProg,
        status: 'completed',
        completedAt: now,
        attemptsCount: currentProg.attemptsCount + 1,
        bestSql: response ? response.query : currentQuery,
        timeSpentSeconds: Math.max(1, finalTimeSpent),
        sessionStartedAt: undefined,
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
          timeSpentSeconds: 0,
          errorsCount: 0,
          mistakes: [],
          sessionStartedAt: now,
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
      if (activeMission.id === 'sm_m1') {
        await useUserStore.getState().unlockAchievement('sql_novice');
      }
      if (activeMission.id === 'sm_m7') {
        await useUserStore.getState().unlockAchievement('bug_hunter');
      }

      // Check if all missions in world are completed!
      const allCompleted = missions.every(
        (m) => updatedMap[m.id]?.status === 'completed'
      );
      if (allCompleted) {
        await useUserStore.getState().markWorldCompleted(activeWorld.id);
        const worldMasterBadge = `${activeWorld.id}_master`;
        await useUserStore.getState().unlockAchievement(worldMasterBadge);
        set({ isWorldCompletedModalOpen: true });
      } else if (nextMission) {
        // "if correct and expected output is there then next task will be shown"
        setTimeout(() => {
          get().selectMission(nextMission.id);
        }, 1200);
      }

      await useWorldStore.getState().refreshWorldProgress(activeWorld.id);
      return true;
    } else {
      // Objective not met
      const mistakeMsg = feedback.message + (feedback.details?.hint ? ` (${feedback.details.hint})` : '');
      const existingMistakes = currentProg.mistakes || [];
      const updatedMistakes = existingMistakes.includes(mistakeMsg)
        ? existingMistakes
        : [...existingMistakes, mistakeMsg];

      const updatedProg: MissionProgress = {
        ...currentProg,
        attemptsCount: currentProg.attemptsCount + 1,
        errorsCount: (currentProg.errorsCount || 0) + 1,
        mistakes: updatedMistakes.slice(-10),
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
    const now = Date.now();
    world.missions.forEach((m, idx) => {
      freshMap[m.id] = {
        missionId: m.id,
        status: idx === 0 ? 'unlocked' : 'locked',
        attemptsCount: 0,
        hintsRevealed: 0,
        timeSpentSeconds: 0,
        errorsCount: 0,
        mistakes: [],
        sessionStartedAt: idx === 0 ? now : undefined,
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

  getMissionTimeSpent: (missionId: string): number => {
    const prog = get().progressMap[missionId];
    if (!prog) return 0;
    let total = prog.timeSpentSeconds || 0;
    if (prog.status !== 'completed' && prog.sessionStartedAt) {
      total += Math.max(0, Math.round((Date.now() - prog.sessionStartedAt) / 1000));
    }
    return total;
  },
}));

