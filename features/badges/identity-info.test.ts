import { describe, expect, it } from 'vitest';
import { getExtendedIdentityInfo } from './identity-info';
import { mockBadge } from './mock-data';

describe('getExtendedIdentityInfo', () => {
  it('returns extended identity rows for a badge holder', () => {
    const rows = getExtendedIdentityInfo(mockBadge);

    expect(rows).toEqual(
      expect.arrayContaining([
        { label: 'Sede', value: 'Sede Central - Pedregal' },
        { label: 'Correo institucional', value: 'jrodriguez@utn.ac.cr' },
        { label: 'Condición', value: 'Matrícula activa' }
      ])
    );
  });

  it('returns no rows when extended identity is missing', () => {
    expect(getExtendedIdentityInfo({ ...mockBadge, extendedIdentity: undefined })).toEqual([]);
  });
});
