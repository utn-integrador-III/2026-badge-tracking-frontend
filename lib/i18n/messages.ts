export const locales = ['es', 'en'] as const;
export type AppLocale = (typeof locales)[number];

export const messages = {
  es: {
    appName: 'Digital Badge',
    share: 'Compartir',
    verify: 'Verificar'
  },
  en: {
    appName: 'Digital Badge',
    share: 'Share',
    verify: 'Verify'
  }
};
