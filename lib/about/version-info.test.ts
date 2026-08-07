import { describe, expect, it } from 'vitest';
import { formatVersionLabel, getSupportItems, teamMembers, versionInfo } from './version-info';

describe('version info', () => {
  it('exposes application version metadata', () => {
    expect(versionInfo.appName).toBe('Digital Badge');
    expect(versionInfo.version).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('formats the version label, support items, and team members', () => {
    expect(formatVersionLabel()).toContain('Digital Badge v');
    expect(getSupportItems()).toContain('Verificacion mediante QR');
    expect(teamMembers).toContainEqual({ name: 'Michael Carranza Porras', email: 'micarranzapo@est.utn.ac.cr' });
  });
});
