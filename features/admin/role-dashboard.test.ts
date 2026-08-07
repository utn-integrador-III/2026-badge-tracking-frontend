import { describe, expect, it } from 'vitest';
import { canAdminRolePerform, getDashboardActionsForRole } from './role-dashboard';

describe('role dashboard', () => {
  it('returns role-specific dashboard actions', () => {
    expect(getDashboardActionsForRole('Registrar').map((action) => action.key)).toEqual(['issue', 'import', 'revoke']);
    expect(getDashboardActionsForRole('Security').map((action) => action.key)).toEqual(['verify', 'audit']);
  });

  it('enforces action permissions by role', () => {
    expect(canAdminRolePerform('Registrar', 'issue')).toBe(true);
    expect(canAdminRolePerform('Viewer', 'issue')).toBe(false);
  });
});
