import { describe, expect, it } from 'vitest';
import { GET } from './route';

describe('GET /api/health', () => {
  it('returns an ok payload identifying the service', async () => {
    const response = GET();

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.service).toBe('digital-badge-pwa');
    expect(typeof body.timestamp).toBe('string');
    expect(Number.isNaN(new Date(body.timestamp).getTime())).toBe(false);
  });
});
