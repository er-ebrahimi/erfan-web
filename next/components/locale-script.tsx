'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { getLanguageDir } from '@/lib/fonts';

export function LocaleScript({
  locales,
  defaultLocale,
}: {
  locales: string[];
  defaultLocale: string;
}) {
  const params = useParams();
  const rawLocale = params?.locale as string | undefined;
  const locale =
    rawLocale && locales.includes(rawLocale) ? rawLocale : defaultLocale;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = getLanguageDir(locale);
    }
  }, [locale]);

  return null;
}
