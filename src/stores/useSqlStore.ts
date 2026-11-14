import { create } from 'zustand';
import {
  SqlDatabaseSchema,
  SqlExecutionResponse,
  SqlQueryResult,
  QueryHistoryItem,
} from '../types/sql';
import { WorldDefinition } from '../types/world';
import { sqlEngine } from '../modules/sql-engine/worker-client';
import { persistenceService } from '../services/persistence/db-store';
import { soundService } from '../services/sound/sound-effects';
import { useUserStore } from './useUserStore';
import { useWorldStore } from './useWorldStore';

interface SqlState {
  query: string;
  isReady: boolean;
  isInitializing: boolean;
  isExecuting: boolean;
  lastResponse: SqlExecutionResponse | null;
  schema: SqlDatabaseSchema;
  isLoadingSchema: boolean;
  history: QueryHistoryItem[];
  activeTablePreview: {
    tableName: string;
    results: SqlQueryResult[];
  } | null;
  activeWorldId: string | null;
  activeMissionId: string | null;

  setQuery: (query: string) => void;
  setActiveMissionId: (missionId: string | null) => void;
  clearResults: () => void;
  clearHistory: () => Promise<void>;
  initializeForWorld: (world: WorldDefinition) => Promise<void>;
  runQuery: (sqlToRun?: string) => Promise<SqlExecutionResponse>;
  refreshSchema: () => Promise<void>;
  previewTable: (tableName: string) => Promise<void>;
  closeTablePreview: () => void;
  resetDatabase: (world: WorldDefinition) => Promise<void>;
}

export const useSqlStore = create<SqlState>((set, get) => ({
  query: '',
  isReady: false,
  isInitializing: false,
  isExecuting: false,
  lastResponse: null,
  schema: {},
  isLoadingSchema: false,
  history: [],
  activeTablePreview: null,
  activeWorldId: null,
  activeMissionId: null,

  setQuery: (query: string) => set({ query }),
  setActiveMissionId: (missionId: string | null) => set({ activeMissionId: missionId }),
  clearResults: () => set({ lastResponse: null }),
  clearHistory: async () => {
    const { activeWorldId } = get();
    if (activeWorldId) {
      await persistenceService.clearQueryHistory(activeWorldId);
    }
    set({ history: [], lastResponse: null });
  },

  initializeForWorld: async (world: WorldDefinition) => {
    set({ isInitializing: true, activeWorldId: world.id, lastResponse: null });

    try {
      // Check if a saved binary exists in IndexedDB
      const savedBinary = await persistenceService.loadDatabaseSnapshot(world.id);

      if (savedBinary && savedBinary.byteLength > 0) {
        await sqlEngine.init(savedBinary);
      } else {
        await sqlEngine.init();
        // Seed baseline schema and datasets
        if (world.initialSchemaSql || world.initialDatasetSql) {
          await sqlEngine.resetDb(world.initialSchemaSql, world.initialDatasetSql);
          // Persist the newly seeded state
          const initialBinary = await sqlEngine.exportDb();
          await persistenceService.saveDatabaseSnapshot(world.id, initialBinary);
        }
      }

      const schema = await sqlEngine.getSchema();
      const history = await persistenceService.getRecentQueryHistory(world.id);

      set({
        isReady: true,
        isInitializing: false,
        schema,
        history,
        lastResponse: null,
      });
    } catch (err) {
      console.error('Failed to initialize SQL Engine for world:', err);
      set({ isInitializing: false, isReady: false });
    }
  },

  runQuery: async (sqlToRun?: string) => {
    const { query, activeWorldId, activeMissionId, refreshSchema } = get();
    const targetSql = (sqlToRun !== undefined ? sqlToRun : query).trim();

    if (!targetSql) {
      const emptyRes: SqlExecutionResponse = {
        success: false,
        query: '',
        action: 'OTHER',
        rowsAffected: 0,
        executionTimeMs: 0,
        error: 'Please enter a SQL statement to execute.',
      };
      set({ lastResponse: emptyRes });
      return emptyRes;
    }

    // If database engine is currently initializing, wait for it before executing
    if (get().isInitializing) {
      let waitCount = 0;
      while (get().isInitializing && waitCount < 40) {
        await new Promise((r) => setTimeout(r, 100));
        waitCount++;
      }
    }

    // If still not ready, attempt auto-initialization for current active world
    if (!get().isReady) {
      const activeWorld = useWorldStore.getState().activeWorld;
      if (activeWorld) {
        await get().initializeForWorld(activeWorld);
      }
    }

    set({ isExecuting: true });
    soundService.playRunQuery();

    try {
      const response = await sqlEngine.execute(targetSql);

      // Format Workbench-style action response message
      let message = '';
      if (response.success) {
        if (response.action === 'SELECT') {
          const count = response.results?.[0]?.values?.length || 0;
          message = `${count} row(s) returned`;
        } else if (['INSERT', 'UPDATE', 'DELETE'].includes(response.action)) {
          message = `${response.rowsAffected} row(s) affected`;
        } else {
          message = `0 row(s) affected`;
        }
      } else {
        message = response.error || 'Execution failed';
      }

      // Record in query history
      const historyItem: QueryHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        query: targetSql,
        timestamp: Date.now(),
        success: response.success,
        action: response.action,
        rowsAffected: response.rowsAffected,
        rowsReturned: response.results?.[0]?.values?.length || 0,
        executionTimeMs: response.executionTimeMs,
        message,
        error: response.error,
        hint: response.hint,
        missionId: activeMissionId || undefined,
      };

      if (activeWorldId) {
        await persistenceService.addQueryHistory(activeWorldId, historyItem);
      }

      // Audio feedback & user analytics
      if (response.success) {
        soundService.playSuccessChime();
        useUserStore.getState().recordQueryRun(true);
        useUserStore.getState().unlockAchievement('first_query');
      } else {
        soundService.playErrorBuzz();
        useUserStore.getState().recordQueryRun(false);
      }

      // If schema or tables were mutated, update schema and persist DB binary
      if (
        response.success &&
        ['CREATE', 'ALTER', 'DROP', 'INSERT', 'UPDATE', 'DELETE'].includes(response.action)
      ) {
        await refreshSchema();
        if (activeWorldId) {
          const updatedBinary = await sqlEngine.exportDb();
          await persistenceService.saveDatabaseSnapshot(activeWorldId, updatedBinary);
        }
      }

      set((state) => ({
        isExecuting: false,
        lastResponse: response,
        history: [historyItem, ...state.history].slice(0, 40),
      }));

      return response;
    } catch (err: any) {
      soundService.playErrorBuzz();
      const failRes: SqlExecutionResponse = {
        success: false,
        query: targetSql,
        action: 'OTHER',
        rowsAffected: 0,
        executionTimeMs: 0,
        error: err?.message || String(err),
      };
      const failHistoryItem: QueryHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        query: targetSql,
        timestamp: Date.now(),
        success: false,
        action: 'OTHER',
        rowsAffected: 0,
        rowsReturned: 0,
        executionTimeMs: 0,
        message: err?.message || String(err),
        error: err?.message || String(err),
        missionId: activeMissionId || undefined,
      };
      set((state) => ({
        isExecuting: false,
        lastResponse: failRes,
        history: [failHistoryItem, ...state.history].slice(0, 40),
      }));
      return failRes;
    }
  },

  refreshSchema: async () => {
    set({ isLoadingSchema: true });
    try {
      const schema = await sqlEngine.getSchema();
      set({ schema, isLoadingSchema: false });
    } catch (e) {
      set({ isLoadingSchema: false });
    }
  },

  previewTable: async (tableName: string) => {
    try {
      const results = await sqlEngine.previewTable(tableName, 20);
      set({ activeTablePreview: { tableName, results } });
    } catch (e) {
      console.warn('Failed to preview table:', e);
    }
  },

  closeTablePreview: () => set({ activeTablePreview: null }),

  resetDatabase: async (world: WorldDefinition) => {
    set({ isInitializing: true });
    try {
      await persistenceService.clearDatabaseSnapshot(world.id);
      const schema = await sqlEngine.resetDb(world.initialSchemaSql, world.initialDatasetSql);
      const freshBinary = await sqlEngine.exportDb();
      await persistenceService.saveDatabaseSnapshot(world.id, freshBinary);

      set({
        schema,
        isInitializing: false,
        lastResponse: null,
      });
    } catch (err) {
      console.error('Failed to reset database:', err);
      set({ isInitializing: false });
    }
  },
}));

