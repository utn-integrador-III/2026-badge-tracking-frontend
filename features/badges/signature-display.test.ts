import { describe, expect, it } from 'vitest';
import { getBadgeSignatureDisplay } from './signature-display';
import { mockBadge } from './mock-data';

describe('getBadgeSignatureDisplay', () => {
  it('formats the badge digital signature preview', () => {
    expect(getBadgeSignatureDisplay(mockBadge)).toEqual({
      algorithm: 'EC-P256',
      fingerprint: '8f4c...19a2',
      statusLabel: 'Firma vinculada a credencial activa'
    });
  });

  it('marks signatures from inactive credentials', () => {
    const display = getBadgeSignatureDisplay({ ...mockBadge, status: 'revoked' });

    expect(display.statusLabel).toBe('Firma asociada a credencial no activa');
  });
});
