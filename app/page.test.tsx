// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '@/features/auth/store/auth-store';
import HomePage from './page';

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ pin: '123456', isAuthenticated: true });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the credential card and supporting modules', () => {
    render(<HomePage />);

    expect(screen.getByText('Carnet Digital')).toBeInTheDocument();
    expect(screen.getByText('Mi credencial')).toBeInTheDocument();
    expect(screen.getByText('Juan Carlos Rodríguez Vargas')).toBeInTheDocument();
    expect(screen.getByText('Marca institucional')).toBeInTheDocument();
    expect(screen.getByText('Idioma de la app')).toBeInTheDocument();
  });

  it('logs the session out', () => {
    render(<HomePage />);

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
