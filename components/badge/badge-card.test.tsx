// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mockBadge } from '@/features/badges/mock-data';
import { BadgeCard } from './badge-card';

describe('BadgeCard', () => {
  it('renders the holder identity and institution details', () => {
    render(<BadgeCard badge={mockBadge} />);

    expect(screen.getByText(mockBadge.institution.name)).toBeInTheDocument();
    expect(screen.getByText(mockBadge.holder.fullName)).toBeInTheDocument();
    expect(screen.getByText(mockBadge.holder.institutionalId)).toBeInTheDocument();
    expect(screen.getByText(mockBadge.holder.department)).toBeInTheDocument();
    expect(screen.getByText('Estudiante')).toBeInTheDocument();
    expect(screen.getByText('STU')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver información completa' })).toHaveAttribute('href', '/badge');
  });
});
