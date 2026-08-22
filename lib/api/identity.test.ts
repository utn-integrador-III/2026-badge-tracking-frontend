import { describe, expect, it, vi } from 'vitest';
import { apiEndpoints } from './endpoints';
import { apiDelete, apiGet, apiPatch, apiPost } from './http-client';
import { identityApi } from './identity';

vi.mock('./http-client', () => ({
  apiGet: vi.fn().mockResolvedValue({ ok: true }),
  apiPost: vi.fn().mockResolvedValue({ ok: true }),
  apiPatch: vi.fn().mockResolvedValue({ ok: true }),
  apiDelete: vi.fn().mockResolvedValue(undefined)
}));

describe('identityApi', () => {
  it('creates a user', async () => {
    const payload = { institutional_id: '2024-0001', full_name: 'Juan', email: 'j@utn.ac.cr', role: 'student' as const, department: 'ISI', birthdate: '2000-01-01' };
    await identityApi.createUser(payload, 'tok');
    expect(apiPost).toHaveBeenCalledWith(apiEndpoints.users.root, payload, { accessToken: 'tok' });
  });

  it('gets a user by id', async () => {
    await identityApi.getUser('u1', 'tok');
    expect(apiGet).toHaveBeenCalledWith(apiEndpoints.users.byId('u1'), { accessToken: 'tok' });
  });

  it('updates a user', async () => {
    await identityApi.updateUser('u1', { full_name: 'New Name' }, 'tok');
    expect(apiPatch).toHaveBeenCalledWith(apiEndpoints.users.byId('u1'), { full_name: 'New Name' }, { accessToken: 'tok' });
  });

  it('deletes a user', async () => {
    await identityApi.deleteUser('u1', 'tok');
    expect(apiDelete).toHaveBeenCalledWith(apiEndpoints.users.byId('u1'), undefined, { accessToken: 'tok' });
  });

  it('lists users with a query', async () => {
    await identityApi.listUsers({ role: 'student' }, 'tok');
    expect(apiGet).toHaveBeenCalledWith(`${apiEndpoints.users.root}?role=student`, { accessToken: 'tok' });
  });

  it('bulk imports users as multipart form data', async () => {
    const file = new File(['a,b,c'], 'users.csv', { type: 'text/csv' });
    await identityApi.bulkImportUsers(file, 'tok');
    expect(apiPost).toHaveBeenCalledWith(apiEndpoints.users.bulkImport, expect.any(FormData), { accessToken: 'tok' });
    const formData = (apiPost as unknown as ReturnType<typeof vi.fn>).mock.calls.at(-1)?.[1] as FormData;
    expect(formData.get('file')).toBe(file);
  });

  it('gets a bulk import job', async () => {
    await identityApi.getBulkImportJob('job-1', 'tok');
    expect(apiGet).toHaveBeenCalledWith(apiEndpoints.users.bulkImportJob('job-1'), { accessToken: 'tok' });
  });

  it('uploads a user photo as multipart form data', async () => {
    const photo = new File(['binary'], 'photo.png', { type: 'image/png' });
    await identityApi.uploadUserPhoto('u1', photo, 'tok');
    expect(apiPost).toHaveBeenCalledWith(apiEndpoints.users.photo('u1'), expect.any(FormData), { accessToken: 'tok' });
  });

  it('issues a badge', async () => {
    const payload = { user_id: 'u1', role: 'student' as const, expires_at: '2026-12-31' };
    await identityApi.issueBadge(payload, 'tok');
    expect(apiPost).toHaveBeenCalledWith(apiEndpoints.badges.root, payload, { accessToken: 'tok' });
  });

  it('gets a badge by id', async () => {
    await identityApi.getBadge('b1', 'tok');
    expect(apiGet).toHaveBeenCalledWith(apiEndpoints.badges.byId('b1'), { accessToken: 'tok' });
  });

  it('lists a user badges', async () => {
    await identityApi.listUserBadges('u1', { status: 'active' }, 'tok');
    expect(apiGet).toHaveBeenCalledWith(apiEndpoints.users.badges('u1', { status: 'active' }), { accessToken: 'tok' });
  });

  it('revokes a badge', async () => {
    await identityApi.revokeBadge('b1', { reason: 'lost' }, 'tok');
    expect(apiDelete).toHaveBeenCalledWith(apiEndpoints.badges.byId('b1'), { reason: 'lost' }, { accessToken: 'tok' });
  });

  it('renews a badge', async () => {
    await identityApi.renewBadge('b1', { expires_at: '2027-12-31' }, 'tok');
    expect(apiPost).toHaveBeenCalledWith(apiEndpoints.badges.renew('b1'), { expires_at: '2027-12-31' }, { accessToken: 'tok' });
  });

  it('gets a badge QR with selected attributes', async () => {
    await identityApi.getBadgeQr('b1', ['name'], 'tok');
    expect(apiGet).toHaveBeenCalledWith(apiEndpoints.badges.qr('b1', ['name']), { accessToken: 'tok' });
  });

  it('lists expiring badges', async () => {
    await identityApi.listExpiringBadges({ days: 30 }, 'tok');
    expect(apiGet).toHaveBeenCalledWith(apiEndpoints.badges.expiringSoon({ days: 30 }), { accessToken: 'tok' });
  });

  it('gets a user history', async () => {
    await identityApi.getUserHistory('u1', { type: 'shared' }, 'tok');
    expect(apiGet).toHaveBeenCalledWith(apiEndpoints.users.history('u1', { type: 'shared' }), { accessToken: 'tok' });
  });
});
