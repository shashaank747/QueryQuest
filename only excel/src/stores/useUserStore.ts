import { create } from 'zustand';

export interface UserProfile {
  id: string;
  username: string;
  role: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedWorlds: string[];
}

export interface LevelInfo {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

interface UserState {
  profile: UserProfile;
  levelInfo: LevelInfo;
  initUser: () => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  markWorldCompleted: (worldId: string) => Promise<void>;
}

const calculateLevel = (xp: number): LevelInfo => {
  const level = Math.floor(xp / 1000) + 1;
  const currentLevelXp = xp % 1000;
  const nextLevelXp = 1000;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / nextLevelXp) * 100));
  return { level, currentLevelXp, nextLevelXp, progressPercent };
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'excel_user',
  username: 'Spreadsheet Pro',
  role: 'Financial Operations Analyst',
  xp: 0,
  level: 1,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedWorlds: [],
};

const STORAGE_KEY = 'only_excel_user_profile';

const loadSavedProfile = (): UserProfile => {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return DEFAULT_PROFILE;
};

const saveProfile = (p: UserProfile) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
};

const initialProfile = loadSavedProfile();

export const useUserStore = create<UserState>((set, get) => ({
  profile: initialProfile,
  levelInfo: calculateLevel(initialProfile.xp),

  initUser: async () => {
    const p = loadSavedProfile();
    set({ profile: p, levelInfo: calculateLevel(p.xp) });
  },

  addXp: async (amount: number) => {
    const current = get().profile;
    const newXp = current.xp + amount;
    const updated: UserProfile = {
      ...current,
      xp: newXp,
      level: Math.floor(newXp / 1000) + 1,
    };
    saveProfile(updated);
    set({
      profile: updated,
      levelInfo: calculateLevel(updated.xp),
    });
  },

  markWorldCompleted: async (worldId: string) => {
    const current = get().profile;
    if (current.completedWorlds.includes(worldId)) return;
    const updated: UserProfile = {
      ...current,
      completedWorlds: [...current.completedWorlds, worldId],
    };
    saveProfile(updated);
    set({
      profile: updated,
    });
  },
}));
