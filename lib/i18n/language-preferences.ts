import { type AppLocale, locales, messages } from './messages';

export const defaultLocale: AppLocale = 'es';

export function isSupportedLocale(value: string): value is AppLocale {
  return locales.includes(value as AppLocale);
}

export function resolveLocale(value: string | null | undefined): AppLocale {
  return value && isSupportedLocale(value) ? value : defaultLocale;
}

export function getLocaleLabel(locale: AppLocale) {
  return locale === 'es' ? 'Español' : 'English';
}

export function getLocalizedMessage(locale: AppLocale, key: keyof (typeof messages)['es']) {
  return messages[locale][key];
}
