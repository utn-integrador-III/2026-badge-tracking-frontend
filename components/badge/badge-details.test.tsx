// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { DigitalBadge } from '@/types/badge';
import { mockBadge } from '@/features/badges/mock-data';
import { BadgeDetails } from './badge-details';

describe('BadgeDetails', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the core credential fields and signature details', () => {
    render(<BadgeDetails badge={mockBadge} />);

    expect(screen.getByText('Detalle de credencial')).toBeInTheDocument();
    expect(screen.getByText(mockBadge.holder.fullName)).toBeInTheDocument();
    expect(screen.getByText(mockBadge.issuer)).toBeInTheDocument();
    expect(screen.getByText('EC-P256')).toBeInTheDocument();
    expect(screen.getByText('8f4c...19a2')).toBeInTheDocument();
    expect(screen.getByText('Firma vinculada a credencial activa')).toBeInTheDocument();
  });

  it('renders extended identity info when present', () => {
    render(<BadgeDetails badge={mockBadge} />);

    expect(screen.getByText('Informacion extendida de identidad')).toBeInTheDocument();
    expect(screen.getByText(mockBadge.extendedIdentity!.campus)).toBeInTheDocument();
  });

  it('omits the extended identity section when absent', () => {
    const badge: DigitalBadge = { ...mockBadge, extendedIdentity: undefined };
    render(<BadgeDetails badge={badge} />);

    expect(screen.queryByText('Informacion extendida de identidad')).not.toBeInTheDocument();
  });
});
