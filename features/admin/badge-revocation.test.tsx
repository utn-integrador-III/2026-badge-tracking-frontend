// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { BadgeRevocation } from './badge-revocation';

describe('BadgeRevocation', () => {
  afterEach(() => {
    cleanup();
  });

  it('lists every badge holder by default', () => {
    render(<BadgeRevocation />);

    expect(screen.getByText('Juan Carlos Rodríguez Vargas')).toBeInTheDocument();
    expect(screen.getByText('Ana María Vargas Solano')).toBeInTheDocument();
    expect(screen.getByText('María Jiménez Rojas')).toBeInTheDocument();
    expect(screen.getByText('Seleccione un titular para administrar su credencial.')).toBeInTheDocument();
  });

  it('filters holders as the search query changes', () => {
    render(<BadgeRevocation />);

    fireEvent.change(screen.getByLabelText('Buscar titular'), { target: { value: '2023-0142' } });

    expect(screen.getByText('Ana María Vargas Solano')).toBeInTheDocument();
    expect(screen.queryByText('Juan Carlos Rodríguez Vargas')).not.toBeInTheDocument();
  });

  it('shows a no-results message for an unmatched query', () => {
    render(<BadgeRevocation />);

    fireEvent.change(screen.getByLabelText('Buscar titular'), { target: { value: 'nadie-existe' } });

    expect(screen.getByText('No se encontraron titulares.')).toBeInTheDocument();
  });

  it('requires a reason before enabling the revoke action, then revokes the badge', async () => {
    render(<BadgeRevocation />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Seleccionar' })[0]);

    const revokeButton = screen.getByRole('button', { name: /Revocar y marcar inactivo/i });
    expect(revokeButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Motivo de revocación'), { target: { value: 'Graduación' } });
    expect(revokeButton).toBeEnabled();

    fireEvent.click(revokeButton);

    expect(await screen.findByRole('status')).toHaveTextContent('Juan Carlos Rodríguez Vargas');
    expect(screen.getByText('Credencial revocada · Perfil inactivo')).toBeInTheDocument();
  });
});
