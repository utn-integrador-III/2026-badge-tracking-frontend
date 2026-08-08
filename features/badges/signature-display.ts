import type { DigitalBadge } from '@/types/badge';

export type BadgeSignatureDisplay = {
  algorithm: string;
  fingerprint: string;
  statusLabel: string;
};

export function getBadgeSignatureDisplay(badge: DigitalBadge): BadgeSignatureDisplay {
  const [algorithm = 'Unknown', fingerprint = badge.signaturePreview] = badge.signaturePreview.split(':');

  return {
    algorithm,
    fingerprint,
    statusLabel: badge.status === 'active' ? 'Firma vinculada a credencial activa' : 'Firma asociada a credencial no activa'
  };
}
