import { Achievement } from '../../types/user';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_query',
    title: 'First Query',
    description: 'Execute your first successful SQL query in the terminal.',
    icon: 'Terminal',
    category: 'queries',
    xpReward: 50,
  },
  {
    id: 'table_architect',
    title: 'Table Architect',
    description: 'Create a new relational table with PRIMARY KEY and column constraints.',
    icon: 'Database',
    category: 'mastery',
    xpReward: 100,
  },
  {
    id: 'data_investigator',
    title: 'Data Investigator',
    description: 'Diagnose and pinpoint the operational root cause behind an inventory mismatch.',
    icon: 'Search',
    category: 'missions',
    xpReward: 120,
  },
  {
    id: 'join_master',
    title: 'Join Master',
    description: 'Execute a multi-table JOIN across 3 normalized relational tables.',
    icon: 'GitFork',
    category: 'mastery',
    xpReward: 150,
  },
  {
    id: 'aggregate_wizard',
    title: 'Aggregate Wizard',
    description: 'Master GROUP BY, SUM, and HAVING to deliver summarized financial metrics.',
    icon: 'BarChart2',
    category: 'mastery',
    xpReward: 150,
  },
  {
    id: 'supermarket_master',
    title: 'Supermarket Operations Certified',
    description: 'Successfully complete all 10 missions in the Supermarket Operations World.',
    icon: 'Award',
    category: 'worlds',
    xpReward: 300,
  },
];

export function calculateLevel(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
  // Each level requires 250 XP
  const level = Math.floor(xp / 250) + 1;
  const currentLevelXp = xp % 250;
  const nextLevelXp = 250;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / nextLevelXp) * 100));

  return { level, currentLevelXp, nextLevelXp, progressPercent };
}
