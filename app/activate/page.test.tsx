// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ActivatePage from './page';

describe('ActivatePage', () => {
  it('renders the activation flow starting on the identity step', () => {
    render(<ActivatePage />);

    expect(screen.getByText('Registro institucional')).toBeInTheDocument();
    expect(screen.getByLabelText('Número de cédula')).toBeInTheDocument();
  });
});
