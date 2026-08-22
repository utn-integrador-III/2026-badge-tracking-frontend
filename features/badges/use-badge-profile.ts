'use client';

import { useCallback, useEffect, useState } from 'react';
import { identityApi } from '@/lib/api/identity';
import { getStoredInstitutionalIdentity } from '@/lib/session/institutional-identity';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { profileToDigitalBadge } from '@/features/badges/api-mapper';
import type { DigitalBadge } from '@/types/badge';

export function useBadgeProfile(extended = false) {
  const pin = useAuthStore((state) => state.pin);
  const [badge, setBadge] = useState<DigitalBadge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const identity = getStoredInstitutionalIdentity();
    if (!identity) {
      setError('No hay una identidad institucional vinculada.');
      setLoading(false);
      return;
    }

    if (extended && !pin) {
      setError('Debe autenticarse con el PIN para consultar los detalles.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const profile = extended
        ? await identityApi.getExtendedBadgeProfile(identity.institutionalId, pin!)
        : await identityApi.getBadgeProfile(identity.institutionalId);
      setBadge(profileToDigitalBadge(profile));
    } catch (caught) {
      setBadge(null);
      setError(caught instanceof Error ? caught.message : 'No fue posible cargar la credencial.');
    } finally {
      setLoading(false);
    }
  }, [extended, pin]);

  useEffect(() => {
    void load();
  }, [load]);

  return { badge, loading, error, reload: load };
}

