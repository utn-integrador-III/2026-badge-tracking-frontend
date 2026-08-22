// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ActivationFlow } from './activation-flow';

function fillIdentity(nationalId = '123456789') {
  fireEvent.change(screen.getByLabelText('Número de cédula'), { target: { value: nationalId } });
  fireEvent.click(screen.getByRole('button', { name: /Validar identidad/i }));
}

function fillVerification(code = '123456') {
  fireEvent.change(screen.getByLabelText('Código de verificación'), { target: { value: code } });
  fireEvent.click(screen.getByRole('button', { name: /Comprobar código/i }));
}

describe('ActivationFlow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows an error for a national id that is not registered', () => {
    render(<ActivationFlow />);

    fillIdentity('000000000');

    expect(screen.getByRole('alert')).toHaveTextContent('No encontramos esta cédula en el registro institucional.');
  });

  it('shows an error for an incorrect verification code', () => {
    render(<ActivationFlow />);

    fillIdentity();
    fireEvent.change(screen.getByLabelText('Código de verificación'), { target: { value: '000000' } });
    fireEvent.click(screen.getByRole('button', { name: /Comprobar código/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('El código no es correcto. Revíselo e intente nuevamente.');
  });

  it('allows returning to the identity step from verification', () => {
    render(<ActivationFlow />);

    fillIdentity();
    fireEvent.click(screen.getByRole('button', { name: /Cambiar número de cédula/i }));

    expect(screen.getByLabelText('Número de cédula')).toBeInTheDocument();
  });

  it('completes registration and links the institutional identity', () => {
    render(<ActivationFlow />);

    fillIdentity();
    fillVerification();

    expect(screen.getByText('Juan Carlos Rodríguez Vargas')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Vincular identidad/i }));

    expect(screen.getByText('Registro completado')).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem('utn-institutional-identity') ?? '{}');
    expect(stored).toMatchObject({ nationalId: '123456789', institutionalId: '2024-0001' });
  });

  it('navigates home to create a PIN after completing registration', () => {
    render(<ActivationFlow />);
    fillIdentity();
    fillVerification();
    fireEvent.click(screen.getByRole('button', { name: /Vincular identidad/i }));

    const assign = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign });

    fireEvent.click(screen.getByRole('button', { name: /Continuar · Crear PIN/i }));

    expect(assign).toHaveBeenCalledWith('/');
    vi.unstubAllGlobals();
  });

  it('restarts the flow to register another identity', () => {
    render(<ActivationFlow />);
    fillIdentity();
    fillVerification();
    fireEvent.click(screen.getByRole('button', { name: /Vincular identidad/i }));

    fireEvent.click(screen.getByRole('button', { name: /Registrar otra identidad/i }));

    expect(screen.getByLabelText('Número de cédula')).toHaveValue('');
  });
});
