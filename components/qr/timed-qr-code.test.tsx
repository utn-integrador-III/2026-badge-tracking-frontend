// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TimedQrCode } from './timed-qr-code';

describe('TimedQrCode', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('removes the QR code when its visibility time expires', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-27T12:00:00.000Z'));
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('11111111-2222-4333-8444-555555555555');

    render(<TimedQrCode fields={['ageProof']} visibilitySeconds={3} />);

    expect(screen.getByTitle('Código QR temporal para compartir la verificación')).toBeInTheDocument();
    expect(screen.getByRole('timer')).toHaveTextContent('Expira en 3s');

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByTitle('Código QR temporal para compartir la verificación')).not.toBeInTheDocument();
    expect(screen.getByText('Código QR expirado')).toBeInTheDocument();
  });

  it('generates a fresh QR code and restarts the timer', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-27T12:00:00.000Z'));
    vi.spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('11111111-2222-4333-8444-555555555555')
      .mockReturnValueOnce('aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee');

    render(<TimedQrCode fields={['ageProof']} visibilitySeconds={2} />);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Generar nuevo QR' }));

    expect(screen.getByTitle('Código QR temporal para compartir la verificación')).toBeInTheDocument();
    expect(screen.getByRole('timer')).toHaveTextContent('Expira en 2s');
    expect(crypto.randomUUID).toHaveBeenCalledTimes(2);
  });
});
