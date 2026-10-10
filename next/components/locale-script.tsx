'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { getLanguageDir } from '@/lib/fonts';

export function LocaleScript() {
  const params = useParams();
  const locale = params?.locale as string | undefined;

  useEffect(() => {
    if (locale && typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = getLanguageDir(locale);
    }
  }, [locale]);

  return null;
}
