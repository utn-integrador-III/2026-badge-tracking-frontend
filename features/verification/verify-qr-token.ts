export type VerifiedBadgeProfile = {
  badgeId: string;
  fullName: string;
  institutionalId: string;
  institutionName: string;
  role: string;
  status: 'active' | 'suspended' | 'revoked' | 'expired';
  validUntil: string;
};

export type QrVerificationResult =
  | { outcome: 'granted'; message: string; profile: VerifiedBadgeProfile }
  | { outcome: 'denied'; message: string; profile?: VerifiedBadgeProfile };

type SharePayload = {
  type: string;
  version: number;
  nonce: string;
  expiresAt: string;
  proof: VerifiedBadgeProfile;
};

function isProfile(value: unknown): value is VerifiedBadgeProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Record<string, unknown>;
  return (
    typeof profile.badgeId === 'string' &&
    typeof profile.fullName === 'string' &&
    typeof profile.institutionalId === 'string' &&
    typeof profile.institutionName === 'string' &&
    typeof profile.role === 'string' &&
    typeof profile.validUntil === 'string' &&
    ['active', 'suspended', 'revoked', 'expired'].includes(String(profile.status))
  );
}

function parsePayload(value: string): SharePayload | null {
  try {
    const payload = JSON.parse(value) as Record<string, unknown>;
    if (
      payload.type !== 'digital-badge-share-token' ||
      payload.version !== 1 ||
      typeof payload.nonce !== 'string' ||
      typeof payload.expiresAt !== 'string' ||
      !isProfile(payload.proof)
    ) {
      return null;
    }
    return payload as unknown as SharePayload;
  } catch {
    return null;
  }
}

export function verifyQrToken(value: string, now = Date.now()): QrVerificationResult {
  const payload = parsePayload(value);
  if (!payload) {
    return { outcome: 'denied', message: 'El código QR no contiene una credencial válida.' };
  }

  const tokenExpiration = new Date(payload.expiresAt).getTime();
  if (!Number.isFinite(tokenExpiration) || tokenExpiration <= now) {
    return { outcome: 'denied', message: 'El código QR expiró. Solicite uno nuevo.', profile: payload.proof };
  }

  if (payload.proof.status !== 'active') {
    return { outcome: 'denied', message: `La credencial está ${payload.proof.status} y no permite acceso.`, profile: payload.proof };
  }

  const badgeExpiration = new Date(`${payload.proof.validUntil}T23:59:59.999Z`).getTime();
  if (!Number.isFinite(badgeExpiration) || badgeExpiration < now) {
    return { outcome: 'denied', message: 'La vigencia de la credencial finalizó.', profile: payload.proof };
  }

  return { outcome: 'granted', message: 'Credencial válida. Acceso permitido.', profile: payload.proof };
}
