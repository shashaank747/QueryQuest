import { describe, it, expect, beforeEach } from 'vitest';
import { useWorldStore } from '../src/stores/useWorldStore';
import { useUserStore } from '../src/stores/useUserStore';

describe('Tier-Based World Progression & Lock System (3x3)', () => {
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

  it('should unlock all 3 Beginner worlds (supermarket, metro, kaapi) by default and lock Intermediate/Advanced', () => {
    const { isWorldUnlocked } = useWorldStore.getState();

    // All 3 Beginner worlds are open by default
    expect(isWorldUnlocked('supermarket')).toBe(true);
    expect(isWorldUnlocked('metro')).toBe(true);
    expect(isWorldUnlocked('kaapi')).toBe(true);

    // Intermediate and Advanced worlds are locked by default
    expect(isWorldUnlocked('airport')).toBe(false);
    expect(isWorldUnlocked('warehouse')).toBe(false);
    expect(isWorldUnlocked('hospital')).toBe(false);
    expect(isWorldUnlocked('bank')).toBe(false);
  });

  it('should prevent entering locked Intermediate/Advanced worlds via setActiveWorld', () => {
    const { setActiveWorld } = useWorldStore.getState();

    // Attempting to set locked world as active
    setActiveWorld('airport');
    expect(useWorldStore.getState().activeWorld).toBeNull();

    setActiveWorld('bank');
    expect(useWorldStore.getState().activeWorld).toBeNull();

    // Unlocked worlds (supermarket, metro) can be entered
    setActiveWorld('supermarket');
    expect(useWorldStore.getState().activeWorld?.id).toBe('supermarket');

    setActiveWorld('metro');
    expect(useWorldStore.getState().activeWorld?.id).toBe('metro');
  });

  it('should unlock Intermediate tier when any 2 Beginner worlds are completed', () => {
    const { isWorldUnlocked, getWorldUnlockRequirement } = useWorldStore.getState();

    // Completing 1 beginner world leaves Intermediate locked (1 more needed)
    useWorldStore.setState({
      worldProgress: {
        supermarket: {
          worldId: 'supermarket',
          completedMissionsCount: 10,
          totalMissionsCount: 10,
          isCompleted: true,
          percentComplete: 100,
        },
      },
    });

    expect(isWorldUnlocked('airport')).toBe(false);
    expect(getWorldUnlockRequirement('airport').description).toContain('Complete 1 more Beginner World');

    // Completing 2nd beginner world (metro) unlocks Intermediate tier!
    useWorldStore.setState((state) => ({
      worldProgress: {
        ...state.worldProgress,
        metro: {
          worldId: 'metro',
          completedMissionsCount: 9,
          totalMissionsCount: 9,
          isCompleted: true,
          percentComplete: 100,
        },
      },
    }));

    expect(isWorldUnlocked('airport')).toBe(true);
    expect(isWorldUnlocked('warehouse')).toBe(true);

    // Advanced tier remains locked until 2 Intermediate worlds are completed
    expect(isWorldUnlocked('hospital')).toBe(false);
    expect(isWorldUnlocked('bank')).toBe(false);

    // Now Airport can be entered
    useWorldStore.getState().setActiveWorld('airport');
    expect(useWorldStore.getState().activeWorld?.id).toBe('airport');
  });

  it('should unlock Intermediate tier when completed in user profile completedWorlds', () => {
    const { isWorldUnlocked } = useWorldStore.getState();

    useUserStore.setState({
      profile: {
        ...useUserStore.getState().profile,
        completedWorlds: ['supermarket', 'metro'],
      },
    });

    expect(isWorldUnlocked('airport')).toBe(true);
    expect(isWorldUnlocked('warehouse')).toBe(true);
    expect(isWorldUnlocked('hospital')).toBe(false);
  });

  it('should unlock Intermediate tier for any combination of 2 Beginner worlds (supermarket+kaapi, metro+kaapi)', () => {
    const { isWorldUnlocked } = useWorldStore.getState();

    // Combination A: Supermarket + Kaapi
    useUserStore.setState({
      profile: {
        ...useUserStore.getState().profile,
        completedWorlds: ['supermarket', 'kaapi'],
      },
    });
    expect(isWorldUnlocked('airport')).toBe(true);
    expect(isWorldUnlocked('warehouse')).toBe(true);
    expect(isWorldUnlocked('hospital')).toBe(false);

    // Combination B: Metro + Kaapi
    useUserStore.setState({
      profile: {
        ...useUserStore.getState().profile,
        completedWorlds: ['metro', 'kaapi'],
      },
    });
    expect(isWorldUnlocked('airport')).toBe(true);
    expect(isWorldUnlocked('warehouse')).toBe(true);
    expect(isWorldUnlocked('hospital')).toBe(false);

    // Single world only: Kaapi only
    useUserStore.setState({
      profile: {
        ...useUserStore.getState().profile,
        completedWorlds: ['kaapi'],
      },
    });
    expect(isWorldUnlocked('airport')).toBe(false);
    expect(isWorldUnlocked('warehouse')).toBe(false);
  });

  it('should progressively unlock Advanced tier when any 2 Intermediate worlds are completed', () => {
    const { isWorldUnlocked } = useWorldStore.getState();

    // Complete 2 Beginner worlds -> Intermediate unlocked
    useWorldStore.setState({
      worldProgress: {
        supermarket: { worldId: 'supermarket', completedMissionsCount: 10, totalMissionsCount: 10, isCompleted: true, percentComplete: 100 },
        metro: { worldId: 'metro', completedMissionsCount: 9, totalMissionsCount: 9, isCompleted: true, percentComplete: 100 },
      },
    });

    expect(isWorldUnlocked('airport')).toBe(true);
    expect(isWorldUnlocked('warehouse')).toBe(true);
    expect(isWorldUnlocked('hospital')).toBe(false);

    // Complete 2 Intermediate worlds (airport + warehouse) -> Advanced unlocked!
    useWorldStore.setState((state) => ({
      worldProgress: {
        ...state.worldProgress,
        airport: { worldId: 'airport', completedMissionsCount: 6, totalMissionsCount: 6, isCompleted: true, percentComplete: 100 },
        warehouse: { worldId: 'warehouse', completedMissionsCount: 6, totalMissionsCount: 6, isCompleted: true, percentComplete: 100 },
      },
    }));

    expect(isWorldUnlocked('hospital')).toBe(true);
    expect(isWorldUnlocked('bank')).toBe(true);

    // All 7 registered worlds are now unlocked
    for (const id of ['supermarket', 'metro', 'kaapi', 'airport', 'warehouse', 'hospital', 'bank']) {
      expect(isWorldUnlocked(id)).toBe(true);
    }
  });
});
