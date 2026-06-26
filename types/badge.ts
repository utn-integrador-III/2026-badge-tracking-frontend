export type BadgeRole = 'Student' | 'Professor' | 'Staff';

export type DigitalBadge = {
  id: string;
  role: BadgeRole;
  holder: {
    fullName: string;
    initials: string;
    institutionalId: string;
    department: string;
  };
  institution: {
    name: string;
    logoUrl?: string;
  };
  issuedAt: string;
  validUntil: string;
  issuer: string;
  status: 'active' | 'suspended' | 'revoked' | 'expired';
  signaturePreview: string;
};
