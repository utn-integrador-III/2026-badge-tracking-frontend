type CreateShareTokenInput = {
  fields: string[];
  ttlSeconds: number;
};

export type BadgeShareProof = {
  badgeId: string;
  fullName: string;
  institutionalId: string;
  institutionName: string;
  role: string;
  status: 'active' | 'suspended' | 'revoked' | 'expired';
  validUntil: string;
};

type CreateBadgeShareTokenInput = {
  proof: BadgeShareProof;
  ttlSeconds: number;
};

export type ShareToken = {
  expiresAt: string;
  payload: string;
  ttlSeconds: number;
};

export function createMockShareToken(input: CreateShareTokenInput): ShareToken {
export function createMockShareToken(input: CreateShareTokenInput) {
  const expiresAt = new Date(Date.now() + input.ttlSeconds * 1000).toISOString();

  return {
    expiresAt,
    ttlSeconds: input.ttlSeconds,
    payload: JSON.stringify({
      type: 'digital-badge-share-token',
      version: 1,
      fields: input.fields,
      nonce: crypto.randomUUID(),
      expiresAt
    })
  };
}

export function createBadgeShareToken(input: CreateBadgeShareTokenInput): ShareToken {
  if (!Number.isInteger(input.ttlSeconds) || input.ttlSeconds <= 0) {
    throw new Error('Token lifetime must be a positive number of seconds.');
  }

  const expiresAt = new Date(Date.now() + input.ttlSeconds * 1000).toISOString();

  return {
    expiresAt,
    ttlSeconds: input.ttlSeconds,
    payload: JSON.stringify({
      type: 'digital-badge-share-token',
      version: 1,
      nonce: crypto.randomUUID(),
      expiresAt,
      proof: input.proof
    })
  };
}
