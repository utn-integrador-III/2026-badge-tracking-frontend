// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SharePage from './page';

describe('SharePage', () => {
  it('renders the holder summary and the selective share QR module', () => {
    render(<SharePage />);

    expect(screen.getByText('Compartir credencial')).toBeInTheDocument();
    expect(screen.getByText('Juan Carlos Rodríguez Vargas')).toBeInTheDocument();
    expect(screen.getByText('Campos a compartir')).toBeInTheDocument();
    expect(screen.getByText(/despues de 60 segundos/)).toBeInTheDocument();
  });
});
