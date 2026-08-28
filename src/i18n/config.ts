import { siteConfig } from '@/config/site';

export const locales = ['ko', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ko';

export const aboutPaths: Record<Locale, string> = {
  ko: '/about/',
  en: '/en/about/',
};

export const aboutUrls: Record<Locale, string> = {
  ko: `${siteConfig.url}${aboutPaths.ko}`,
  en: `${siteConfig.url}${aboutPaths.en}`,
};

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'ko' ? 'en' : 'ko';
}
