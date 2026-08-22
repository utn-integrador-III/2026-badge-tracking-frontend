import { describe, expect, it } from 'vitest';
import { mockBadge } from '../badges/mock-data';
import { getBadgeBranding, getInstitutionBranding } from './institution-branding';

describe('institution branding', () => {
  it('returns configured branding for the badge institution', () => {
    expect(getBadgeBranding(mockBadge)).toMatchObject({
      logoUrl: '/brand/logo.png',
      primaryColor: '#20398b'
    });
  });

  it('falls back to default branding for unknown institutions', () => {
    expect(getInstitutionBranding('Unknown Institution')).toMatchObject({
      logoUrl: '/brand/logo.png',
      textColor: '#ffffff'
    });
  });
});
