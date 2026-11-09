import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, locales } from '@/config';

export default getRequestConfig(async ({ locale }) => {
  const validLocale =
    locale && locales.includes(locale) ? locale : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
  };
});
