import type { BadgeRole, DigitalBadge } from '@/types/badge';

export type BadgeIssueInput = {
  department: string;
  email: string;
  fullName: string;
  institutionalId: string;
  role: BadgeRole;
  validUntil: string;
};

const rolePrefixes: Record<BadgeRole, string> = {
  Student: 'STU',
  Professor: 'PRO',
  Staff: 'STA'
};

function normalizeRequired(value: string, fieldName: string) {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${fieldName} is required.`);
  return normalized;
}

function getInitials(fullName: string) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function issueBadgeToUser(input: BadgeIssueInput, issuedAt = new Date().toISOString().slice(0, 10)): DigitalBadge {
  const fullName = normalizeRequired(input.fullName, 'Full name');
  const institutionalId = normalizeRequired(input.institutionalId, 'Institutional ID');
  const department = normalizeRequired(input.department, 'Department');
  const validUntil = normalizeRequired(input.validUntil, 'Valid until');

  if (!input.email.includes('@')) throw new Error('A valid institutional email is required.');

  return {
    id: `badge_${rolePrefixes[input.role].toLowerCase()}_${institutionalId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`,
    role: input.role,
    holder: {
      fullName,
      initials: getInitials(fullName),
      photoUrl: '/profile-placeholder.svg',
      institutionalId,
      department
    },
    institution: {
      name: 'Universidad Técnica Nacional',
      logoUrl: '/brand/logo.png'
    },
    issuedAt,
    validUntil,
    issuer: 'Registro Universitario UTN',
    status: 'active',
    signaturePreview: `${rolePrefixes[input.role]}-${institutionalId}-pending-signature`
  };
}
