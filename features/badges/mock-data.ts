import type { DigitalBadge } from '@/types/badge';

export const mockBadge: DigitalBadge = {
  id: 'badge_demo_001',
  role: 'Student',
  holder: {
    fullName: 'Alex Rivera',
    initials: 'AR',
    institutionalId: 'A01234567',
    department: 'Computer Science'
  },
  institution: {
    name: 'Demo University'
  },
  issuedAt: '2026-07-01',
  validUntil: '2027-07-01',
  issuer: 'Registrar Office',
  status: 'active',
  signaturePreview: 'EC-P256:8f4c...19a2'
};
