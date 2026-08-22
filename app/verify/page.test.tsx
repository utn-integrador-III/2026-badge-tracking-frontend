// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('html5-qrcode', () => ({
  Html5QrcodeScanner: class {
    render() {}
    clear() {
      return Promise.resolve();
    }
  }
}));

import VerifyPage from './page';

describe('VerifyPage', () => {
  it('renders the offline status and the lazily-loaded QR scanner', async () => {
    render(<VerifyPage />);

    expect(screen.getByText('Verificar credencial')).toBeInTheDocument();
    expect(screen.getByText('Verificacion offline')).toBeInTheDocument();
    expect(await screen.findByText('Cámara o imagen')).toBeInTheDocument();
  });
});
