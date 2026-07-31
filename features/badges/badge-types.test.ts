import { describe, expect, it } from 'vitest';
import { badgeTypeConfig, getBadgeTypeConfig } from './badge-types';

describe('badge type configuration', () => {
  it('supports all release badge holder roles', () => {
    expect(Object.keys(badgeTypeConfig).sort()).toEqual(['Professor', 'Staff', 'Student']);
  });

  it('returns role-specific labels and short codes', () => {
    expect(getBadgeTypeConfig('Student')).toMatchObject({ label: 'Estudiante', shortCode: 'STU' });
    expect(getBadgeTypeConfig('Professor')).toMatchObject({ label: 'Profesor', shortCode: 'PRO' });
    expect(getBadgeTypeConfig('Staff')).toMatchObject({ label: 'Personal administrativo', shortCode: 'STA' });
  });
});
