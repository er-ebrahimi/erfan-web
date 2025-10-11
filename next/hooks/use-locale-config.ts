'use client';

import { useLocale } from 'next-intl';

import { getLocaleConfig } from '@/lib/fonts';

/**
 * Hook to get unified locale configuration
 * Provides font, RTL, direction, and utility classes for the current locale
 */
export function useLocaleConfig() {
  const locale = useLocale();
  return getLocaleConfig(locale);
}

/**
 * Hook to get locale configuration for a specific locale
 * Useful for language switchers and previews
 */
export function useLocaleConfigFor(locale: string) {
  return getLocaleConfig(locale);
}
