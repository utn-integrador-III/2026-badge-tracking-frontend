import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMockShareToken } from './create-share-token';

describe('createMockShareToken', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('creates a signed-share payload shape with selected fields', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-26T12:00:00.000Z'));
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('11111111-2222-4333-8444-555555555555');

    const token = createMockShareToken({
      fields: ['fullName', 'institutionalId'],
      ttlSeconds: 300
    });

    expect(token.expiresAt).toBe('2026-06-26T12:05:00.000Z');
    expect(token.ttlSeconds).toBe(300);
    expect(JSON.parse(token.payload)).toEqual({
      type: 'digital-badge-share-token',
      version: 1,
      fields: ['fullName', 'institutionalId'],
      nonce: '11111111-2222-4333-8444-555555555555',
      expiresAt: '2026-06-26T12:05:00.000Z'
    });
  });

  it('uses the provided ttl to calculate expiration', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-26T00:00:00.000Z'));
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee');

    const { payload } = createMockShareToken({
      fields: [],
      ttlSeconds: 60
    });

    expect(JSON.parse(payload).expiresAt).toBe('2026-06-26T00:01:00.000Z');
  });
});
