import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '../src/stores/useUserStore';

describe('Cadet Authentication Backend Validation', () => {
  beforeEach(() => {
    useUserStore.setState({
      isAuthenticated: false,
    });
  });

  it('rejects usernames shorter than 3 characters', async () => {
    await expect(
      useUserStore.getState().login('al', 'alex@questquery.com', 'secret123')
    ).rejects.toThrow('User name must be at least 3 characters long.');
    expect(useUserStore.getState().isAuthenticated).toBe(false);
  });

  it('rejects email missing both @ and .com', async () => {
    await expect(
      useUserStore.getState().login('alex_chen', 'invalidemail', 'secret123')
    ).rejects.toThrow("Invalid Mail ID: email must contain both '@' and '.com'.");
    expect(useUserStore.getState().isAuthenticated).toBe(false);
  });

  it('rejects email missing @ symbol', async () => {
    await expect(
      useUserStore.getState().login('alex_chen', 'alexquestquery.com', 'secret123')
    ).rejects.toThrow("Invalid Mail ID: missing '@' symbol.");
    expect(useUserStore.getState().isAuthenticated).toBe(false);
  });

  it('rejects email missing .com domain suffix', async () => {
    await expect(
      useUserStore.getState().login('alex_chen', 'alex@questquery', 'secret123')
    ).rejects.toThrow("Invalid Mail ID: missing '.com' domain ending.");
    expect(useUserStore.getState().isAuthenticated).toBe(false);
  });

  it('rejects password shorter than 6 characters', async () => {
    await expect(
      useUserStore.getState().login('alex_chen', 'alex@questquery.com', '12345')
    ).rejects.toThrow('Password must be at least 6 characters long.');
    expect(useUserStore.getState().isAuthenticated).toBe(false);
  });

  it('successfully authenticates with valid credentials containing @ and .com', async () => {
    await useUserStore.getState().login('alex_chen', 'alex@questquery.com', 'secret123');
    const state = useUserStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.profile.username).toBe('alex_chen');
    expect(state.profile.email).toBe('alex@questquery.com');
  });

  it('supports logout and returns to unauthenticated state', async () => {
    await useUserStore.getState().login('alex_chen', 'alex@questquery.com', 'secret123');
    expect(useUserStore.getState().isAuthenticated).toBe(true);
    await useUserStore.getState().logout();
    expect(useUserStore.getState().isAuthenticated).toBe(false);
  });
});
