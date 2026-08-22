import type { BadgeProfileResponse, ExtendedBadgeProfileResponse } from '@/lib/api/types';
import type { BadgeRole, DigitalBadge } from '@/types/badge';

function getInitials(fullName: string) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function mapRole(role: BadgeProfileResponse['roleType']): BadgeRole {
  if (role === 'student') return 'Student';
  if (role === 'professor') return 'Professor';
  return 'Staff';
}

function mapStatus(status: string): DigitalBadge['status'] {
  if (status === 'issued' || status === 'active') return 'active';
  if (status === 'suspended') return 'suspended';
  if (status === 'revoked' || status === 'superseded') return 'revoked';
  return 'expired';
}

function dateOnly(value: string) {
  return value.slice(0, 10);
}

function proxyBrandingAsset(url: string | null) {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith('/institutions/branding/logos/')) {
      return `/api/backend${parsed.pathname}`;
    }
  } catch {
    if (url.startsWith('/institutions/branding/logos/')) {
      return `/api/backend${url}`;
    }
  }

  return url;
}

export function profileToDigitalBadge(profile: BadgeProfileResponse | ExtendedBadgeProfileResponse): DigitalBadge {
  const extended = 'issuedAt' in profile ? profile : null;

  return {
    id: profile.badgeCode,
    role: mapRole(profile.roleType),
    holder: {
      fullName: profile.fullName,
      initials: getInitials(profile.fullName),
      photoUrl: profile.photoUrl || '/profile-placeholder.svg',
      institutionalId: profile.institutionalId,
      department: mapRole(profile.roleType)
    },
    extendedIdentity: extended
      ? {
          campus: '',
          currentPeriod: '',
          email: '',
          program: '',
          standing: '',
          nationality: extended.nationality ?? '',
          birthplace: extended.birthplace ?? '',
          documentExpiry: extended.documentExpiry ?? '',
          digitalSignatureUrl: extended.digitalSignatureUrl ?? ''
        }
      : undefined,
    institution: {
      name: profile.branding.institution,
      logoUrl: proxyBrandingAsset(profile.branding.logoUrl),
      primaryColor: profile.branding.primaryColor,
      secondaryColor: profile.branding.secondaryColor,
      textColor: profile.branding.contrastTextColor
    },
    issuedAt: dateOnly(extended?.issuedAt ?? profile.validFrom),
    validUntil: dateOnly(profile.validUntil),
    issuer: extended?.issuingAuthority ?? profile.branding.institution,
    status: mapStatus(profile.status),
    signaturePreview: `ECDSA-P256:${profile.badgeCode}`
  };
}
