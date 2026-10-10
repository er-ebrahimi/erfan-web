import { serverEnv } from '@/env/server';

const rawLocales = (process.env.LOCALES || 'fa')
  .split(',')
  .map((l) => l.trim())
  .filter(Boolean);
export const locales: readonly string[] = rawLocales;

export type Locale = (typeof locales)[number];

const envDefault = process.env.DEFAULT_LOCALE;
export const defaultLocale: Locale =
  envDefault && locales.includes(envDefault) ? envDefault : locales[0];

export const pathnames = {};
export const localePrefix = 'always';

export const port = serverEnv.PORT ? Number(serverEnv.PORT) : 3000;
export const host = serverEnv.WEBSITE_URL
  ? `https://${serverEnv.WEBSITE_URL}`
  : `http://localhost:${port}`;
