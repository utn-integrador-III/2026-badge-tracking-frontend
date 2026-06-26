type QueryValue = string | number | boolean | null | undefined;

export function buildQuery(params?: Record<string, QueryValue>) {
  if (!params) return '';

  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `?${query}` : '';
}

export const apiEndpoints = {
  auth: {
    login: '/api/v1/auth/login',
    refresh: '/api/v1/auth/refresh',
    logout: '/api/v1/auth/logout',
    changePin: '/api/v1/auth/change-pin'
  },
  users: {
    root: '/api/v1/users',
    byId: (id: string) => `/api/v1/users/${id}`,
    bulkImport: '/api/v1/users/bulk-import',
    bulkImportJob: (jobId: string) => `/api/v1/users/bulk-import/${jobId}`,
    photo: (id: string) => `/api/v1/users/${id}/photo`,
    badges: (id: string, params?: Record<string, QueryValue>) => `/api/v1/users/${id}/badges${buildQuery(params)}`,
    history: (id: string, params?: Record<string, QueryValue>) => `/api/v1/users/${id}/history${buildQuery(params)}`
  },
  badges: {
    root: '/api/v1/badges',
    byId: (id: string) => `/api/v1/badges/${id}`,
    renew: (id: string) => `/api/v1/badges/${id}/renew`,
    qr: (id: string, attrs?: string[]) => `/api/v1/badges/${id}/qr${buildQuery({ attrs: attrs?.join(',') })}`,
    expiringSoon: (params?: Record<string, QueryValue>) => `/api/v1/badges/expiring-soon${buildQuery(params)}`
  },
  verification: {
    verify: '/api/v1/verify',
    qr: '/api/v1/verify/qr',
    nfc: '/api/v1/verify/nfc',
    jwks: '/api/v1/verify/.well-known/jwks.json',
    offlineBundle: '/api/v1/verify/offline-bundle'
  },
  notifications: {
    expiry: '/api/v1/notifications/expiry',
    revocation: '/api/v1/notifications/revocation',
    welcome: '/api/v1/notifications/welcome',
    deviceToken: '/api/v1/notifications/device-token',
    list: (params?: Record<string, QueryValue>) => `/api/v1/notifications${buildQuery(params)}`
  }
} as const;
