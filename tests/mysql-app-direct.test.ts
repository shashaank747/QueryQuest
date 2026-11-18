import { describe, it, expect, beforeEach } from 'vitest';
import { useWorldStore } from '../src/stores/useWorldStore';
import { useUserStore } from '../src/stores/useUserStore';
import { WORLDS_REGISTRY } from '../src/modules/worlds/registry';

describe('MySQL 100% Direct Mode Verification', () => {
  beforeEach(() => {
    useWorldStore.setState({
      activeWorld: null,
      worldProgress: {},
    });
    useUserStore.setState({
      profile: {
        id: 'user_default',
        username: 'DatabaseAnalyst',
        level: 1,
        xp: 0,
        streakDays: 1,
        lastActiveDate: new Date().toISOString(),
        achievements: [],
        completedWorlds: [],
      },
    });
  });

  it('boots directly into MySQL game without intermediate track selection', () => {
    const { activeWorld, worlds } = useWorldStore.getState();
    expect(activeWorld).toBeNull();
    expect(worlds.length).toBe(7);
  });

  it('provides access to all 7 MySQL enterprise worlds in registry', () => {
    expect(WORLDS_REGISTRY.length).toBe(7);
    const worldIds = WORLDS_REGISTRY.map((w) => w.id);
    expect(worldIds).toEqual([
      'supermarket',
      'metro',
      'kaapi',
      'airport',
      'warehouse',
      'hospital',
      'bank',
    ]);
  });

  it('activates an unlocked MySQL world into the activeWorld state', () => {
    const { setActiveWorld } = useWorldStore.getState();
    setActiveWorld('supermarket');
    expect(useWorldStore.getState().activeWorld?.id).toBe('supermarket');
  });

  it('retains core gamification stats: XP, level, streak, and achievements', () => {
    const { profile, addXp } = useUserStore.getState();
    expect(profile.xp).toBe(0);
    expect(profile.streakDays).toBe(1);
    addXp(150);
    expect(useUserStore.getState().profile.xp).toBe(150);
  });

  it('allows returning to MySQL world dashboard by resetting activeWorld', () => {
    const { setActiveWorld } = useWorldStore.getState();
    setActiveWorld('metro');
    expect(useWorldStore.getState().activeWorld?.id).toBe('metro');
    setActiveWorld(null);
    expect(useWorldStore.getState().activeWorld).toBeNull();
  });
});
