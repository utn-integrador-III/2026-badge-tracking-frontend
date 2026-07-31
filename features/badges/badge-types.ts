import type { BadgeRole } from '@/types/badge';

export type BadgeTypeConfig = {
  accentClassName: string;
  label: string;
  shortCode: string;
};

export const badgeTypeConfig: Record<BadgeRole, BadgeTypeConfig> = {
  Student: {
    accentClassName: 'from-[#2949aa] to-[#142b75]',
    label: 'Estudiante',
    shortCode: 'STU'
  },
  Professor: {
    accentClassName: 'from-[#6d3fc5] to-[#2f1d72]',
    label: 'Profesor',
    shortCode: 'PRO'
  },
  Staff: {
    accentClassName: 'from-[#0f766e] to-[#134e4a]',
    label: 'Personal administrativo',
    shortCode: 'STA'
  }
};

export function getBadgeTypeConfig(role: BadgeRole) {
  return badgeTypeConfig[role];
}
