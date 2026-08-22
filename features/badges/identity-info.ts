import type { DigitalBadge } from '@/types/badge';

export type IdentityInfoRow = {
  label: string;
  value: string;
};

export function getExtendedIdentityInfo(badge: DigitalBadge): IdentityInfoRow[] {
  const profile = badge.extendedIdentity;
  if (!profile) return [];

  return [
    { label: 'Sede', value: profile.campus },
    { label: 'Programa', value: profile.program },
    { label: 'Correo institucional', value: profile.email },
    { label: 'Periodo vigente', value: profile.currentPeriod },
    { label: 'Condición', value: profile.standing },
    { label: 'Nacionalidad', value: profile.nationality ?? '' },
    { label: 'Lugar de nacimiento', value: profile.birthplace ?? '' },
    { label: 'Vencimiento del documento', value: profile.documentExpiry ?? '' },
    { label: 'Firma visual registrada', value: profile.digitalSignatureUrl ?? '' }
  ].filter((row) => row.value.trim().length > 0);
}
