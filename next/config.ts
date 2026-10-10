import { serverEnv } from '@/env/server';

export const defaultLocale = 'fa' as const;
export const locales = ['fa'] as const;

export type Locale = (typeof locales)[number];

export const pathnames = {};
export const localePrefix = 'always';

export const port = serverEnv.PORT ? Number(serverEnv.PORT) : 3000;
export const host = serverEnv.WEBSITE_URL
  ? `https://${serverEnv.WEBSITE_URL}`
  : `http://localhost:${port}`;
