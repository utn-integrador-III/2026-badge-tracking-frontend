// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { RoleDashboardPanel } from './role-dashboard-panel';

describe('RoleDashboardPanel', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows the Registrar actions by default', () => {
    render(<RoleDashboardPanel />);

    expect(screen.getByText('Emitir badges')).toBeInTheDocument();
    expect(screen.getByText('Importar usuarios')).toBeInTheDocument();
    expect(screen.getByText('Revocar badges')).toBeInTheDocument();
  });

  it('switches actions when another role is selected', () => {
    render(<RoleDashboardPanel />);

    fireEvent.click(screen.getByRole('button', { name: 'Security' }));

    expect(screen.getByText('Verificar accesos')).toBeInTheDocument();
    expect(screen.getByText('Auditoria')).toBeInTheDocument();
    expect(screen.queryByText('Emitir badges')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Viewer' }));
    expect(screen.getByText('Consultar credenciales')).toBeInTheDocument();
  });
});
