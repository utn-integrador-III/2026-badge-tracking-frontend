import { apiEndpoints, buildQuery } from '@/lib/api/endpoints';
import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api/http-client';
import type { BadgePayload, PaginatedQuery, RenewBadgePayload, RevokeBadgePayload, UserPatchPayload, UserPayload } from '@/lib/api/types';

type ListUsersQuery = PaginatedQuery & {
  role?: string;
  dept?: string;
  status?: string;
};

type ListBadgesQuery = PaginatedQuery & {
  status?: 'active' | 'revoked' | 'expired';
};

type HistoryQuery = PaginatedQuery & {
  type?: 'shared' | 'verified' | 'revoked';
  from?: string;
  to?: string;
};

export const identityApi = {
  createUser: (payload: UserPayload, accessToken?: string) => apiPost(apiEndpoints.users.root, payload, { accessToken }),
  getUser: <T>(id: string, accessToken?: string) => apiGet<T>(apiEndpoints.users.byId(id), { accessToken }),
  updateUser: (id: string, payload: UserPatchPayload, accessToken?: string) => apiPatch(apiEndpoints.users.byId(id), payload, { accessToken }),
  deleteUser: (id: string, accessToken?: string) => apiDelete<void>(apiEndpoints.users.byId(id), undefined, { accessToken }),
  listUsers: <T>(query?: ListUsersQuery, accessToken?: string) => apiGet<T>(`${apiEndpoints.users.root}${buildQuery(query)}`, { accessToken }),
  bulkImportUsers: <T>(file: File, accessToken?: string) => {
    const body = new FormData();
    body.set('file', file);
    return apiPost<T>(apiEndpoints.users.bulkImport, body, { accessToken });
  },
  getBulkImportJob: <T>(jobId: string, accessToken?: string) => apiGet<T>(apiEndpoints.users.bulkImportJob(jobId), { accessToken }),
  uploadUserPhoto: <T>(id: string, photo: File, accessToken?: string) => {
    const body = new FormData();
    body.set('photo', photo);
    return apiPost<T>(apiEndpoints.users.photo(id), body, { accessToken });
  },
  issueBadge: <T>(payload: BadgePayload, accessToken?: string) => apiPost<T>(apiEndpoints.badges.root, payload, { accessToken }),
  getBadge: <T>(id: string, accessToken?: string) => apiGet<T>(apiEndpoints.badges.byId(id), { accessToken }),
  listUserBadges: <T>(userId: string, query?: ListBadgesQuery, accessToken?: string) => apiGet<T>(apiEndpoints.users.badges(userId, query), { accessToken }),
  revokeBadge: (id: string, payload: RevokeBadgePayload, accessToken?: string) => apiDelete<void>(apiEndpoints.badges.byId(id), payload, { accessToken }),
  renewBadge: <T>(id: string, payload: RenewBadgePayload, accessToken?: string) => apiPost<T>(apiEndpoints.badges.renew(id), payload, { accessToken }),
  getBadgeQr: <T>(id: string, attrs?: string[], accessToken?: string) => apiGet<T>(apiEndpoints.badges.qr(id, attrs), { accessToken }),
  listExpiringBadges: <T>(query?: PaginatedQuery & { days?: number }, accessToken?: string) => apiGet<T>(apiEndpoints.badges.expiringSoon(query), { accessToken }),
  getUserHistory: <T>(userId: string, query?: HistoryQuery, accessToken?: string) => apiGet<T>(apiEndpoints.users.history(userId, query), { accessToken })
};
