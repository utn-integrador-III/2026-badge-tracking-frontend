import { describe, expect, it } from 'vitest';
import { getLocaleLabel, getLocalizedMessage, resolveLocale } from './language-preferences';

describe('language preferences', () => {
  it('resolves supported locales and falls back to Spanish', () => {
    expect(resolveLocale('en')).toBe('en');
    expect(resolveLocale('es')).toBe('es');
    expect(resolveLocale('fr')).toBe('es');
    expect(resolveLocale(undefined)).toBe('es');
  });

  it('returns labels and localized messages for the selected locale', () => {
    expect(getLocaleLabel('es')).toBe('Español');
    expect(getLocaleLabel('en')).toBe('English');
    expect(getLocalizedMessage('en', 'verify')).toBe('Verify');
  });
});
