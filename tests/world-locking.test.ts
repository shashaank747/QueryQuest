import { describe, it, expect, beforeEach } from 'vitest';
import { useWorldStore } from '../src/stores/useWorldStore';
import { useUserStore } from '../src/stores/useUserStore';

describe('Sequential World Progression & Lock System', () => {
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

  it('should unlock World 1 (supermarket) by default and lock Worlds 2 to 5', () => {
    const { isWorldUnlocked } = useWorldStore.getState();

    // World 1 must be unlocked
    expect(isWorldUnlocked('supermarket')).toBe(true);

    // Worlds 2 to 5 must be locked
    expect(isWorldUnlocked('airport')).toBe(false);
    expect(isWorldUnlocked('warehouse')).toBe(false);
    expect(isWorldUnlocked('hospital')).toBe(false);
    expect(isWorldUnlocked('bank')).toBe(false);
  });

  it('should prevent entering locked worlds via setActiveWorld', () => {
    const { setActiveWorld } = useWorldStore.getState();

    // Attempting to set locked world as active
    setActiveWorld('airport');
    expect(useWorldStore.getState().activeWorld).toBeNull();

    setActiveWorld('bank');
    expect(useWorldStore.getState().activeWorld).toBeNull();

    // Unlocked world (supermarket) can be entered
    setActiveWorld('supermarket');
    expect(useWorldStore.getState().activeWorld?.id).toBe('supermarket');
  });

  it('should unlock World 2 (airport) when World 1 (supermarket) is completed', () => {
    const { isWorldUnlocked } = useWorldStore.getState();

    // Complete supermarket in worldProgress
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

    // World 1 & 2 now unlocked
    expect(isWorldUnlocked('supermarket')).toBe(true);
    expect(isWorldUnlocked('airport')).toBe(true);

    // Worlds 3 to 5 remain locked
    expect(isWorldUnlocked('warehouse')).toBe(false);
    expect(isWorldUnlocked('hospital')).toBe(false);
    expect(isWorldUnlocked('bank')).toBe(false);

    // Now Airport can be entered
    useWorldStore.getState().setActiveWorld('airport');
    expect(useWorldStore.getState().activeWorld?.id).toBe('airport');
  });

  it('should unlock World 2 when supermarket is in user profile completedWorlds', () => {
    const { isWorldUnlocked } = useWorldStore.getState();

    useUserStore.setState({
      profile: {
        ...useUserStore.getState().profile,
        completedWorlds: ['supermarket'],
      },
    });

    expect(isWorldUnlocked('airport')).toBe(true);
    expect(isWorldUnlocked('warehouse')).toBe(false);
  });

  it('should progressively unlock all 5 worlds sequentially', () => {
    const { isWorldUnlocked } = useWorldStore.getState();

    // Step 1: Complete Supermarket -> Airport unlocks
    useWorldStore.setState((state) => ({
      worldProgress: {
        ...state.worldProgress,
        supermarket: { worldId: 'supermarket', completedMissionsCount: 10, totalMissionsCount: 10, isCompleted: true, percentComplete: 100 },
      },
    }));
    expect(isWorldUnlocked('airport')).toBe(true);
    expect(isWorldUnlocked('warehouse')).toBe(false);

    // Step 2: Complete Airport -> Warehouse unlocks
    useWorldStore.setState((state) => ({
      worldProgress: {
        ...state.worldProgress,
        airport: { worldId: 'airport', completedMissionsCount: 6, totalMissionsCount: 6, isCompleted: true, percentComplete: 100 },
      },
    }));
    expect(isWorldUnlocked('warehouse')).toBe(true);
    expect(isWorldUnlocked('hospital')).toBe(false);

    // Step 3: Complete Warehouse -> Hospital unlocks
    useWorldStore.setState((state) => ({
      worldProgress: {
        ...state.worldProgress,
        warehouse: { worldId: 'warehouse', completedMissionsCount: 6, totalMissionsCount: 6, isCompleted: true, percentComplete: 100 },
      },
    }));
    expect(isWorldUnlocked('hospital')).toBe(true);
    expect(isWorldUnlocked('bank')).toBe(false);

    // Step 4: Complete Hospital -> Bank unlocks
    useWorldStore.setState((state) => ({
      worldProgress: {
        ...state.worldProgress,
        hospital: { worldId: 'hospital', completedMissionsCount: 6, totalMissionsCount: 6, isCompleted: true, percentComplete: 100 },
      },
    }));
    expect(isWorldUnlocked('bank')).toBe(true);

    // All 5 worlds unlocked!
    for (const id of ['supermarket', 'airport', 'warehouse', 'hospital', 'bank']) {
      expect(isWorldUnlocked(id)).toBe(true);
    }
  });
});
