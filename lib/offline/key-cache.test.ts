import { afterEach, describe, expect, it, vi } from 'vitest';
import { cachePublicKeyBundle, getCachedPublicKeyBundle } from './key-cache';

describe('public key cache', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('stores a public key bundle in the expected cache', async () => {
    const add = vi.fn();
    const open = vi.fn().mockResolvedValue({ add });
    vi.stubGlobal('caches', { open });

    await cachePublicKeyBundle('/keys/public.json');

    expect(open).toHaveBeenCalledWith('digital-badge-public-keys-v1');
    expect(add).toHaveBeenCalledWith('/keys/public.json');
  });

  it('reads a public key bundle from the expected cache', async () => {
    const cachedResponse = new Response('{"keys":[]}');
    const match = vi.fn().mockResolvedValue(cachedResponse);
    const open = vi.fn().mockResolvedValue({ match });
    vi.stubGlobal('caches', { open });

    await expect(getCachedPublicKeyBundle('/keys/public.json')).resolves.toBe(cachedResponse);
    expect(open).toHaveBeenCalledWith('digital-badge-public-keys-v1');
    expect(match).toHaveBeenCalledWith('/keys/public.json');
  });
});
