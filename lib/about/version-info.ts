import packageJson from '../../package.json';

export type VersionInfo = {
  appName: string;
  version: string;
};

export type TeamMember = {
  email: string;
  name: string;
};

export const versionInfo: VersionInfo = {
  appName: 'Digital Badge',
  version: packageJson.version
};

export const teamMembers: TeamMember[] = [
  { name: 'Michael Carranza Porras', email: 'micarranzapo@est.utn.ac.cr' },
  { name: 'Frank Mora Sanchez', email: 'frmorasa@est.utn.ac.cr' },
  { name: 'Kevin Picado Arias', email: 'kepicadoar@est.utn.ac.cr' },
  { name: 'Kevin Nuñez Parra', email: 'kenunezpa@est.utn.ac.cr' }
];

export function formatVersionLabel(info: VersionInfo = versionInfo) {
  return `${info.appName} v${info.version}`;
}

export function getSupportItems() {
  return [
    'Credencial digital institucional',
    'Verificacion mediante QR',
    'Proteccion con PIN y firma criptografica',
    'Soporte PWA para uso movil'
  ];
}
