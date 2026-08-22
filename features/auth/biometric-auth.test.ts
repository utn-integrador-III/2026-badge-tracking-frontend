import { describe, expect, it, vi } from 'vitest';
import { getBiometricAvailability, getBiometricUnlockMessage } from './biometric-auth';

describe('biometric auth', () => {
  it('detects when WebAuthn is not supported', async () => {
    vi.stubGlobal('window', {});

    await expect(getBiometricAvailability({} as Navigator)).resolves.toEqual({
      available: false,
      reason: 'WebAuthn not supported'
    });

    vi.unstubAllGlobals();
  });

  it('returns an unlock message for available biometrics', () => {
    expect(getBiometricUnlockMessage({ available: true, reason: 'Biometric unlock available' })).toBe('Desbloqueo biometrico disponible en este dispositivo.');
  });
});
