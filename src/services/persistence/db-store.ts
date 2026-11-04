import { openDB, IDBPDatabase } from 'idb';
import { QueryHistoryItem } from '../../types/sql';
import { MissionProgress } from '../../types/mission';
import { UserProfile } from '../../types/user';

const DB_NAME = 'queryquest_storage';
const DB_VERSION = 1;

interface QueryQuestDB {
  db_snapshots: {
    key: string; // worldId
    value: {
      worldId: string;
      binary: Uint8Array;
      updatedAt: number;
    };
  };
  checkpoints: {
    key: string; // `${worldId}_${checkpointId}`
    value: {
      id: string;
      worldId: string;
      name: string;
      binary: Uint8Array;
      createdAt: number;
    };
  };
  mission_progress: {
    key: string; // `${worldId}_${missionId}`
    value: {
      worldId: string;
      missionId: string;
      progress: MissionProgress;
    };
  };
  query_history: {
    key: string;
    value: QueryHistoryItem & { worldId: string };
  };
  user_profile: {
    key: string;
    value: UserProfile;
  };
}

let dbPromise: Promise<IDBPDatabase<QueryQuestDB>> | null = null;

function getDB(): Promise<IDBPDatabase<QueryQuestDB>> {
  if (!dbPromise) {
    dbPromise = openDB<QueryQuestDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('db_snapshots')) {
          db.createObjectStore('db_snapshots', { keyPath: 'worldId' });
        }
        if (!db.objectStoreNames.contains('checkpoints')) {
          db.createObjectStore('checkpoints', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('mission_progress')) {
          db.createObjectStore('mission_progress', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('query_history')) {
          db.createObjectStore('query_history', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('user_profile')) {
          db.createObjectStore('user_profile', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export const persistenceService = {
  // Save world practice DB binary snapshot
  async saveDatabaseSnapshot(worldId: string, binary: Uint8Array): Promise<void> {
    try {
      const db = await getDB();
      await db.put('db_snapshots', {
        worldId,
        binary,
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.warn('Failed to save DB snapshot to IndexedDB:', e);
    }
  },

  // Load world practice DB snapshot
  async loadDatabaseSnapshot(worldId: string): Promise<Uint8Array | null> {
    try {
      const db = await getDB();
      const record = await db.get('db_snapshots', worldId);
      return record ? record.binary : null;
    } catch (e) {
      console.warn('Failed to load DB snapshot from IndexedDB:', e);
      return null;
    }
  },

  // Clear DB snapshot (e.g. on World reset)
  async clearDatabaseSnapshot(worldId: string): Promise<void> {
    try {
      const db = await getDB();
      await db.delete('db_snapshots', worldId);
    } catch (e) {
      console.warn('Failed to clear DB snapshot:', e);
    }
  },

  // Save mission progress
  async saveMissionProgress(worldId: string, missionId: string, progress: MissionProgress): Promise<void> {
    try {
      const db = await getDB();
      await db.put('mission_progress', {
        key: `${worldId}_${missionId}`,
        worldId,
        missionId,
        progress,
      } as any);
    } catch (e) {
      console.warn('Failed to save mission progress:', e);
    }
  },

  // Load all mission progress for a world
  async loadWorldMissionProgress(worldId: string): Promise<Record<string, MissionProgress>> {
    try {
      const db = await getDB();
      const allRecords = await db.getAll('mission_progress');
      const result: Record<string, MissionProgress> = {};
      for (const rec of allRecords) {
        if (rec.worldId === worldId) {
          result[rec.missionId] = rec.progress;
        }
      }
      return result;
    } catch (e) {
      console.warn('Failed to load mission progress:', e);
      return {};
    }
  },

  // Save Query history
  async addQueryHistory(worldId: string, item: QueryHistoryItem): Promise<void> {
    try {
      const db = await getDB();
      await db.put('query_history', {
        ...item,
        worldId,
      });
    } catch (e) {
      console.warn('Failed to record query history:', e);
    }
  },

  async getRecentQueryHistory(worldId: string, limit = 30): Promise<QueryHistoryItem[]> {
    try {
      const db = await getDB();
      const all = await db.getAll('query_history');
      return all
        .filter((item) => item.worldId === worldId)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    } catch (e) {
      return [];
    }
  },

  // Save User Profile
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      const db = await getDB();
      await db.put('user_profile', profile);
    } catch (e) {
      console.warn('Failed to save user profile:', e);
    }
  },

  async loadUserProfile(): Promise<UserProfile | null> {
    try {
      const db = await getDB();
      const profile = await db.get('user_profile', 'default_user');
      return profile || null;
    } catch (e) {
      return null;
    }
  },
};
