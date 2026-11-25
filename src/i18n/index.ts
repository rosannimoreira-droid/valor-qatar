import { en } from './en';
import { ar } from './ar';
import type { Locale, TranslationDictionary } from './types';

export type { Locale, TranslationDictionary };

const dictionaries: Record<Locale, TranslationDictionary> = { en, ar };

export function getDictionary(locale: Locale): TranslationDictionary {
  return dictionaries[locale];
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'ar' : 'en';
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function formatTemplate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (acc, [key, val]) => acc.replaceAll(`{${key}}`, String(val)),
    template
  );
}
