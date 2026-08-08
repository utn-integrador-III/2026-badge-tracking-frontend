import { apiEndpoints } from '@/lib/api/endpoints';
import { apiGet, apiPost } from '@/lib/api/http-client';
import type { CredentialVerificationPayload } from '@/lib/api/types';

export const verificationApi = {
  verifyCredential: <T>(payload: CredentialVerificationPayload) => apiPost<T>(apiEndpoints.verification.verify, payload),
  verifyQr: <T>(payload: { token: string }) => apiPost<T>(apiEndpoints.verification.qr, payload),
  verifyNfc: <T>(payload: { nfc_payload: string }) => apiPost<T>(apiEndpoints.verification.nfc, payload),
  getJwks: <T>() => apiGet<T>(apiEndpoints.verification.jwks),
  getOfflineBundle: <T>() => apiGet<T>(apiEndpoints.verification.offlineBundle)
};
