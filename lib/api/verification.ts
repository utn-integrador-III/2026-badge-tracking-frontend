import { apiEndpoints } from '@/lib/api/endpoints';
import { apiGet, apiPost } from '@/lib/api/http-client';
import type { BadgeVerificationResponse } from '@/lib/api/types';

export const verificationApi = {
  verifyBadge: (scannedValue: string) =>
    apiPost<BadgeVerificationResponse>(apiEndpoints.verification.badge, { scannedValue }),
  verifyBadgeToken: (token: string) =>
    apiGet<BadgeVerificationResponse>(apiEndpoints.verification.badgeToken(token)),
  getCountdown: (scannedValue: string) =>
    apiPost<{ remainingSeconds: number; expiresAt: string; expired: boolean }>(apiEndpoints.verification.countdown, { scannedValue })
};
