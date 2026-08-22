import { describe, expect, it } from 'vitest';
import { mockBadge } from '../badges/mock-data';
import { getDaysUntilExpiry, getExpiryNotification } from './expiry-notifications';

describe('expiry notifications', () => {
  it('calculates days until badge expiry', () => {
    expect(getDaysUntilExpiry('2026-08-31', new Date('2026-08-21T12:00:00Z'))).toBe(11);
  });

  it('warns when renewal is inside the configured window', () => {
    const notification = getExpiryNotification({ ...mockBadge, validUntil: '2026-08-31' }, new Date('2026-08-21T12:00:00Z'));

    expect(notification.level).toBe('warning');
    expect(notification.title).toBe('Renovacion cercana');
  });

  it('marks expired badges for renewal', () => {
    const notification = getExpiryNotification({ ...mockBadge, status: 'expired', validUntil: '2026-08-01' }, new Date('2026-08-21T12:00:00Z'));

    expect(notification.level).toBe('expired');
  });
});
