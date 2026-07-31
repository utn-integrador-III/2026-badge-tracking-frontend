import { describe, expect, it } from 'vitest';
import { issueBadgeToUser } from './badge-issuance';

describe('issueBadgeToUser', () => {
  it('issues an active badge linked to the institutional identity', () => {
    const badge = issueBadgeToUser(
      {
        department: 'Registro Universitario',
        email: 'mjimenez@utn.ac.cr',
        fullName: 'María Jiménez Rojas',
        institutionalId: '2026-0100',
        role: 'Staff',
        validUntil: '2026-12-31'
      },
      '2026-07-17'
    );

    expect(badge.status).toBe('active');
    expect(badge.holder.fullName).toBe('María Jiménez Rojas');
    expect(badge.holder.institutionalId).toBe('2026-0100');
    expect(badge.role).toBe('Staff');
    expect(badge.issuedAt).toBe('2026-07-17');
  });

  it('rejects incomplete issue requests', () => {
    expect(() =>
      issueBadgeToUser({
        department: '',
        email: 'invalid',
        fullName: '',
        institutionalId: '',
        role: 'Student',
        validUntil: ''
      })
    ).toThrow('Full name is required.');
  });
});
