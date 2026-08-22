'use client';

import { useEffect, useState } from 'react';
import type { ApiRole } from '@/lib/api/types';

export const INSTITUTIONAL_IDENTITY_KEY = 'utn-institutional-identity';

export type StoredInstitutionalIdentity = {
  institutionalId: string;
  fullName: string;
  email?: string;
  role: ApiRole;
  registeredAt: string;
};

export function getStoredInstitutionalIdentity(): StoredInstitutionalIdentity | null {
  if (typeof window === 'undefined') return null;

  const rawIdentity = window.localStorage.getItem(INSTITUTIONAL_IDENTITY_KEY);
  if (!rawIdentity) return null;

  try {
    const identity = JSON.parse(rawIdentity) as Partial<StoredInstitutionalIdentity>;
    if (!identity.institutionalId || !identity.fullName || !identity.role) return null;
    return identity as StoredInstitutionalIdentity;
  } catch {
    return null;
  }
}

export function storeInstitutionalIdentity(identity: StoredInstitutionalIdentity) {
  window.localStorage.setItem(INSTITUTIONAL_IDENTITY_KEY, JSON.stringify(identity));
}

export function clearStoredInstitutionalIdentity() {
  window.localStorage.removeItem(INSTITUTIONAL_IDENTITY_KEY);
}

export function useStoredInstitutionalIdentity() {
  const [identity, setIdentity] = useState<StoredInstitutionalIdentity | null>(null);

  useEffect(() => {
    setIdentity(getStoredInstitutionalIdentity());
  }, []);

  return identity;
}

