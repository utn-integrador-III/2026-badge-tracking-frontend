import { describe, expect, it } from 'vitest';
import { verifyQrToken } from './verify-qr-token';

const now = new Date('2026-07-01T12:00:00.000Z').getTime();

function token(overrides: Record<string, unknown> = {}) {
  return JSON.stringify({
    type: 'digital-badge-share-token',
    version: 1,
    nonce: '11111111-2222-4333-8444-555555555555',
    expiresAt: '2026-07-01T12:01:00.000Z',
    proof: {
      badgeId: 'badge-001',
      fullName: 'Ana Vargas',
      institutionalId: '2026-0001',
      institutionName: 'Universidad Técnica Nacional',
      role: 'Student',
      status: 'active',
      validUntil: '2026-12-31'
    },
    ...overrides
  });
}

describe('verifyQrToken', () => {
  it('grants access and returns profile information for a valid QR', () => {
    const result = verifyQrToken(token(), now);
    expect(result.outcome).toBe('granted');
    expect(result.profile).toMatchObject({ fullName: 'Ana Vargas', institutionalId: '2026-0001' });
  });

  it('denies access when the QR token is expired', () => {
    const result = verifyQrToken(token({ expiresAt: '2026-07-01T11:59:59.000Z' }), now);
    expect(result).toMatchObject({ outcome: 'denied', message: expect.stringContaining('expiró') });
  });

  it('denies access for a revoked badge', () => {
    const payload = JSON.parse(token());
    payload.proof.status = 'revoked';
    expect(verifyQrToken(JSON.stringify(payload), now)).toMatchObject({ outcome: 'denied', message: expect.stringContaining('revoked') });
  });

  it('denies malformed QR content', () => {
    expect(verifyQrToken('not-a-valid-token', now)).toEqual({ outcome: 'denied', message: 'El código QR no contiene una credencial válida.' });
  });
});
