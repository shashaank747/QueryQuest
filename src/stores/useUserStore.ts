import { create } from 'zustand';
import { UserProfile } from '../types/user';
import { persistenceService } from '../services/persistence/db-store';
import { calculateLevel } from '../modules/gamification/achievements';

interface UserState {
  profile: UserProfile;
  levelInfo: {
    level: number;
    currentLevelXp: number;
    nextLevelXp: number;
    progressPercent: number;
  };
  initUser: () => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<boolean>;
  recordQueryRun: (isSuccess: boolean) => Promise<void>;
  markWorldCompleted: (worldId: string) => Promise<void>;
}

const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'default_user',
  username: 'Alex Chen',
  role: 'Junior Database Executive',
  xp: 0,
  level: 1,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedWorlds: [],
  achievements: [],
  totalQueriesRun: 0,
  successfulQueriesRun: 0,
};

export const useUserStore = create<UserState>((set, get) => ({
  profile: DEFAULT_USER_PROFILE,
  levelInfo: calculateLevel(0),

  initUser: async () => {
    const saved = await persistenceService.loadUserProfile();
    if (saved) {
      set({
        profile: saved,
        levelInfo: calculateLevel(saved.xp),
      });
    } else {
      await persistenceService.saveUserProfile(DEFAULT_USER_PROFILE);
    }
  },

  addXp: async (amount: number) => {
    const { profile } = get();
    const newXp = profile.xp + amount;
    const newLevelInfo = calculateLevel(newXp);

    const updated: UserProfile = {
      ...profile,
      xp: newXp,
      level: newLevelInfo.level,
    };

    set({ profile: updated, levelInfo: newLevelInfo });
    await persistenceService.saveUserProfile(updated);
  },

  unlockAchievement: async (achievementId: string) => {
    const { profile, addXp } = get();
    if (profile.achievements.includes(achievementId)) return false;

    const updated: UserProfile = {
      ...profile,
      achievements: [...profile.achievements, achievementId],
    };

    set({ profile: updated });
    await persistenceService.saveUserProfile(updated);
    await addXp(50); // Bonus achievement XP
    return true;
  },

  recordQueryRun: async (isSuccess: boolean) => {
    const { profile } = get();
    const updated: UserProfile = {
      ...profile,
      totalQueriesRun: profile.totalQueriesRun + 1,
      successfulQueriesRun: isSuccess
        ? profile.successfulQueriesRun + 1
        : profile.successfulQueriesRun,
    };
    set({ profile: updated });
    await persistenceService.saveUserProfile(updated);
  },

  markWorldCompleted: async (worldId: string) => {
    const { profile } = get();
    if (profile.completedWorlds.includes(worldId)) return;

    const updated: UserProfile = {
      ...profile,
      completedWorlds: [...profile.completedWorlds, worldId],
    };
    set({ profile: updated });
    await persistenceService.saveUserProfile(updated);
  },
}));
