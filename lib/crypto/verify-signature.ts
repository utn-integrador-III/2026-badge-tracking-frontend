export type CredentialSignatureInput = {
  credential: unknown;
  publicKeyJwk: JsonWebKey;
  signature: ArrayBuffer;
};

export type CredentialSignatureResult =
  | { valid: true; reason: 'Signature verified' }
  | { valid: false; reason: 'Invalid signature' | 'Verification failed' };

function sortCredentialValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortCredentialValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entryValue]) => [key, sortCredentialValue(entryValue)])
    );
  }

  return value;
}

export function canonicalizeCredential(credential: unknown) {
  return JSON.stringify(sortCredentialValue(credential));
}

export function encodeCredentialForSignature(credential: unknown) {
  return new TextEncoder().encode(canonicalizeCredential(credential));
}

export async function importCredentialPublicKey(publicKeyJwk: JsonWebKey) {
  return crypto.subtle.importKey(
    'jwk',
    publicKeyJwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-256'
    },
    false,
    ['verify']
  );
}

export async function verifyCredentialSignature({
  credential,
  publicKeyJwk,
  signature
}: CredentialSignatureInput): Promise<CredentialSignatureResult> {
  try {
    const publicKey = await importCredentialPublicKey(publicKeyJwk);
    const valid = await crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: 'SHA-256'
      },
      publicKey,
      signature,
      encodeCredentialForSignature(credential)
    );

    return valid ? { valid: true, reason: 'Signature verified' } : { valid: false, reason: 'Invalid signature' };
  } catch {
    return { valid: false, reason: 'Verification failed' };
  }
}
