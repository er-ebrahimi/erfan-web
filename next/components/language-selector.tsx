'use client';

import { IconChevronDown, IconLanguage } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useSlugContext } from '@/app/context/SlugContext';
import { languageLabels } from '@/lib/constants';
import { getLocaleConfig } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export function LanguageSelector() {
  const { state } = useSlugContext();
  const { localizedSlugs } = state;
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations('common');
  const localeConfig = getLocaleConfig(locale);

  const pathname = usePathname();
  const segments = pathname?.split('/') || [];

  // Available locales
  const availableLocales = ['fa'];

  // Generate localized path for each locale
  const generateLocalizedPath = (locale: string): string => {
    if (!pathname) return `/${locale}`; // Default to root path for the locale

    // Handle homepage (e.g., "/en" -> "/fr")
    if (segments.length <= 2) {
      return `/${locale}`;
    }

    // Handle dynamic paths (e.g., "/en/blog/[slug]")
    if (localizedSlugs[locale]) {
      segments[1] = locale; // Replace the locale
      segments[segments.length - 1] = localizedSlugs[locale]; // Replace slug if available
      return segments.join('/');
    }

    // Fallback to replace only the locale
    segments[1] = locale;
    return segments.join('/');
  };

  const currentLanguage = languageLabels[locale] || {
    label: locale.toUpperCase(),
    flag: '🌐',
  };

  return (
    <div className="relative">
      {/* Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border hover:bg-card transition-colors duration-200"
      >
        <IconLanguage className="h-4 w-4" />
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
        <span className={cn('text-sm', localeConfig.fontClass)}>
          {currentLanguage.label}
        </span>
        <IconChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Language Dropdown */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-lg z-50 bg-muted dark:bg-primary/20">
          <div className="py-2">
            {availableLocales.map((loc) => {
              const language = languageLabels[loc] || {
                label: loc.toUpperCase(),
                flag: '🌐',
              };
              const isActive = loc === locale;

              return (
                <Link
                  key={loc}
                  href={generateLocalizedPath(loc)}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent/50 transition-colors duration-150',
                    isActive && 'bg-accent/30 text-accent-foreground'
                  )}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span
                    className={cn('flex-1', getLocaleConfig(loc).fontClass)}
                  >
                    {language.label}
                  </span>
                  {isActive && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
