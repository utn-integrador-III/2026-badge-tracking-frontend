import { describe, expect, it } from 'vitest';
import { profileToDigitalBadge } from './api-mapper';
import type { BadgeProfileResponse, ExtendedBadgeProfileResponse } from '@/lib/api/types';

const profile: BadgeProfileResponse = {
  photoUrl: null,
  fullName: 'Persona QA',
  role: 'student',
  institutionalId: '123456789',
  badgeCode: 'BADGE-123456789-ABC',
  roleType: 'student',
  status: 'issued',
  validFrom: '2026-08-22T00:00:00+00:00',
  validUntil: '2027-08-22T00:00:00+00:00',
  branding: {
    institution: 'Universidad Técnica Nacional',
    primaryColor: '#20398B',
    secondaryColor: '#FFFFFF',
    contrastTextColor: '#FFFFFF',
    logoUrl: null,
    logoContentType: null,
    logoSizeInBytes: null,
    logoUpdatedAt: null,
    isCustomized: false,
    updatedAt: null
  }
};

describe('badge profile mapper', () => {
  it('maps an issued backend badge to an active frontend badge', () => {
    expect(profileToDigitalBadge(profile)).toMatchObject({
      id: 'BADGE-123456789-ABC',
      role: 'Student',
      status: 'active',
      holder: { fullName: 'Persona QA', institutionalId: '123456789' },
      institution: {
        primaryColor: '#20398B',
        secondaryColor: '#FFFFFF',
        textColor: '#FFFFFF'
      }
    });
  });

  it('routes backend branding assets through the same-origin proxy', () => {
    const branded = {
      ...profile,
      branding: {
        ...profile.branding,
        logoUrl: 'https://18.190.24.243/institutions/branding/logos/logo-123'
      }
    };

    expect(profileToDigitalBadge(branded).institution.logoUrl).toBe(
      '/api/backend/institutions/branding/logos/logo-123'
    );
  });

  it('includes extended identity fields returned by the backend', () => {
    const extended: ExtendedBadgeProfileResponse = {
      ...profile,
      issuedAt: '2026-08-22T00:00:00+00:00',
      issuingAuthority: 'Registro Universitario UTN',
      nationality: 'Costarricense',
      birthplace: 'Alajuela',
      documentExpiry: '2030-01-01',
      digitalSignatureUrl: 'https://example.edu/signature.png'
    };
    expect(profileToDigitalBadge(extended).extendedIdentity).toMatchObject({
      nationality: 'Costarricense',
      birthplace: 'Alajuela',
      documentExpiry: '2030-01-01'
    });
  });
});
