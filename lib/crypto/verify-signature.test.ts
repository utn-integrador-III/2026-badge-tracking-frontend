import { describe, expect, it } from 'vitest';
import { canonicalizeCredential, encodeCredentialForSignature, verifyCredentialSignature } from './verify-signature';
import { mockBadge } from '../../features/badges/mock-data';

describe('credential signature verification', () => {
  it('canonicalizes credentials with stable key ordering', () => {
    expect(canonicalizeCredential({ b: 2, a: { d: 4, c: 3 } })).toBe('{"a":{"c":3,"d":4},"b":2}');
  });

  it('verifies a cryptographic signature for a badge credential', async () => {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256'
      },
      true,
      ['sign', 'verify']
    );
    const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
    const signature = await crypto.subtle.sign(
      {
        name: 'ECDSA',
        hash: 'SHA-256'
      },
      keyPair.privateKey,
      encodeCredentialForSignature(mockBadge)
    );

    await expect(verifyCredentialSignature({ credential: mockBadge, publicKeyJwk, signature })).resolves.toEqual({
      valid: true,
      reason: 'Signature verified'
    });

    await expect(
      verifyCredentialSignature({
        credential: { ...mockBadge, holder: { ...mockBadge.holder, institutionalId: 'tampered' } },
        publicKeyJwk,
        signature
      })
    ).resolves.toEqual({ valid: false, reason: 'Invalid signature' });
  });
});
