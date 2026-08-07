import packageJson from '../../package.json';

export type VersionInfo = {
  appName: string;
  buildChannel: 'development' | 'qa' | 'production';
  release: string;
  repository: string;
  version: string;
};

export const versionInfo: VersionInfo = {
  appName: 'Digital Badge',
  buildChannel: 'development',
  release: 'Release 1',
  repository: 'utn-integrador-III/2026-badge-tracking-frontend',
  version: packageJson.version
};

export function formatVersionLabel(info: VersionInfo = versionInfo) {
  return `${info.appName} v${info.version} · ${info.release}`;
}

export function getSupportItems() {
  return [
    'Credencial digital institucional',
    'Verificación mediante QR',
    'Protección con PIN y firma criptográfica',
    'Soporte PWA para uso móvil'
  ];
}
