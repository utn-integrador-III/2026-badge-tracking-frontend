import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBadgeShareToken, type BadgeShareProof } from './create-share-token';

const proof: BadgeShareProof = {
  badgeId: 'badge-001',
  fullName: 'Ana Vargas',
  institutionalId: '2026-0001',
  institutionName: 'Universidad Técnica Nacional',
  role: 'Student',
  status: 'active',
  validUntil: '2026-12-31'
};

describe('createBadgeShareToken', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('creates a time-limited QR payload with badge information', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-01T12:00:00.000Z'));
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('11111111-2222-4333-8444-555555555555');

    const token = createBadgeShareToken({ proof, ttlSeconds: 60 });

    expect(token.expiresAt).toBe('2026-07-01T12:01:00.000Z');
    expect(token.ttlSeconds).toBe(60);
    expect(JSON.parse(token.payload)).toEqual({
      type: 'digital-badge-share-token',
      version: 1,
      nonce: '11111111-2222-4333-8444-555555555555',
      expiresAt: '2026-07-01T12:01:00.000Z',
      proof
    });
  });

  it('rejects non-positive token lifetimes', () => {
    expect(() => createBadgeShareToken({ proof, ttlSeconds: 0 })).toThrow('Token lifetime must be a positive number of seconds.');
  });
});
