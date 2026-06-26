import { apiEndpoints } from '@/lib/api/endpoints';
import { apiPost } from '@/lib/api/http-client';
import type { AuthSession } from '@/lib/api/types';

export const authApi = {
  login: (payload: { institutional_id: string; pin: string }) => apiPost<AuthSession>(apiEndpoints.auth.login, payload),
  refresh: (payload: { refresh_token: string }) => apiPost<AuthSession>(apiEndpoints.auth.refresh, payload),
  logout: (payload: { refresh_token: string }) => apiPost<void>(apiEndpoints.auth.logout, payload),
  changePin: (payload: { current_pin: string; new_pin: string }, accessToken?: string) =>
    apiPost<void>(apiEndpoints.auth.changePin, payload, { accessToken })
};
