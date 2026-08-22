// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FirstRunTutorial } from './first-run-tutorial';

const storageKey = 'digital-badge-first-run-tutorial-complete';

describe('FirstRunTutorial', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('is hidden when the tutorial was already completed', () => {
    localStorage.setItem(storageKey, 'true');

    render(<FirstRunTutorial />);

    expect(screen.queryByText('Primer uso')).not.toBeInTheDocument();
  });

  it('walks through every step and finishes on the last one', () => {
    render(<FirstRunTutorial />);

    expect(screen.getByText('Revise su carnet')).toBeInTheDocument();
    expect(screen.getByText('Paso 1 de 3')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(screen.getByText('Comparta su QR')).toBeInTheDocument();
    expect(screen.getByText('Paso 2 de 3')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(screen.getByText('Proteja su acceso')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Finalizar' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Finalizar' }));
    expect(screen.queryByText('Primer uso')).not.toBeInTheDocument();
    expect(localStorage.getItem(storageKey)).toBe('true');
  });

  it('can be skipped at any point', () => {
    render(<FirstRunTutorial />);

    fireEvent.click(screen.getByRole('button', { name: 'Saltar' }));

    expect(screen.queryByText('Primer uso')).not.toBeInTheDocument();
    expect(localStorage.getItem(storageKey)).toBe('true');
  });
});
