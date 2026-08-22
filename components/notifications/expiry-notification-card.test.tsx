// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mockBadge } from '@/features/badges/mock-data';
import { ExpiryNotificationCard } from './expiry-notification-card';

describe('ExpiryNotificationCard', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('shows the safe state when the badge is far from expiring', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-01T00:00:00.000Z'));

    render(<ExpiryNotificationCard badge={mockBadge} />);

    expect(screen.getByText('Credencial vigente')).toBeInTheDocument();
    expect(screen.getByText(`Fecha limite: ${mockBadge.validUntil}`)).toBeInTheDocument();
  });

  it('shows the warning state when the badge is close to expiring', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-12-15T00:00:00.000Z'));

    render(<ExpiryNotificationCard badge={mockBadge} />);

    expect(screen.getByText('Renovacion cercana')).toBeInTheDocument();
  });

  it('shows the expired state when the badge is past its validity', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2027-01-15T00:00:00.000Z'));

    render(<ExpiryNotificationCard badge={mockBadge} />);

    expect(screen.getByText('Credencial expirada')).toBeInTheDocument();
  });
});
