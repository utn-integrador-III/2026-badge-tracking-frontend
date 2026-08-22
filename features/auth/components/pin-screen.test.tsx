// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../store/auth-store';
import { PinScreen } from './pin-screen';

function enterDigits(pin: string) {
  for (const digit of pin) {
    fireEvent.click(screen.getByRole('button', { name: digit }));
  }
}

describe('PinScreen', () => {
  beforeEach(() => {
    useAuthStore.setState({ pin: null, isAuthenticated: false });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('creates a new pin after entering it twice and confirming a match', async () => {
    const onSuccess = vi.fn();
    render(<PinScreen mode="setup" onSuccess={onSuccess} />);

    expect(screen.getByText('Crear PIN de acceso')).toBeInTheDocument();
    enterDigits('123456');

    await screen.findByText('Confirmar PIN de acceso');
    enterDigits('123456');

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(useAuthStore.getState().pin).toBe('123456');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('shows an error and restarts setup when the confirmation does not match', async () => {
    render(<PinScreen mode="setup" />);

    enterDigits('123456');
    await screen.findByText('Confirmar PIN de acceso');
    enterDigits('654321');

    await screen.findByText('Los PIN no coinciden. Inténtalo de nuevo.');
    await screen.findByText('Crear PIN de acceso');
  });

  it('authenticates with the correct stored pin', async () => {
    useAuthStore.setState({ pin: '123456', isAuthenticated: false });
    const onSuccess = vi.fn();
    render(<PinScreen mode="auth" onSuccess={onSuccess} />);

    enterDigits('123456');

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('shows an error for an incorrect pin in auth mode', async () => {
    useAuthStore.setState({ pin: '123456', isAuthenticated: false });
    render(<PinScreen mode="auth" />);

    enterDigits('000000');

    await screen.findByText('PIN incorrecto. Inténtalo de nuevo.');
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('falls back to setup mode when auth mode is requested without a stored pin', () => {
    render(<PinScreen mode="auth" />);

    expect(screen.getByText('Crear PIN de acceso')).toBeInTheDocument();
  });

  it('toggles pin visibility', () => {
    render(<PinScreen mode="setup" />);

    fireEvent.click(screen.getByRole('button', { name: /Mostrar PIN/i }));
    expect(screen.getByRole('button', { name: /Ocultar PIN/i })).toBeInTheDocument();
  });

  it('removes the last digit on backspace', async () => {
    render(<PinScreen mode="setup" />);

    enterDigits('12');
    const backspaceButtons = screen.getAllByRole('button').filter((button) => button.querySelector('svg') && !button.textContent);
    fireEvent.click(backspaceButtons[backspaceButtons.length - 1]);
    enterDigits('34567');

    await screen.findByText('Confirmar PIN de acceso');
    enterDigits('134567');

    await waitFor(() => expect(useAuthStore.getState().pin).toBe('134567'));
  });

  it('resets auth state when navigating back without a cancel handler', () => {
    useAuthStore.setState({ pin: '123456', isAuthenticated: false });
    render(<PinScreen mode="auth" />);

    fireEvent.click(screen.getByRole('button', { name: /Volver al registro/i }));

    expect(useAuthStore.getState().pin).toBeNull();
  });

  it('calls the provided onCancel handler instead of resetting when given', () => {
    const onCancel = vi.fn();
    useAuthStore.setState({ pin: '123456', isAuthenticated: false });
    render(<PinScreen mode="auth" onCancel={onCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /Volver al registro/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState().pin).toBe('123456');
  });
});
