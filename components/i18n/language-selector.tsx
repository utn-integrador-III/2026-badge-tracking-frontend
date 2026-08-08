'use client';

import { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';
import { type AppLocale, locales } from '@/lib/i18n/messages';
import { getLocaleLabel, getLocalizedMessage, resolveLocale } from '@/lib/i18n/language-preferences';

const storageKey = 'digital-badge-locale';

export function LanguageSelector() {
  const [locale, setLocale] = useState<AppLocale>('es');

  useEffect(() => {
    setLocale(resolveLocale(localStorage.getItem(storageKey)));
  }, []);

  const handleLocaleChange = (nextLocale: AppLocale) => {
    setLocale(nextLocale);
    localStorage.setItem(storageKey, nextLocale);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#20398b]">
          <Languages className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="font-bold text-slate-950">Idioma de la app</h2>
          <p className="text-sm text-slate-600">Seleccione el idioma de navegación.</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {locales.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleLocaleChange(option)}
            className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
              locale === option ? 'border-[#20398b] bg-[#20398b] text-white' : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}
          >
            {getLocaleLabel(option)}
          </button>
        ))}
      </div>

      <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
        {locale === 'es' ? 'Vista actual' : 'Current view'}: {getLocalizedMessage(locale, 'share')} / {getLocalizedMessage(locale, 'verify')}
      </p>
    </section>
  );
}
