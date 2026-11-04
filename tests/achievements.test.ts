import { describe, it, expect } from 'vitest';
import { calculateLevel, ALL_ACHIEVEMENTS } from '../src/modules/gamification/achievements';

describe('Gamification System', () => {
  it('should calculate initial Level 1 at 0 XP', () => {
    const info = calculateLevel(0);
    expect(info.level).toBe(1);
    expect(info.currentLevelXp).toBe(0);
    expect(info.nextLevelXp).toBe(250);
    expect(info.progressPercent).toBe(0);
  });

  it('should level up to Level 2 at 250 XP', () => {
    const info = calculateLevel(250);
    expect(info.level).toBe(2);
    expect(info.currentLevelXp).toBe(0);
  });

  it('should compute partial level progress correctly at 375 XP', () => {
    const info = calculateLevel(375);
    expect(info.level).toBe(2);
    expect(info.currentLevelXp).toBe(125);
    expect(info.progressPercent).toBe(50);
  });

  it('should have properly defined achievements', () => {
    expect(ALL_ACHIEVEMENTS.length).toBeGreaterThanOrEqual(6);
    const firstQuery = ALL_ACHIEVEMENTS.find(a => a.id === 'first_query');
    expect(firstQuery).toBeDefined();
    expect(firstQuery?.xpReward).toBe(50);
  });
});
