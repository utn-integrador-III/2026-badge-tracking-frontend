// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as biometricAuth from '@/features/auth/biometric-auth';
import { BiometricUnlockButton } from './biometric-unlock-button';

describe('BiometricUnlockButton', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('shows a loading state before availability resolves', () => {
    vi.spyOn(biometricAuth, 'getBiometricAvailability').mockReturnValue(new Promise(() => {}));

    render(<BiometricUnlockButton onUnlock={vi.fn()} />);

    expect(screen.getByText('Comprobando desbloqueo biometrico...')).toBeInTheDocument();
  });

  it('enables the button and calls onUnlock when biometrics are available', async () => {
    vi.spyOn(biometricAuth, 'getBiometricAvailability').mockResolvedValue({ available: true, reason: 'Biometric unlock available' });
    const onUnlock = vi.fn();

    render(<BiometricUnlockButton onUnlock={onUnlock} />);

    const button = await screen.findByRole('button', { name: /Desbloquear con biometria/i });
    expect(button).toBeEnabled();
    expect(screen.getByText('Desbloqueo biometrico disponible en este dispositivo.')).toBeInTheDocument();

    fireEvent.click(button);
    expect(onUnlock).toHaveBeenCalledTimes(1);
  });

  it('disables the button when biometrics are unavailable', async () => {
    vi.spyOn(biometricAuth, 'getBiometricAvailability').mockResolvedValue({ available: false, reason: 'WebAuthn not supported' });

    render(<BiometricUnlockButton onUnlock={vi.fn()} />);

    const button = await screen.findByRole('button', { name: /Desbloquear con biometria/i });
    expect(button).toBeDisabled();
  });

  it('falls back to unavailable when the availability check throws', async () => {
    vi.spyOn(biometricAuth, 'getBiometricAvailability').mockRejectedValue(new Error('boom'));

    render(<BiometricUnlockButton onUnlock={vi.fn()} />);

    await waitFor(() => expect(screen.getByRole('button', { name: /Desbloquear con biometria/i })).toBeDisabled());
  });
});
