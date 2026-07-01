const rawLocales = (process.env.LOCALES || 'en').split(',').map((l) => l.trim()).filter(Boolean);
export const locales: readonly string[] = rawLocales;

export type Locale = (typeof locales)[number];

const envDefault = process.env.DEFAULT_LOCALE;
export const defaultLocale: Locale = envDefault && locales.includes(envDefault)
  ? envDefault
  : locales[0];

export const pathnames = {};
export const localePrefix = 'always';

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_URL
  ? `https://${process.env.WEBSITE_URL}`
  : `http://localhost:${port}`;
