// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PwaRegister } from './pwa-register';

describe('PwaRegister', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('renders nothing', () => {
    const { container } = render(<PwaRegister />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not register a service worker outside production', () => {
    const register = vi.fn();
    Object.defineProperty(navigator, 'serviceWorker', { value: { register }, configurable: true });
    vi.stubEnv('NODE_ENV', 'test');

    render(<PwaRegister />);

    expect(register).not.toHaveBeenCalled();
  });

  it('registers the service worker in production', () => {
    const register = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'serviceWorker', { value: { register }, configurable: true });
    vi.stubEnv('NODE_ENV', 'production');

    render(<PwaRegister />);

    expect(register).toHaveBeenCalledWith('/sw.js');
  });

  it('logs an error when registration fails', async () => {
    const error = new Error('registration failed');
    const register = vi.fn().mockRejectedValue(error);
    Object.defineProperty(navigator, 'serviceWorker', { value: { register }, configurable: true });
    vi.stubEnv('NODE_ENV', 'production');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<PwaRegister />);
    await waitFor(() => expect(consoleError).toHaveBeenCalledWith('Service worker registration failed', error));
  });
});
