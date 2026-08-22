import { describe, expect, it, vi } from 'vitest';
import { apiEndpoints } from './endpoints';
import { apiPost } from './http-client';
import { authApi } from './auth';

vi.mock('./http-client', () => ({
  apiPost: vi.fn().mockResolvedValue({ ok: true })
}));

describe('authApi', () => {
  it('logs in with institutional id and pin', async () => {
    await authApi.login({ institutional_id: '2024-0001', pin: '123456' });
    expect(apiPost).toHaveBeenCalledWith(apiEndpoints.auth.login, { institutional_id: '2024-0001', pin: '123456' });
  });

  it('refreshes a session', async () => {
    await authApi.refresh({ refresh_token: 'r1' });
    expect(apiPost).toHaveBeenCalledWith(apiEndpoints.auth.refresh, { refresh_token: 'r1' });
  });

  it('logs out', async () => {
    await authApi.logout({ refresh_token: 'r1' });
    expect(apiPost).toHaveBeenCalledWith(apiEndpoints.auth.logout, { refresh_token: 'r1' });
  });

  it('changes the pin with an access token', async () => {
    await authApi.changePin({ current_pin: '111111', new_pin: '222222' }, 'token-abc');
    expect(apiPost).toHaveBeenCalledWith(
      apiEndpoints.auth.changePin,
      { current_pin: '111111', new_pin: '222222' },
      { accessToken: 'token-abc' }
    );
  });
});
