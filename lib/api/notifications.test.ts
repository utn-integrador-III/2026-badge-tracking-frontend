import { describe, expect, it, vi } from 'vitest';
import { apiEndpoints } from './endpoints';
import { apiGet, apiPost } from './http-client';
import { notificationsApi } from './notifications';

vi.mock('./http-client', () => ({
  apiGet: vi.fn().mockResolvedValue({ ok: true }),
  apiPost: vi.fn().mockResolvedValue({ ok: true })
}));

describe('notificationsApi', () => {
  it('sends an expiry reminder', async () => {
    await notificationsApi.sendExpiryReminder({ user_id: 'u1', badge_id: 'b1', days_until_expiry: 5 }, 'tok');
    expect(apiPost).toHaveBeenCalledWith(
      apiEndpoints.notifications.expiry,
      { user_id: 'u1', badge_id: 'b1', days_until_expiry: 5 },
      { accessToken: 'tok' }
    );
  });

  it('sends a revocation alert', async () => {
    await notificationsApi.sendRevocationAlert({ user_id: 'u1', badge_id: 'b1', reason: 'lost' }, 'tok');
    expect(apiPost).toHaveBeenCalledWith(
      apiEndpoints.notifications.revocation,
      { user_id: 'u1', badge_id: 'b1', reason: 'lost' },
      { accessToken: 'tok' }
    );
  });

  it('sends a welcome notification', async () => {
    await notificationsApi.sendWelcomeNotification({ user_id: 'u1', channel: 'email' }, 'tok');
    expect(apiPost).toHaveBeenCalledWith(
      apiEndpoints.notifications.welcome,
      { user_id: 'u1', channel: 'email' },
      { accessToken: 'tok' }
    );
  });

  it('registers a device token', async () => {
    await notificationsApi.registerDeviceToken({ token: 'device-1', platform: 'android' }, 'tok');
    expect(apiPost).toHaveBeenCalledWith(
      apiEndpoints.notifications.deviceToken,
      { token: 'device-1', platform: 'android' },
      { accessToken: 'tok' }
    );
  });

  it('lists notifications with a query', async () => {
    await notificationsApi.listNotifications({ user_id: 'u1', type: 'expiry' }, 'tok');
    expect(apiGet).toHaveBeenCalledWith(apiEndpoints.notifications.list({ user_id: 'u1', type: 'expiry' }), { accessToken: 'tok' });
  });
});
