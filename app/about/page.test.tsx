// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AboutPage from './page';

describe('AboutPage', () => {
  it('renders version info, the project team and capabilities', () => {
    render(<AboutPage />);

    expect(screen.getByText('Acerca de Digital Badge')).toBeInTheDocument();
    expect(screen.getByText('Equipo del proyecto')).toBeInTheDocument();
    expect(screen.getByText('Capacidades principales')).toBeInTheDocument();
  });
});
