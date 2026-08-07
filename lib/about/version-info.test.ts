import { describe, expect, it } from 'vitest';
import { formatVersionLabel, getSupportItems, versionInfo } from './version-info';

describe('version info', () => {
  it('exposes application version metadata', () => {
    expect(versionInfo).toMatchObject({
      appName: 'Digital Badge',
      buildChannel: 'development',
      release: 'Release 1'
    });
    expect(versionInfo.version).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('formats the version label and support items', () => {
    expect(formatVersionLabel()).toContain('Digital Badge v');
    expect(getSupportItems()).toContain('Verificación mediante QR');
  });
});
