export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  role: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedWorlds: string[];
  achievements: string[];
  totalQueriesRun: number;
  successfulQueriesRun: number;
  isLoggedIn?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'queries' | 'missions' | 'worlds' | 'accuracy' | 'mastery';
  xpReward: number;
  isUnlocked?: boolean;
  unlockedAt?: number;
}

