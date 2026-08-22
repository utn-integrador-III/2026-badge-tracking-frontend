import type { BadgeVerificationResponse } from '@/lib/api/types';
import type { QrVerificationResult, VerifiedBadgeProfile } from '@/features/verification/verify-qr-token';

function normalizeStatus(status: string | null): VerifiedBadgeProfile['status'] {
  if (status === 'issued' || status === 'active') return 'active';
  if (status === 'suspended') return 'suspended';
  if (status === 'revoked' || status === 'superseded') return 'revoked';
  return 'expired';
}

export function apiVerificationToResult(response: BadgeVerificationResponse): QrVerificationResult {
  const attributes = response.disclosedAttributes;
  const hasProfile = Boolean(attributes.fullName || attributes.institutionalId || attributes.badgeCode);
  const profile = hasProfile
    ? {
        badgeId: attributes.badgeCode ?? '',
        fullName: attributes.fullName ?? 'Atributo no divulgado',
        institutionalId: attributes.institutionalId ?? 'No divulgado',
        institutionName: 'Universidad Técnica Nacional',
        role: attributes.role ?? 'No divulgado',
        status: normalizeStatus(response.badgeStatus),
        validUntil: ''
      }
    : undefined;

  if (response.result === 'pass' && profile) {
    return {
      outcome: 'granted',
      message: 'Firma criptográfica válida. Acceso permitido.',
      profile,
      signatureValid: response.signatureValid,
      verificationId: response.verificationId
    };
  }

  return {
    outcome: 'denied',
    message: response.reasons.length > 0 ? `Verificación rechazada: ${response.reasons.join(', ')}.` : 'La credencial no superó la verificación.',
    profile,
    signatureValid: response.signatureValid,
    verificationId: response.verificationId
  };
}

