import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr', 'fa'],
  defaultLocale: 'fa',
  localeDetection: true,
});
