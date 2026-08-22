// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LanguageSelector } from './language-selector';

describe('LanguageSelector', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('defaults to Spanish and shows both options', () => {
    render(<LanguageSelector />);

    expect(screen.getByRole('button', { name: 'Español' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByText('Vista actual: Compartir / Verificar')).toBeInTheDocument();
  });

  it('restores a previously saved locale', () => {
    localStorage.setItem('digital-badge-locale', 'en');

    render(<LanguageSelector />);

    expect(screen.getByText('Current view: Share / Verify')).toBeInTheDocument();
  });

  it('switches locale on click and persists the choice', () => {
    render(<LanguageSelector />);

    fireEvent.click(screen.getByRole('button', { name: 'English' }));

    expect(screen.getByText('Current view: Share / Verify')).toBeInTheDocument();
    expect(localStorage.getItem('digital-badge-locale')).toBe('en');
  });
});
