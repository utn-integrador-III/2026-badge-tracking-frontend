import { verifyQrToken, type QrVerificationResult } from './verify-qr-token';

export type OfflineVerificationBundle = {
  generatedAt: string;
  trustedBadgeIds: string[];
};

export type OfflineVerificationResult = QrVerificationResult & {
  offline: true;
};

export function verifyQrTokenOffline(value: string, bundle: OfflineVerificationBundle, now = Date.now()): OfflineVerificationResult {
  const onlineEquivalent = verifyQrToken(value, now);

  if (onlineEquivalent.outcome === 'denied') {
    return { ...onlineEquivalent, offline: true };
  }

  if (!bundle.trustedBadgeIds.includes(onlineEquivalent.profile.badgeId)) {
    return {
      outcome: 'denied',
      message: 'La credencial no existe en el paquete offline de verificacion.',
      profile: onlineEquivalent.profile,
      offline: true
    };
  }

  return {
    ...onlineEquivalent,
    message: `${onlineEquivalent.message} Verificacion offline completada.`,
    offline: true
  };
}

export function isOfflineBundleFresh(bundle: OfflineVerificationBundle, maxAgeHours: number, now = Date.now()) {
  const generatedAt = new Date(bundle.generatedAt).getTime();
  if (!Number.isFinite(generatedAt)) return false;
  return now - generatedAt <= maxAgeHours * 60 * 60 * 1000;
}
