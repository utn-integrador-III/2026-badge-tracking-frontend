import { describe, expect, it } from 'vitest';
import { apiEndpoints, buildQuery } from './endpoints';

describe('buildQuery', () => {
  it('returns an empty string when no params are provided', () => {
    expect(buildQuery()).toBe('');
  });

  it('omits undefined, null and empty string values', () => {
    expect(buildQuery({ page: undefined, limit: null, q: '' })).toBe('');
  });

  it('serializes provided values into a query string', () => {
    expect(buildQuery({ page: 2, limit: 10, active: true })).toBe('?page=2&limit=10&active=true');
  });
});

describe('apiEndpoints', () => {
  it('builds static auth paths', () => {
    expect(apiEndpoints.auth.login).toBe('/api/v1/auth/login');
    expect(apiEndpoints.auth.changePin).toBe('/api/v1/auth/change-pin');
  });

  it('builds dynamic user paths', () => {
    expect(apiEndpoints.users.byId('u1')).toBe('/api/v1/users/u1');
    expect(apiEndpoints.users.badges('u1', { status: 'active' })).toBe('/api/v1/users/u1/badges?status=active');
    expect(apiEndpoints.users.history('u1')).toBe('/api/v1/users/u1/history');
  });

  it('builds dynamic badge paths', () => {
    expect(apiEndpoints.badges.byId('b1')).toBe('/api/v1/badges/b1');
    expect(apiEndpoints.badges.renew('b1')).toBe('/api/v1/badges/b1/renew');
    expect(apiEndpoints.badges.qr('b1', ['name', 'role'])).toBe('/api/v1/badges/b1/qr?attrs=name%2Crole');
    expect(apiEndpoints.badges.qr('b1')).toBe('/api/v1/badges/b1/qr');
    expect(apiEndpoints.badges.expiringSoon({ days: 30 })).toBe('/api/v1/badges/expiring-soon?days=30');
  });

  it('builds the notifications list path', () => {
    expect(apiEndpoints.notifications.list({ type: 'expiry' })).toBe('/api/v1/notifications?type=expiry');
    expect(apiEndpoints.notifications.list()).toBe('/api/v1/notifications');
  });
});
