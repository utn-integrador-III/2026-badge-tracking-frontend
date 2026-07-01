import { describe, expect, it } from 'vitest';
import { initialBadgeHolders, revokeBadgeHolder, searchBadgeHolders } from './badge-management';

describe('badge management', () => {
  it('searches badge holders by name without accent sensitivity', () => {
    expect(searchBadgeHolders(initialBadgeHolders, 'maria')).toHaveLength(2);
    expect(searchBadgeHolders(initialBadgeHolders, 'jimenez')).toEqual([expect.objectContaining({ institutionalId: '2022-0088' })]);
  });

  it('searches by institutional ID and email', () => {
    expect(searchBadgeHolders(initialBadgeHolders, '2024-0001')[0].fullName).toContain('Juan Carlos');
    expect(searchBadgeHolders(initialBadgeHolders, 'avargas@utn.ac.cr')[0].role).toBe('Professor');
  });

  it('revokes the selected badge and marks its account inactive', () => {
    const updated = revokeBadgeHolder(initialBadgeHolders, 'badge_demo_001', 'Graduation completed', '2026-07-01T12:00:00.000Z');

    expect(updated[0]).toMatchObject({
      accountStatus: 'inactive',
      badgeStatus: 'revoked',
      revocationReason: 'Graduation completed',
      revokedAt: '2026-07-01T12:00:00.000Z'
    });
    expect(initialBadgeHolders[0].badgeStatus).toBe('active');
  });

  it('requires a reason and an existing badge', () => {
    expect(() => revokeBadgeHolder(initialBadgeHolders, 'badge_demo_001', ' ')).toThrow('A revocation reason is required.');
    expect(() => revokeBadgeHolder(initialBadgeHolders, 'missing', 'Termination')).toThrow('Badge holder was not found.');
  });
});
