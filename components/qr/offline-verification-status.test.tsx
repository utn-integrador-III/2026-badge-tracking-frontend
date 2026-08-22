// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OfflineVerificationStatus } from './offline-verification-status';

describe('OfflineVerificationStatus', () => {
  it('reports the offline bundle as available when freshly generated', () => {
    render(<OfflineVerificationStatus />);

    expect(screen.getByText('Verificacion offline')).toBeInTheDocument();
    expect(screen.getByText('Paquete offline disponible para validar credenciales aun sin conexion.')).toBeInTheDocument();
  });
});
