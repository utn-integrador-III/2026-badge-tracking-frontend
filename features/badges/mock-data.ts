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

export const mockBadgeTypes: DigitalBadge[] = [
  mockBadge,
  {
    ...mockBadge,
    id: 'badge_demo_professor_001',
    role: 'Professor',
    holder: {
      ...mockBadge.holder,
      fullName: 'Ana María Vargas Solano',
      initials: 'AV',
      institutionalId: 'PRO-2026-0142',
      department: 'Administración de Empresas'
    }
  },
  {
    ...mockBadge,
    id: 'badge_demo_staff_001',
    role: 'Staff',
    holder: {
      ...mockBadge.holder,
      fullName: 'María Jiménez Rojas',
      initials: 'MJ',
      institutionalId: 'STA-2026-0088',
      department: 'Registro Universitario'
    }
  }
];
