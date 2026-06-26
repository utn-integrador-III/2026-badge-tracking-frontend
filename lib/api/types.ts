export type ApiRole = 'student' | 'professor' | 'staff';

export type PaginatedQuery = {
  page?: number;
  limit?: number;
};

export type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
};

export type UserPayload = {
  institutional_id: string;
  full_name: string;
  email: string;
  role: ApiRole;
  department: string;
  birthdate: string;
};

export type UserPatchPayload = Partial<Pick<UserPayload, 'full_name' | 'email' | 'department'>>;

export type BadgePayload = {
  user_id: string;
  role: ApiRole;
  expires_at: string;
};

export type RevokeBadgePayload = {
  reason: string;
};

export type RenewBadgePayload = {
  expires_at: string;
};

export type CredentialVerificationPayload = {
  token?: string;
  credential?: {
    id: string;
    signature: string;
  };
};
