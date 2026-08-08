import { describe, expect, it } from 'vitest';
import { verifyQrTokenOffline, isOfflineBundleFresh } from './offline-verification';

const now = new Date('2026-08-07T12:00:00Z').getTime();
const activePayload = JSON.stringify({
  type: 'digital-badge-share-token',
  version: 1,
  nonce: 'offline-demo',
  expiresAt: '2026-08-07T12:01:00Z',
  proof: {
    badgeId: 'badge_demo_001',
    fullName: 'Juan Carlos Rodríguez Vargas',
    institutionalId: '2024-0001',
    institutionName: 'Universidad Técnica Nacional',
    role: 'Student',
    status: 'active',
    validUntil: '2026-12-31'
  }
});

describe('offline verification', () => {
  it('grants access when the QR and offline bundle are valid', () => {
    expect(
      verifyQrTokenOffline(activePayload, {
        generatedAt: '2026-08-07T08:00:00Z',
        trustedBadgeIds: ['badge_demo_001']
      }, now)
    ).toMatchObject({ outcome: 'granted', offline: true });
  });

  it('denies access when the badge is not in the offline bundle', () => {
    expect(
      verifyQrTokenOffline(activePayload, {
        generatedAt: '2026-08-07T08:00:00Z',
        trustedBadgeIds: ['another_badge']
      }, now)
    ).toMatchObject({ outcome: 'denied', offline: true });
  });

  it('detects stale offline bundles', () => {
    expect(isOfflineBundleFresh({ generatedAt: '2026-08-07T10:00:00Z', trustedBadgeIds: [] }, 4, now)).toBe(true);
    expect(isOfflineBundleFresh({ generatedAt: '2026-08-06T10:00:00Z', trustedBadgeIds: [] }, 4, now)).toBe(false);
  });
});
