import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './auth-store';

const localStorageMock = vi.hoisted(() => {
  const store = new Map<string, string>();
  const storage = {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store.clear();
    })
  };

  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true
  });

  return storage;
});

describe('Auth Store (Zustand)', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
    // Reset state before each test
    useAuthStore.getState().resetAuth();
  });

  it('should have initial null pin and unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.pin).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set pin and authenticate user upon setPin', () => {
    useAuthStore.getState().setPin('123456');
    
    const state = useAuthStore.getState();
    expect(state.pin).toBe('123456');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should authenticate correctly with the right PIN', () => {
    useAuthStore.getState().setPin('123456');
    useAuthStore.getState().logout(); // Des-authenticate to test verify
    
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    
    const result = useAuthStore.getState().authenticate('123456');
    expect(result).toBe(true);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('should reject and return false with an incorrect PIN', () => {
    useAuthStore.getState().setPin('123456');
    useAuthStore.getState().logout();
    
    const result = useAuthStore.getState().authenticate('000000');
    expect(result).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('should clear authentication status on logout', () => {
    useAuthStore.getState().setPin('123456');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().pin).toBe('123456'); // PIN remains stored
  });

  it('should reset all auth data on resetAuth', () => {
    useAuthStore.getState().setPin('123456');
    useAuthStore.getState().resetAuth();
    
    const state = useAuthStore.getState();
    expect(state.pin).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
