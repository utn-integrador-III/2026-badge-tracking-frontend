// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BadgeShareProof } from '@/features/sharing/create-share-token';
import { ShareQr } from './share-qr';

const proof: BadgeShareProof = {
  badgeId: 'badge_demo_001',
  fullName: 'Juan Carlos Rodríguez Vargas',
  institutionalId: '2024-0001',
  institutionName: 'Universidad Técnica Nacional',
  role: 'Student',
  status: 'active',
  validUntil: '2026-12-31'
};

describe('ShareQr', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('generates a QR code with a live countdown when requested', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-27T12:00:00.000Z'));
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('11111111-2222-4333-8444-555555555555');

    render(<ShareQr proof={proof} ttlSeconds={5} />);

    fireEvent.click(screen.getByRole('button', { name: 'Generar QR temporal' }));

    expect(screen.getByRole('timer')).toHaveTextContent('Expira en 5 s');
    expect(screen.getByText('Nombre, rol, numero de identificacion, institucion, estado y vigencia.')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('Este QR expiro')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generar nuevo QR' })).toBeInTheDocument();
  });

  it('shows the custom included fields when provided', () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee');

    render(<ShareQr proof={proof} ttlSeconds={30} includedFields={['Nombre completo', 'Rol']} />);

    fireEvent.click(screen.getByRole('button', { name: 'Generar QR temporal' }));

    expect(screen.getByText('Nombre completo, Rol')).toBeInTheDocument();
  });
});
