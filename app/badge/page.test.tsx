// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BadgePage from './page';

describe('BadgePage', () => {
  it('renders the badge details and every supported badge type preview', () => {
    render(<BadgePage />);

    expect(screen.getByText('Detalle de credencial')).toBeInTheDocument();
    expect(screen.getByText('Tipos de badge soportados')).toBeInTheDocument();
    expect(screen.getAllByText('Juan Carlos Rodríguez Vargas').length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Ana María Vargas Solano')).toBeInTheDocument();
    expect(screen.getByText('María Jiménez Rojas')).toBeInTheDocument();
  });
});
