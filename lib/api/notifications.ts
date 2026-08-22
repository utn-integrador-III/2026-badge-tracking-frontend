import { apiEndpoints } from '@/lib/api/endpoints';
import { apiPost } from '@/lib/api/http-client';

export const notificationsApi = {
  fetchPending: <T>(institutionalId: string, pin: string) =>
    apiPost<T>(apiEndpoints.users.notifications(institutionalId), { pin }),
  requestRenewal: <T>(institutionalId: string, pin: string) =>
    apiPost<T>(apiEndpoints.users.renewals(institutionalId), { pin })
};
