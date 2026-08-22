// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InstitutionBrandingPreview } from './institution-branding-preview';

describe('InstitutionBrandingPreview', () => {
  it('renders the institution name and brand colors', () => {
    render(<InstitutionBrandingPreview />);

    expect(screen.getByText('Marca institucional')).toBeInTheDocument();
    expect(screen.getByText('Universidad Técnica Nacional')).toBeInTheDocument();
    expect(screen.getByText('#20398b / #142b75')).toBeInTheDocument();
    expect(screen.getByAltText('Logo institucional')).toBeInTheDocument();
  });
});
