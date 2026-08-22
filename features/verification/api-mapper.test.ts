import { describe, expect, it } from 'vitest';
import { apiVerificationToResult } from './api-mapper';
import type { BadgeVerificationResponse } from '@/lib/api/types';

const response: BadgeVerificationResponse = {
  result: 'pass',
  signatureValid: true,
  reasons: [],
  disclosedAttributes: {
    fullName: 'Persona QA',
    institutionalId: '123456789',
    role: 'student',
    badgeCode: 'BADGE-123456789-ABC'
  },
  badgeStatus: 'issued',
  issuedAt: '2026-08-22T00:00:00+00:00',
  expiresAt: '2026-08-22T00:05:00+00:00',
  remainingSeconds: 300,
  verifiedAt: '2026-08-22T00:00:01+00:00',
  verificationId: 'verification-1'
};

describe('AWS verification mapper', () => {
  it('maps a cryptographic pass to granted access', () => {
    expect(apiVerificationToResult(response)).toMatchObject({
      outcome: 'granted',
      signatureValid: true,
      profile: { status: 'active', institutionalId: '123456789' }
    });
  });

  it('preserves backend rejection reasons', () => {
    expect(apiVerificationToResult({ ...response, result: 'fail', reasons: ['badge_not_active'], badgeStatus: 'suspended' })).toMatchObject({
      outcome: 'denied',
      message: 'Verificación rechazada: badge_not_active.',
      profile: { status: 'suspended' }
    });
  });
});

