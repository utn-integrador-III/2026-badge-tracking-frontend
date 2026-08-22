// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Countdown, getRemainingSeconds } from './countdown';

describe('getRemainingSeconds', () => {
  it('computes whole seconds remaining until expiry', () => {
    const now = new Date('2026-01-01T00:00:00.000Z').getTime();
    expect(getRemainingSeconds('2026-01-01T00:00:05.000Z', now)).toBe(5);
  });

  it('never returns a negative value', () => {
    const now = new Date('2026-01-01T00:00:10.000Z').getTime();
    expect(getRemainingSeconds('2026-01-01T00:00:00.000Z', now)).toBe(0);
  });
});

describe('Countdown', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('ticks down and calls onExpire once the time elapses', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    const onExpire = vi.fn();

    render(<Countdown expiresAt="2026-01-01T00:00:02.000Z" onExpire={onExpire} />);

    expect(screen.getByRole('timer')).toHaveTextContent('Expira en 2s');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByRole('timer')).toHaveTextContent('Expira en 0s');
    expect(onExpire).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onExpire).toHaveBeenCalledTimes(1);
  });
});
