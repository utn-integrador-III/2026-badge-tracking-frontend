import type { DigitalBadge } from '@/types/badge';

export const mockBadge: DigitalBadge = {
  id: 'badge_demo_001',
  role: 'Student',
  holder: {
    fullName: 'Juan Carlos Rodríguez Vargas',
    initials: 'JR',
    photoUrl: '/profile-placeholder.svg',
    institutionalId: '2024-0001',
    department: 'Ingeniería en Sistemas de Información'
  },
  institution: {
    name: 'Universidad Técnica Nacional'
  },
  issuedAt: '2026-01-15',
  validUntil: '2026-12-31',
  issuer: 'Registro Universitario UTN',
  status: 'active',
  signaturePreview: 'EC-P256:8f4c...19a2'
};
