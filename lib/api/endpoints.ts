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
  users: {
    register: '/users/institutional-identities',
    profile: (institutionalId: string) => `/users/${institutionalId}/badge-profile`,
    profileDetails: (institutionalId: string) => `/users/${institutionalId}/badge-profile/details`,
    pin: (institutionalId: string) => `/users/${institutionalId}/pin`,
    validatePin: (institutionalId: string) => `/users/${institutionalId}/pin/validate`,
    verificationQr: (institutionalId: string) => `/users/${institutionalId}/verification-qr`,
    ageProofQr: (institutionalId: string) => `/users/${institutionalId}/age-proof-qr`,
    deliveries: (institutionalId: string) => `/users/${institutionalId}/badge-deliveries/fetch`,
    notifications: (institutionalId: string) => `/users/${institutionalId}/badge-notifications/fetch`,
    renewals: (institutionalId: string) => `/users/${institutionalId}/badge-renewals`
  },
  badges: {
    root: '/badges',
    search: '/badges/search',
    status: (badgeId: number | string) => `/badges/${badgeId}/status`
  },
  verification: {
    badge: '/verifications/badge',
    badgeToken: (token: string) => `/verifications/badge/${token}`,
    countdown: '/verifications/countdown',
    countdownToken: (token: string) => `/verifications/countdown/${token}`,
    ageProof: (token: string) => `/verifications/age-proof/${token}`
  },
  institutions: {
    branding: '/institutions/branding',
    logo: (logoAssetId: string) => `/institutions/branding/logos/${logoAssetId}`
  }
} as const;
