'use client';

import { IconChevronDown, IconLanguage } from '@tabler/icons-react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useSlugContext } from '@/app/context/SlugContext';
import { languageLabels } from '@/lib/constants';
import { getLocaleConfig } from '@/lib/fonts';
import { cn } from '@/lib/utils';

type BackendLanguageSelectorProps = {
  languages: {
    id: number;
    code: string;
    name: string;
  }[];
  onClose?: () => void;
};

export function BackendLanguageSelector({
  languages,
  onClose,
}: BackendLanguageSelectorProps) {
  const { state } = useSlugContext();
  const { localizedSlugs } = state;
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const localeConfig = getLocaleConfig(locale);

  const pathname = usePathname();
  const segments = pathname?.split('/') || [];

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

  const handleLanguageChange = (newLocale: string) => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
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
            {languages.map((language) => {
              const languageInfo = languageLabels[language.code] || {
                label: language.name || language.code.toUpperCase(),
                flag: '🌐',
              };
              const isActive = language.code === locale;

              return (
                <Link
                  key={language.id}
                  href={generateLocalizedPath(language.code)}
                  onClick={() => handleLanguageChange(language.code)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent/50 transition-colors duration-150',
                    isActive && 'bg-accent/30 text-accent-foreground'
                  )}
                >
                  <span className="text-lg">{languageInfo.flag}</span>
                  <span
                    className={cn(
                      'flex-1',
                      getLocaleConfig(language.code).fontClass
                    )}
                  >
                    {languageInfo.label}
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
