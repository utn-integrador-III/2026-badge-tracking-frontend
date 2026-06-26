import { apiEndpoints } from '@/lib/api/endpoints';
import { apiGet, apiPost } from '@/lib/api/http-client';
import type { PaginatedQuery } from '@/lib/api/types';

type NotificationListQuery = PaginatedQuery & {
  user_id?: string;
  type?: 'expiry' | 'revocation' | 'welcome';
  status?: string;
};

export const notificationsApi = {
  sendExpiryReminder: (payload: { user_id: string; badge_id: string; days_until_expiry: number }, accessToken?: string) =>
    apiPost<void>(apiEndpoints.notifications.expiry, payload, { accessToken }),
  sendRevocationAlert: (payload: { user_id: string; badge_id: string; reason: string }, accessToken?: string) =>
    apiPost<void>(apiEndpoints.notifications.revocation, payload, { accessToken }),
  sendWelcomeNotification: (payload: { user_id: string; channel: 'email' | 'push' }, accessToken?: string) =>
    apiPost<void>(apiEndpoints.notifications.welcome, payload, { accessToken }),
  registerDeviceToken: (payload: { token: string; platform: 'android' | 'ios' }, accessToken?: string) =>
    apiPost<void>(apiEndpoints.notifications.deviceToken, payload, { accessToken }),
  listNotifications: <T>(query?: NotificationListQuery, accessToken?: string) => apiGet<T>(apiEndpoints.notifications.list(query), { accessToken })
};
