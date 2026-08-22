// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../store/auth-store';

const { usePathname, replace } = vi.hoisted(() => ({ usePathname: vi.fn(), replace: vi.fn() }));
vi.mock('next/navigation', () => ({
  usePathname,
  useRouter: () => ({ replace })
}));
vi.mock('./pin-screen', () => ({
  PinScreen: ({ mode }: { mode: string }) => <div>PinScreen mode:{mode}</div>
}));

import { AuthGuard } from './auth-guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ pin: null, isAuthenticated: false });
    replace.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders children on the activation route without checking identity', () => {
    usePathname.mockReturnValue('/activate');

    render(
      <AuthGuard>
        <p>protected</p>
      </AuthGuard>
    );

    expect(screen.getByText('protected')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('redirects to /activate when no institutional identity is linked', () => {
    usePathname.mockReturnValue('/');

    render(
      <AuthGuard>
        <p>protected</p>
      </AuthGuard>
    );

    expect(replace).toHaveBeenCalledWith('/activate');
    expect(screen.queryByText('protected')).not.toBeInTheDocument();
  });

  it('shows the pin setup screen when identity is linked but no pin exists', () => {
    usePathname.mockReturnValue('/');
    localStorage.setItem('utn-institutional-identity', JSON.stringify({ nationalId: '123456789' }));

    render(
      <AuthGuard>
        <p>protected</p>
      </AuthGuard>
    );

    expect(screen.getByText('PinScreen mode:setup')).toBeInTheDocument();
  });

  it('shows the pin auth screen when a pin exists but the session is not authenticated', () => {
    usePathname.mockReturnValue('/');
    localStorage.setItem('utn-institutional-identity', JSON.stringify({ nationalId: '123456789' }));
    useAuthStore.setState({ pin: '123456', isAuthenticated: false });

    render(
      <AuthGuard>
        <p>protected</p>
      </AuthGuard>
    );

    expect(screen.getByText('PinScreen mode:auth')).toBeInTheDocument();
  });

  it('renders children once the session is authenticated', () => {
    usePathname.mockReturnValue('/');
    localStorage.setItem('utn-institutional-identity', JSON.stringify({ nationalId: '123456789' }));
    useAuthStore.setState({ pin: '123456', isAuthenticated: true });

    render(
      <AuthGuard>
        <p>protected</p>
      </AuthGuard>
    );

    expect(screen.getByText('protected')).toBeInTheDocument();
  });
});
