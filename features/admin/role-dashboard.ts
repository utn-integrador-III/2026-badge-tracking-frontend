export type AdminRole = 'Registrar' | 'Security' | 'Viewer';

export type AdminDashboardAction = {
  description: string;
  key: string;
  title: string;
};

export const roleDashboardActions: Record<AdminRole, AdminDashboardAction[]> = {
  Registrar: [
    { key: 'issue', title: 'Emitir badges', description: 'Crear y vincular credenciales institucionales.' },
    { key: 'import', title: 'Importar usuarios', description: 'Cargar usuarios desde CSV/LDAP.' },
    { key: 'revoke', title: 'Revocar badges', description: 'Marcar credenciales como inactivas.' }
  ],
  Security: [
    { key: 'verify', title: 'Verificar accesos', description: 'Revisar verificaciones y accesos.' },
    { key: 'audit', title: 'Auditoria', description: 'Consultar eventos de seguridad.' }
  ],
  Viewer: [
    { key: 'read', title: 'Consultar credenciales', description: 'Ver informacion sin permisos de escritura.' }
  ]
};

export function getDashboardActionsForRole(role: AdminRole) {
  return roleDashboardActions[role];
}

export function canAdminRolePerform(role: AdminRole, actionKey: string) {
  return roleDashboardActions[role].some((action) => action.key === actionKey);
}
