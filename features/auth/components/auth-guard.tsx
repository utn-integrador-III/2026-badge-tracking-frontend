'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth-store';
import { PinScreen } from './pin-screen';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [hasInstitutionalIdentity, setHasInstitutionalIdentity] = useState(false);
  const { pinConfigured, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setHasHydrated(true);
    setHasInstitutionalIdentity(Boolean(localStorage.getItem('utn-institutional-identity')));
  }, [pathname]);

  useEffect(() => {
    if (hasHydrated && pathname !== '/activate' && !hasInstitutionalIdentity) {
      router.replace('/activate');
    }
  }, [hasHydrated, hasInstitutionalIdentity, pathname, router]);

  if (!hasHydrated) {
    return (
      <div className="min-h-dvh bg-[#1B3A8C] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (pathname === '/activate') {
    return <>{children}</>;
  }

  if (!hasInstitutionalIdentity) {
    return (
      <div className="min-h-dvh bg-[#1B3A8C] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (!pinConfigured) {
    return <PinScreen mode="setup" />;
  }

  if (!isAuthenticated) {
    return <PinScreen mode="auth" />;
  }

  return <>{children}</>;
}
