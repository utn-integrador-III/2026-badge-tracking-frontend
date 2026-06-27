import { describe, expect, it } from 'vitest';
import { DEMO_VERIFICATION_CODE, findInstitutionalUser, maskEmail } from './mock-users';

describe('mock onboarding users', () => {
  it('finds a known institutional user by national id', () => {
    const user = findInstitutionalUser('123456789');

    expect(user).toMatchObject({
      nationalId: '123456789',
      studentId: '2024-0001',
      firstName: 'Juan',
      role: 'Estudiante'
    });
  });

  it('returns null for an unknown national id', () => {
    expect(findInstitutionalUser('000000000')).toBeNull();
  });

  it('exposes the demo verification code used by the activation flow', () => {
    expect(DEMO_VERIFICATION_CODE).toBe('123456');
  });

  it('masks email names while preserving the domain', () => {
    expect(maskEmail('jrodriguez@utn.ac.cr')).toBe('jr********@utn.ac.cr');
    expect(maskEmail('ab@utn.ac.cr')).toBe('ab***@utn.ac.cr');
  });
});
