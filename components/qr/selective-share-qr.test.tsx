// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { BadgeShareProof } from '@/features/sharing/create-share-token';
import { SelectiveShareQr } from './selective-share-qr';

const proof: BadgeShareProof = {
  badgeId: 'badge_demo_001',
  fullName: 'Juan Carlos Rodríguez Vargas',
  institutionalId: '2024-0001',
  institutionName: 'Universidad Técnica Nacional',
  role: 'Student',
  status: 'active',
  validUntil: '2026-12-31'
};

describe('SelectiveShareQr', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows every shareable field with the required one locked on', () => {
    render(<SelectiveShareQr proof={proof} ttlSeconds={60} />);

    const requiredCheckbox = screen.getByLabelText('ID de credencial') as HTMLInputElement;
    expect(requiredCheckbox.checked).toBe(true);
    expect(requiredCheckbox.disabled).toBe(true);

    const optionalCheckbox = screen.getByLabelText('Rol') as HTMLInputElement;
    expect(optionalCheckbox.checked).toBe(true);
    expect(optionalCheckbox.disabled).toBe(false);
  });

  it('unchecking a field removes it from the QR generation button state', () => {
    render(<SelectiveShareQr proof={proof} ttlSeconds={60} />);

    fireEvent.click(screen.getByLabelText('Rol'));
    fireEvent.click(screen.getByRole('button', { name: 'Generar QR temporal' }));

    expect(
      screen.getByText('ID de credencial, Nombre completo, Identificación institucional, Institución, Estado, Vigencia')
    ).toBeInTheDocument();
  });
});
