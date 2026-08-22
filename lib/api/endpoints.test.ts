import { describe, expect, it } from 'vitest';
import { apiEndpoints } from './endpoints';

describe('AWS API endpoint contract', () => {
  it('uses the routes exposed by the FastAPI backend', () => {
    expect(apiEndpoints.users.profile('123456789')).toBe('/users/123456789/badge-profile');
    expect(apiEndpoints.users.verificationQr('123456789')).toBe('/users/123456789/verification-qr');
    expect(apiEndpoints.badges.search).toBe('/badges/search');
    expect(apiEndpoints.badges.status(42)).toBe('/badges/42/status');
    expect(apiEndpoints.verification.badge).toBe('/verifications/badge');
  });
});

