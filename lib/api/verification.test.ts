import { describe, expect, it, vi } from 'vitest';
import { apiEndpoints } from './endpoints';
import { apiGet, apiPost } from './http-client';
import { verificationApi } from './verification';

vi.mock('./http-client', () => ({
  apiGet: vi.fn().mockResolvedValue({ ok: true }),
  apiPost: vi.fn().mockResolvedValue({ ok: true })
}));

describe('verificationApi', () => {
  it('verifies a credential', async () => {
    await verificationApi.verifyCredential({ token: 't1' });
    expect(apiPost).toHaveBeenCalledWith(apiEndpoints.verification.verify, { token: 't1' });
  });

  it('verifies a QR token', async () => {
    await verificationApi.verifyQr({ token: 't1' });
    expect(apiPost).toHaveBeenCalledWith(apiEndpoints.verification.qr, { token: 't1' });
  });

  it('verifies an NFC payload', async () => {
    await verificationApi.verifyNfc({ nfc_payload: 'p1' });
    expect(apiPost).toHaveBeenCalledWith(apiEndpoints.verification.nfc, { nfc_payload: 'p1' });
  });

  it('fetches the JWKS', async () => {
    await verificationApi.getJwks();
    expect(apiGet).toHaveBeenCalledWith(apiEndpoints.verification.jwks);
  });

  it('fetches the offline bundle', async () => {
    await verificationApi.getOfflineBundle();
    expect(apiGet).toHaveBeenCalledWith(apiEndpoints.verification.offlineBundle);
  });
});
