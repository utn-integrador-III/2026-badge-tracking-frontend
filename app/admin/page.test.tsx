// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/features/auth/store/auth-store';
import AdminPage from './page';

describe('AdminPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ pin: '123456', isAuthenticated: true });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the admin modules', () => {
    render(<AdminPage />);

    expect(screen.getByText('Portal administrativo')).toBeInTheDocument();
    expect(screen.getByText('Dashboard por rol')).toBeInTheDocument();
    expect(screen.getByText('Emitir nuevo badge')).toBeInTheDocument();
    expect(screen.getByText('Buscar titular')).toBeInTheDocument();
    expect(screen.getByText('Historial de auditoria')).toBeInTheDocument();
  });

  it('resets the activation flow from the dev tools panel', () => {
    localStorage.setItem('utn-institutional-identity', JSON.stringify({ nationalId: '123456789' }));
    render(<AdminPage />);

    const assign = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign });

    fireEvent.click(screen.getByRole('button', { name: /Reiniciar flujo/i }));

    expect(useAuthStore.getState().pin).toBeNull();
    expect(localStorage.getItem('utn-institutional-identity')).toBeNull();
    expect(assign).toHaveBeenCalledWith('/activate');
    vi.unstubAllGlobals();
  });
});
