// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn() }));
vi.mock('next/navigation', () => ({ usePathname }));

import { AppShell } from './app-shell';

describe('AppShell', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the bottom navigation with every module link', () => {
    usePathname.mockReturnValue('/');

    render(
      <AppShell>
        <p>content</p>
      </AppShell>
    );

    expect(screen.getByText('content')).toBeInTheDocument();
    ['Inicio', 'QR', 'Verificar', 'Admin', 'Acerca'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('hides the navigation on the immersive activation route', () => {
    usePathname.mockReturnValue('/activate');

    render(
      <AppShell>
        <p>content</p>
      </AppShell>
    );

    expect(screen.queryByText('Inicio')).not.toBeInTheDocument();
  });
});
