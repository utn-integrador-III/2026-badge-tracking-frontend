// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { IssueBadgeForm } from './issue-badge-form';

describe('IssueBadgeForm', () => {
  afterEach(() => {
    cleanup();
  });

  it('issues a badge using the pre-filled demo values', () => {
    render(<IssueBadgeForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Emitir badge' }));

    expect(screen.getByText('Badge emitido correctamente')).toBeInTheDocument();
    expect(screen.getByText(/Laura Méndez Castro/)).toBeInTheDocument();
    expect(screen.getByText(/2026-0100/)).toBeInTheDocument();
  });

  it('shows a validation error for an invalid institutional email', () => {
    render(<IssueBadgeForm />);

    const emailInput = screen.getByPlaceholderText('usuario@utn.ac.cr');
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByRole('button', { name: 'Emitir badge' }));

    expect(screen.getByText('A valid institutional email is required.')).toBeInTheDocument();
    expect(screen.queryByText('Badge emitido correctamente')).not.toBeInTheDocument();
  });
});
