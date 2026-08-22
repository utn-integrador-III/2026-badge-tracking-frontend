// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/features/auth/store/auth-store';

const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn(() => '/') }));
vi.mock('next/navigation', () => ({
  usePathname,
  useRouter: () => ({ replace: vi.fn() })
}));

import RootLayout from './layout';

describe('RootLayout', () => {
  it('renders the app shell around authenticated content', () => {
    localStorage.setItem('utn-institutional-identity', JSON.stringify({ nationalId: '123456789' }));
    useAuthStore.setState({ pin: '123456', isAuthenticated: true });

    render(
      <RootLayout>
        <p>page content</p>
      </RootLayout>
    );

    expect(screen.getByText('page content')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
  });
});
