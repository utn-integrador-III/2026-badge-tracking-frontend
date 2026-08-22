import type { DigitalBadge } from '@/types/badge';

export type ExpiryNotification = {
  level: 'safe' | 'warning' | 'expired';
  message: string;
  renewBy: string;
  title: string;
};

export function getDaysUntilExpiry(validUntil: string, now = new Date()) {
  const expirationDate = new Date(`${validUntil}T23:59:59.999Z`);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.ceil((expirationDate.getTime() - now.getTime()) / millisecondsPerDay);
}

export function getExpiryNotification(badge: DigitalBadge, now = new Date(), warningWindowDays = 30): ExpiryNotification {
  const daysUntilExpiry = getDaysUntilExpiry(badge.validUntil, now);

  if (daysUntilExpiry < 0 || badge.status === 'expired') {
    return {
      level: 'expired',
      title: 'Credencial expirada',
      message: 'La vigencia de su carnet digital finalizo. Solicite la renovacion para recuperar acceso.',
      renewBy: badge.validUntil
    };
  }

  if (daysUntilExpiry <= warningWindowDays) {
    return {
      level: 'warning',
      title: 'Renovacion cercana',
      message: `Su carnet vence en ${daysUntilExpiry} dias. Inicie el proceso de renovacion a tiempo.`,
      renewBy: badge.validUntil
    };
  }

  return {
    level: 'safe',
    title: 'Credencial vigente',
    message: `Su carnet esta vigente hasta el ${badge.validUntil}. Le avisaremos antes de que deba renovarlo.`,
    renewBy: badge.validUntil
  };
}
