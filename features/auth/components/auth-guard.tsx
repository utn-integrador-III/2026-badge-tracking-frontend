'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth-store';
import { PinScreen } from './pin-screen';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const { pin, isAuthenticated } = useAuthStore();

  // Prevent hydration mismatch errors by waiting for the store to hydrate on the client
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) {
    // Render an empty layout matching the branding color during initial client load
    return (
      <div className="min-h-dvh bg-[#1B3A8C] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  // If there's no PIN set up, render the PIN setup screen
  if (!pin) {
    return <PinScreen mode="setup" />;
  }

  // If a PIN is set up but user is not authenticated, render the PIN auth screen
  if (!isAuthenticated) {
    return <PinScreen mode="auth" />;
  }

  // User is authenticated, render application views
  return <>{children}</>;
}
