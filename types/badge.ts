export type BadgeRole = 'Student' | 'Professor' | 'Staff';

export type DigitalBadge = {
  id: string;
  role: BadgeRole;
  holder: {
    fullName: string;
    initials: string;
    photoUrl: string;
    institutionalId: string;
    department: string;
  };
  extendedIdentity?: {
    campus: string;
    currentPeriod: string;
    email: string;
    program: string;
    standing: string;
    nationality?: string;
    birthplace?: string;
    documentExpiry?: string;
    digitalSignatureUrl?: string;
  };
  institution: {
    name: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
  };
  issuedAt: string;
  validUntil: string;
  issuer: string;
  status: 'active' | 'suspended' | 'revoked' | 'expired';
  signaturePreview: string;
};
