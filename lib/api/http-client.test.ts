import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const originalUrlBase = process.env.NEXT_PUBLIC_URL_BASE;
const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

async function loadClient(urlBase?: string, apiBaseUrl?: string) {
  vi.resetModules();

  if (urlBase === undefined) {
    delete process.env.NEXT_PUBLIC_URL_BASE;
  } else {
    process.env.NEXT_PUBLIC_URL_BASE = urlBase;
  }

  if (apiBaseUrl === undefined) {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
  } else {
    process.env.NEXT_PUBLIC_API_BASE_URL = apiBaseUrl;
  }

  return import('./http-client');
}

describe('api http client', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    process.env.NEXT_PUBLIC_URL_BASE = originalUrlBase;
    process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
  });

  it('sends JSON requests with normalized base url and bearer token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const { apiPost } = await loadClient('https://api.example.test/');
    const result = await apiPost<{ ok: boolean }>(
      'badges',
      { id: 'badge_demo_001' },
      { accessToken: 'token-123' }
    );

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.test/badges',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ id: 'badge_demo_001' })
      })
    );

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Headers;
    expect(headers.get('Accept')).toBe('application/json');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Authorization')).toBe('Bearer token-123');
  });

  it('supports 204 responses without parsing JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);

    const { apiDelete } = await loadClient('https://api.example.test');

    await expect(apiDelete<void>('/sessions/current')).resolves.toBeUndefined();
  });

  it('throws when the api base url is missing', async () => {
    const { apiGet } = await loadClient();

    await expect(apiGet('/badges')).rejects.toThrow('NEXT_PUBLIC_URL_BASE is not configured');
  });

  it('throws when the response is not ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 }));
    vi.stubGlobal('fetch', fetchMock);

    const { apiGet } = await loadClient(undefined, 'https://fallback-api.example.test');

    await expect(apiGet('/badges')).rejects.toThrow('API request failed: 403');
  });
});
