type CreateShareTokenInput = {
  fields: string[];
  ttlSeconds: number;
};

export type ShareToken = {
  expiresAt: string;
  payload: string;
  ttlSeconds: number;
};

export function createMockShareToken(input: CreateShareTokenInput): ShareToken {
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
