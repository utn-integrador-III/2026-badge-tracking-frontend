import { describe, expect, it } from 'vitest';
import { createSelectiveProof, getIncludedFieldLabels } from './selective-disclosure';
import type { BadgeShareProof } from './create-share-token';

const proof: BadgeShareProof = {
  badgeId: 'badge_demo_001',
  fullName: 'Juan Carlos Rodríguez Vargas',
  institutionalId: '2024-0001',
  institutionName: 'Universidad Técnica Nacional',
  role: 'Student',
  status: 'active',
  validUntil: '2026-12-31'
};

describe('selective disclosure', () => {
  it('includes required fields and selected user fields only', () => {
    expect(createSelectiveProof(proof, ['fullName', 'status'])).toEqual({
      badgeId: 'badge_demo_001',
      fullName: 'Juan Carlos Rodríguez Vargas',
      status: 'active'
    });
  });

  it('returns human-readable included field labels', () => {
    expect(getIncludedFieldLabels(['fullName', 'role'])).toEqual(['ID de credencial', 'Nombre completo', 'Rol']);
  });
});
