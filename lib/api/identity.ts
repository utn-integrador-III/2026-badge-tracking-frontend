import { apiEndpoints } from '@/lib/api/endpoints';
import { apiGet, apiPatch, apiPost } from '@/lib/api/http-client';
import type {
  AdminBadgeSearchPayload,
  AdminBadgeSearchResponse,
  BadgeProfileResponse,
  BadgeVerificationQrResponse,
  DisclosableAttribute,
  ExtendedBadgeProfileResponse,
  IssueBadgePayload,
  IssueBadgeResponse,
  RegisterIdentityPayload,
  RegisterIdentityResponse,
  UpdateBadgeStatusPayload,
  UpdateBadgeStatusResponse
} from '@/lib/api/types';

export const identityApi = {
  registerIdentity: (payload: RegisterIdentityPayload) =>
    apiPost<RegisterIdentityResponse>(apiEndpoints.users.register, payload),
  getBadgeProfile: (institutionalId: string) =>
    apiGet<BadgeProfileResponse>(apiEndpoints.users.profile(institutionalId)),
  getExtendedBadgeProfile: (institutionalId: string, pin: string) =>
    apiPost<ExtendedBadgeProfileResponse>(apiEndpoints.users.profileDetails(institutionalId), { pin }),
  generateVerificationQr: (
    institutionalId: string,
    payload: { pin: string; disclose: DisclosableAttribute[]; expiresInSeconds: number }
  ) => apiPost<BadgeVerificationQrResponse>(apiEndpoints.users.verificationQr(institutionalId), payload),
  issueBadge: (payload: IssueBadgePayload) =>
    apiPost<IssueBadgeResponse>(apiEndpoints.badges.root, payload),
  searchBadgeHolders: (payload: AdminBadgeSearchPayload) =>
    apiPost<AdminBadgeSearchResponse>(apiEndpoints.badges.search, payload),
  updateBadgeStatus: (badgeId: number, payload: UpdateBadgeStatusPayload) =>
    apiPatch<UpdateBadgeStatusResponse>(apiEndpoints.badges.status(badgeId), payload)
};
