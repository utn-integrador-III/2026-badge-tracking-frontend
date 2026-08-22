// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { renderCalls, clearMock } = vi.hoisted(() => ({
  renderCalls: [] as Array<(decodedText: string) => void>,
  clearMock: vi.fn().mockResolvedValue(undefined)
}));

vi.mock('html5-qrcode', () => ({
  Html5QrcodeScanner: class {
    render(successCallback: (decodedText: string) => void) {
      renderCalls.push(successCallback);
    }
    clear() {
      return clearMock();
    }
  }
}));

import { QrScanner } from './qr-scanner';

function validToken() {
  return JSON.stringify({
    type: 'digital-badge-share-token',
    version: 1,
    nonce: 'n1',
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    proof: {
      badgeId: 'badge_demo_001',
      fullName: 'Juan Carlos Rodríguez Vargas',
      institutionalId: '2024-0001',
      institutionName: 'Universidad Técnica Nacional',
      role: 'Student',
      status: 'active',
      validUntil: '2026-12-31'
    }
  });
}

describe('QrScanner', () => {
  afterEach(() => {
    cleanup();
    renderCalls.length = 0;
    vi.restoreAllMocks();
  });

  it('mounts the camera scanner region and manual entry form', () => {
    render(<QrScanner />);

    expect(screen.getByText('Cámara o imagen')).toBeInTheDocument();
    expect(screen.getByLabelText('Código leído manualmente')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Verificar código/i })).toBeDisabled();
  });

  it('verifies a manually entered demo token', () => {
    render(<QrScanner />);

    fireEvent.click(screen.getByRole('button', { name: /Cargar demo/i }));
    const textarea = screen.getByLabelText('Código leído manualmente') as HTMLTextAreaElement;
    expect(textarea.value).not.toBe('');

    fireEvent.click(screen.getByRole('button', { name: /Verificar código/i }));

    expect(screen.getByText('Acceso permitido')).toBeInTheDocument();
  });

  it('shows a denied result and allows scanning another code', () => {
    render(<QrScanner />);

    const textarea = screen.getByLabelText('Código leído manualmente');
    fireEvent.change(textarea, { target: { value: 'not-json' } });
    fireEvent.click(screen.getByRole('button', { name: /Verificar código/i }));

    expect(screen.getByText('Acceso denegado')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Escanear otro código/i }));
    expect(screen.getByText('Cámara o imagen')).toBeInTheDocument();
  });

  it('verifies a code decoded by the camera scanner', () => {
    render(<QrScanner />);

    expect(renderCalls).toHaveLength(1);
    act(() => {
      renderCalls[0](validToken());
    });

    expect(screen.getByText('Acceso permitido')).toBeInTheDocument();
  });
});
