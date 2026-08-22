// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { QrVerificationResult } from '@/features/verification/verify-qr-token';
import { VerificationResult } from './verification-result';

const profile = {
  badgeId: 'badge_demo_001',
  fullName: 'Juan Carlos Rodríguez Vargas',
  institutionalId: '2024-0001',
  institutionName: 'Universidad Técnica Nacional',
  role: 'Student',
  status: 'active' as const,
  validUntil: '2026-12-31'
};

describe('VerificationResult', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a granted result with the badge profile', () => {
    const result: QrVerificationResult = { outcome: 'granted', message: 'Credencial válida. Acceso permitido.', profile };
    render(<VerificationResult result={result} />);

    expect(screen.getByText('Acceso permitido')).toBeInTheDocument();
    expect(screen.getByText('Credencial válida. Acceso permitido.')).toBeInTheDocument();
    expect(screen.getByText(profile.fullName)).toBeInTheDocument();
    expect(screen.getByText(profile.institutionalId)).toBeInTheDocument();
  });

  it('renders a denied result without a profile', () => {
    const result: QrVerificationResult = { outcome: 'denied', message: 'El código QR expiró. Solicite uno nuevo.' };
    render(<VerificationResult result={result} />);

    expect(screen.getByText('Acceso denegado')).toBeInTheDocument();
    expect(screen.getByText('El código QR expiró. Solicite uno nuevo.')).toBeInTheDocument();
    expect(screen.queryByText('Nombre completo')).not.toBeInTheDocument();
  });
});
