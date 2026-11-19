import { create } from 'zustand';
import { UserProfile } from '../types/user';
import { persistenceService } from '../services/persistence/db-store';
import { calculateLevel, ALL_ACHIEVEMENTS } from '../modules/gamification/achievements';

interface UserState {
  profile: UserProfile;
  isAuthenticated: boolean;
  levelInfo: {
    level: number;
    currentLevelXp: number;
    nextLevelXp: number;
    progressPercent: number;
  };
  initUser: () => Promise<void>;
  login: (username: string, email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
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
  isAuthenticated: false,
  levelInfo: calculateLevel(0),

  initUser: async () => {
    let hasSession = false;
    if (typeof window !== 'undefined') {
      hasSession = localStorage.getItem('queryquest_auth_session') === 'true';
    }

    const saved = await persistenceService.loadUserProfile();
    if (saved) {
      set({
        profile: saved,
        isAuthenticated: hasSession || Boolean(saved.isLoggedIn),
        levelInfo: calculateLevel(saved.xp),
      });
    } else {
      await persistenceService.saveUserProfile(DEFAULT_USER_PROFILE);
      set({ isAuthenticated: hasSession });
    }
  },

  login: async (username: string, email: string) => {
    const { profile } = get();
    const cleanUsername = username.trim() || 'Cadet Operator';
    const cleanEmail = email.trim();

    const updated: UserProfile = {
      ...profile,
      username: cleanUsername,
      email: cleanEmail,
      isLoggedIn: true,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('queryquest_auth_session', 'true');
      localStorage.setItem('queryquest_user_username', cleanUsername);
      localStorage.setItem('queryquest_user_email', cleanEmail);
    }

    set({
      profile: updated,
      isAuthenticated: true,
      levelInfo: calculateLevel(updated.xp),
    });
    await persistenceService.saveUserProfile(updated);
  },

  logout: async () => {
    const { profile } = get();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('queryquest_auth_session');
    }
    const updated: UserProfile = {
      ...profile,
      isLoggedIn: false,
    };
    set({
      profile: updated,
      isAuthenticated: false,
    });
    await persistenceService.saveUserProfile(updated);
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
    const achievementDef = ALL_ACHIEVEMENTS.find((a) => a.id === achievementId);
    const bonusXp = achievementDef?.xpReward ?? 50;
    await addXp(bonusXp); // Award achievement XP defined in achievements registry
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

