export type ApiRole = 'student' | 'professor' | 'staff' | 'admin';
export type BadgeLifecycleStatus = 'suspended' | 'revoked';
export type DisclosableAttribute = 'fullName' | 'photoUrl' | 'role' | 'institutionalId' | 'badgeCode';

export type InstitutionBrandingResponse = {
  institution: string;
  primaryColor: string;
  secondaryColor: string;
  contrastTextColor: string;
  logoUrl: string | null;
  logoContentType: string | null;
  logoSizeInBytes: number | null;
  logoUpdatedAt: string | null;
  isCustomized: boolean;
  updatedAt: string | null;
};

export type ApiBadge = {
  id: number;
  userId: number;
  badgeCode: string;
  roleType: ApiRole;
  status: string;
  issuedAt: string;
  validFrom: string;
  validUntil: string;
};

export type ApiUser = {
  id: number;
  fullName: string;
  email: string;
  role: ApiRole;
  institutionalId: string;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
};

export type RegisterIdentityPayload = {
  fullName: string;
  email: string;
  role: ApiRole;
  institutionalId: string;
  photoUrl?: string | null;
  birthDate?: string | null;
  nationality?: string | null;
  birthplace?: string | null;
  documentExpiry?: string | null;
  digitalSignatureUrl?: string | null;
};

export type RegisterIdentityResponse = {
  message: string;
  user: ApiUser;
  badge: ApiBadge;
};

export type BadgeProfileResponse = {
  photoUrl: string | null;
  fullName: string;
  role: ApiRole;
  institutionalId: string;
  badgeCode: string;
  roleType: ApiRole;
  status: string;
  validFrom: string;
  validUntil: string;
  branding: InstitutionBrandingResponse;
};

export type ExtendedBadgeProfileResponse = BadgeProfileResponse & {
  issuedAt: string;
  issuingAuthority: string;
  nationality: string | null;
  birthplace: string | null;
  documentExpiry: string | null;
  digitalSignatureUrl: string | null;
};

export type BadgeVerificationQrResponse = {
  token: string;
  verificationUrl: string;
  qrCodeImage: string;
  disclosedAttributes: DisclosableAttribute[];
  issuedAt: string;
  expiresAt: string;
  expiresInSeconds: number;
  remainingSeconds: number;
  serverTime: string;
};

export type BadgeVerificationResponse = {
  result: 'pass' | 'fail';
  signatureValid: boolean;
  reasons: string[];
  disclosedAttributes: Record<string, string | null>;
  badgeStatus: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
  remainingSeconds: number | null;
  verifiedAt: string;
  verificationId: string;
};

export type IssueBadgePayload = {
  adminInstitutionalId: string;
  adminPin: string;
  institutionalId: string;
  roleType?: ApiRole;
  validForDays: number;
};

export type IssueBadgeResponse = {
  message: string;
  badge: ApiBadge;
  supersededBadgeId: number | null;
};

export type AdminBadgeSearchPayload = {
  adminInstitutionalId: string;
  adminPin: string;
  query: string;
  limit?: number;
};

export type AdminBadgeSearchResult = {
  userId: number;
  fullName: string;
  email: string;
  institutionalId: string;
  role: ApiRole;
  isActive: boolean;
  badge: ApiBadge | null;
};

export type AdminBadgeSearchResponse = {
  count: number;
  results: AdminBadgeSearchResult[];
};

export type UpdateBadgeStatusPayload = {
  adminInstitutionalId: string;
  adminPin: string;
  status: BadgeLifecycleStatus;
  reason: string;
};

export type UpdateBadgeStatusResponse = {
  message: string;
  badge: ApiBadge;
  previousStatus: string;
  changed: boolean;
  changedAt: string;
  reason: string;
};
