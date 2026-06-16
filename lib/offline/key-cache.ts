const KEY_CACHE_NAME = 'digital-badge-public-keys-v1';

export async function cachePublicKeyBundle(url: string) {
  const cache = await caches.open(KEY_CACHE_NAME);
  await cache.add(url);
}

export async function getCachedPublicKeyBundle(url: string) {
  const cache = await caches.open(KEY_CACHE_NAME);
  return cache.match(url);
}
