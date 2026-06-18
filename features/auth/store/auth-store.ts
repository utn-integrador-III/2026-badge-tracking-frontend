'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  pin: string | null;
  isAuthenticated: boolean;
  setPin: (newPin: string) => void;
  authenticate: (enteredPin: string) => boolean;
  logout: () => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      pin: null,
      isAuthenticated: false,
      
      setPin: (newPin: string) => {
        set({ pin: newPin, isAuthenticated: true });
      },
      
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
        set({ pin: null, isAuthenticated: false });
      }
    }),
    {
      name: 'digital-badge-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the 'pin' field. 'isAuthenticated' should reset to false on reload/fresh start
      partialize: (state) => ({ pin: state.pin })
    }
  )
);
