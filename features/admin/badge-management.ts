export type AdminBadgeHolder = {
  accountStatus: 'active' | 'inactive';
  badgeId: string;
  badgeStatus: 'active' | 'suspended' | 'revoked' | 'expired';
  department: string;
  email: string;
  fullName: string;
  institutionalId: string;
  revocationReason?: string;
  revokedAt?: string;
  role: 'Student' | 'Professor' | 'Staff';
  userId: string;
};

export const initialBadgeHolders: AdminBadgeHolder[] = [
  {
    accountStatus: 'active',
    badgeId: 'badge_demo_001',
    badgeStatus: 'active',
    department: 'Ingeniería en Sistemas de Información',
    email: 'jrodriguez@utn.ac.cr',
    fullName: 'Juan Carlos Rodríguez Vargas',
    institutionalId: '2024-0001',
    role: 'Student',
    userId: 'user_demo_001'
  },
  {
    accountStatus: 'active',
    badgeId: 'badge_demo_002',
    badgeStatus: 'active',
    department: 'Administración de Empresas',
    email: 'avargas@utn.ac.cr',
    fullName: 'Ana María Vargas Solano',
    institutionalId: '2023-0142',
    role: 'Professor',
    userId: 'user_demo_002'
  },
  {
    accountStatus: 'active',
    badgeId: 'badge_demo_003',
    badgeStatus: 'suspended',
    department: 'Registro Universitario',
    email: 'mjimenez@utn.ac.cr',
    fullName: 'María Jiménez Rojas',
    institutionalId: '2022-0088',
    role: 'Staff',
    userId: 'user_demo_003'
  }
];

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
}

export function searchBadgeHolders(holders: AdminBadgeHolder[], query: string) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return holders;

  return holders.filter((holder) =>
    [holder.fullName, holder.institutionalId, holder.email].some((value) => normalize(value).includes(normalizedQuery))
  );
}

export function revokeBadgeHolder(holders: AdminBadgeHolder[], badgeId: string, reason: string, revokedAt = new Date().toISOString()) {
  const normalizedReason = reason.trim();
  if (!normalizedReason) throw new Error('A revocation reason is required.');
  if (!holders.some((holder) => holder.badgeId === badgeId)) throw new Error('Badge holder was not found.');

  return holders.map((holder) =>
    holder.badgeId === badgeId
      ? {
          ...holder,
          accountStatus: 'inactive' as const,
          badgeStatus: 'revoked' as const,
          revocationReason: normalizedReason,
          revokedAt
        }
      : holder
  );
}
