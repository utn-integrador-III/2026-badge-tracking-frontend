import type { DigitalBadge } from '@/types/badge';

export type InstitutionBranding = {
  badgeGradient: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
};

const defaultBranding: InstitutionBranding = {
  badgeGradient: 'from-[#2949aa] to-[#142b75]',
  logoUrl: '/brand/logo.png',
  primaryColor: '#20398b',
  secondaryColor: '#142b75',
  textColor: '#ffffff'
};

const institutionBranding: Record<string, InstitutionBranding> = {
  'Universidad Técnica Nacional': defaultBranding,
  'Universidad TÃ©cnica Nacional': defaultBranding
};

export function getInstitutionBranding(institutionName: string) {
  return institutionBranding[institutionName] ?? defaultBranding;
}

export function getBadgeBranding(badge: DigitalBadge) {
  const fallback = getInstitutionBranding(badge.institution.name);

  return {
    ...fallback,
    logoUrl: badge.institution.logoUrl ?? fallback.logoUrl,
    primaryColor: badge.institution.primaryColor ?? fallback.primaryColor,
    secondaryColor: badge.institution.secondaryColor ?? fallback.secondaryColor,
    textColor: badge.institution.textColor ?? fallback.textColor
  };
}
