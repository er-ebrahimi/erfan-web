'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useSlugContext } from '@/app/context/SlugContext';
import { getLanguageLabel } from '@/lib/constants';
import { getLocaleConfig } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export function LocaleSwitcher() {
  const { state } = useSlugContext();
  const { localizedSlugs } = state;
  const locale = useLocale();

  const pathname = usePathname(); // Current path
  const segments = pathname?.split('/') || []; // Split path into segments

  // Get available locales
  const availableLocales =
    Object.keys(localizedSlugs).length > 0
      ? Object.keys(localizedSlugs)
      : ['en', 'fr', 'fa']; // Use locales

  // Generate localized path for each locale
  const generateLocalizedPath = (loc: string): string => {
    if (!pathname) return `/${loc}`; // Default to root path for the locale

    // Handle homepage (e.g., "/en" -> "/fr")
    if (segments.length <= 2) {
      return `/${loc}`;
    }

    // Handle dynamic paths (e.g., "/en/blog/[slug]")
    if (localizedSlugs[loc]) {
      segments[1] = loc; // Replace the locale
      segments[segments.length - 1] = localizedSlugs[loc]; // Replace slug if available
      return segments.join('/');
    }

    // Fallback to replace only the locale
    segments[1] = loc;
    return segments.join('/');
  };

  return (
    <div className="flex gap-2 p-1 rounded-md bg-muted dark:bg-primary">
      {!pathname?.includes('/products/') &&
        availableLocales.map((loc) => (
          <Link key={loc} href={generateLocalizedPath(loc)}>
            <div
              className={cn(
                'flex cursor-pointer items-center justify-center text-sm leading-[110%] w-8 py-1 rounded-md transition-all duration-200',
                'text-muted-foreground hover:text-foreground',
                'hover:bg-muted dark:hover:bg-muted/80',
                'hover:shadow-sm',
                loc === locale
                  ? 'bg-background dark:bg-muted text-foreground shadow-sm border border-border'
                  : 'hover:border hover:border-border/50',
                getLocaleConfig(loc).fontClass
              )}
              title={`Switch to ${getLanguageLabel(loc)}`}
            >
              {getLanguageLabel(loc)}
            </div>
          </Link>
        ))}
    </div>
  );
}
