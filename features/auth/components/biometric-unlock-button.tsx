'use client';

import { useEffect, useState } from 'react';
import { Fingerprint } from 'lucide-react';
import { getBiometricAvailability, getBiometricUnlockMessage, type BiometricAvailability } from '@/features/auth/biometric-auth';

type BiometricUnlockButtonProps = Readonly<{
  onUnlock: () => void;
}>;

export function BiometricUnlockButton({ onUnlock }: BiometricUnlockButtonProps) {
  const [availability, setAvailability] = useState<BiometricAvailability | null>(null);

  useEffect(() => {
    getBiometricAvailability().then(setAvailability).catch(() => {
      setAvailability({ available: false, reason: 'WebAuthn not supported' });
    });
  }, []);

  if (!availability) {
    return <p className="text-center text-xs font-medium text-slate-400">Comprobando desbloqueo biometrico...</p>;
  }

  return (
    <div className="space-y-2 text-center">
      <button
        type="button"
        disabled={!availability.available}
        onClick={onUnlock}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-brand-950 shadow-sm transition hover:border-brand-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Fingerprint className="h-4 w-4" aria-hidden />
        Desbloquear con biometria
      </button>
      <p className="text-xs font-medium text-slate-500">{getBiometricUnlockMessage(availability)}</p>
    </div>
  );
}
