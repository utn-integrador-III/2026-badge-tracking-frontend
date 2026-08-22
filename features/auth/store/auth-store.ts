'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  pin: string | null;
  pinConfigured: boolean;
  isAuthenticated: boolean;
  setPin: (newPin: string) => void;
  markPinConfigured: () => void;
  authenticate: (enteredPin: string) => boolean;
  logout: () => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      pin: null,
      pinConfigured: false,
      isAuthenticated: false,
      
      setPin: (newPin: string) => {
        set({ pin: newPin, pinConfigured: true, isAuthenticated: true });
      },

      markPinConfigured: () => set({ pin: null, pinConfigured: true, isAuthenticated: false }),
      
      authenticate: (enteredPin: string) => {
        const { pin } = get();
        const isValid = pin === enteredPin;
        if (isValid) {
          set({ isAuthenticated: true });
        }
        return isValid;
      },
      
      logout: () => {
        set({ isAuthenticated: false });
      },
      
      resetAuth: () => {
        set({ pin: null, pinConfigured: false, isAuthenticated: false });
      }
    }),
    {
      name: 'digital-badge-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Persist only whether the server has a PIN. The PIN itself remains in memory for the active session.
      partialize: (state) => ({ pinConfigured: state.pinConfigured })
    }
  )
);
