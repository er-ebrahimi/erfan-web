'use client';

import { Check, Globe, Menu, Moon, Sun, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useSlugContext } from '@/app/context/SlugContext';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { languageLabels } from '@/lib/constants';
import { getLocaleConfig } from '@/lib/fonts';
import { groupNavItems } from '@/lib/nav';
import { strapiImage } from '@/lib/strapi/strapiImage';
import { localizeHref } from '@/lib/url';
import { cn } from '@/lib/utils';

type NavbarItem = {
  id?: number | string;
  URL?: string | null;
  text?: string | null;
  target?: string | null;
  icon?: string | null;
  children?: NavbarItem[];
  variant?: string | null;
};

type NavbarData = {
  left_navbar_items?: NavbarItem[];
  right_navbar_items?: NavbarItem[];
  logo?: {
    image?: {
      url?: string;
      alternativeText?: string | null;
      width?: number;
      height?: number;
    } | null;
    company?: string | null;
  } | null;
  theme?: boolean | null;
  language?: boolean | null;
  cta?: {
    text?: string | null;
    URL?: string | null;
    variant?: string | null;
  } | null;
};

type Props = {
  data: NavbarData;
  locale: string;
  languages?: { id: number; code: string; name: string }[];
};

/** nav-6 shell with the studioarman nav tree fed from `global.navbar`. */
export function NavigationNavbar({ data, locale, languages = [] }: Props) {
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);

  const items = [
    ...(data?.left_navbar_items ?? []),
    ...(data?.right_navbar_items ?? []),
  ];
  const { quickLinks, groups } = groupNavItems(items);
  const cta = data?.cta ?? { text: t('getStarted'), URL: '/contact' };
  const company = data?.logo?.company || 'استودیو آرمان';
  const logo = data?.logo?.image;

  useEffect(() => {
    if (!languageOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!languageRef.current?.contains(event.target as Node)) {
        setLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [languageOpen]);

  return (
    <nav
      aria-label={company}
      className="fixed inset-x-2 top-4 z-50 mx-auto flex max-w-fit items-center justify-center gap-1.5 rounded-full border border-border/80 bg-popover/85 px-2.5 py-1.5 shadow-derek backdrop-blur-md sm:inset-x-0"
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="flex items-center gap-1.5">
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-full text-muted-foreground hover:text-foreground"
                aria-label={t('menu')}
                aria-expanded={open}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </Button>
            </PopoverTrigger>

            <Link
              href={`/${locale}`}
              aria-label={company}
              className="flex items-center gap-2 rounded-full px-2 py-1 text-sm font-bold text-foreground transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {logo?.url ? (
                <Image
                  src={strapiImage(logo.url)}
                  alt={logo.alternativeText ?? company}
                  width={logo.width ?? 120}
                  height={logo.height ?? 32}
                  className="h-7 w-auto object-contain"
                  priority
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-primary"
                />
              )}
              <span className="hidden sm:inline">{company}</span>
            </Link>

            <div
              className="mx-0.5 hidden h-4 w-px bg-border/80 sm:block"
              aria-hidden="true"
            />

            {data?.theme && <ThemeToggle label={t('theme')} />}

            {data?.language && languages.length > 1 && (
              <div className="relative" ref={languageRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full text-muted-foreground hover:text-foreground"
                  aria-label={t('language')}
                  aria-expanded={languageOpen}
                  onClick={() => setLanguageOpen((value) => !value)}
                >
                  <Globe className="size-4" />
                </Button>
                {languageOpen && (
                  <LanguageMenu
                    locale={locale}
                    languages={languages}
                    onSelect={() => setLanguageOpen(false)}
                  />
                )}
              </div>
            )}

            {cta?.text && cta.URL && (
              <Button
                asChild
                size="sm"
                className="ms-1 rounded-full px-3 text-xs font-medium shadow-aceternity sm:px-4 sm:text-sm"
              >
                <Link
                  href={localizeHref(cta.URL, locale)}
                  onClick={() => setOpen(false)}
                >
                  {cta.text}
                </Link>
              </Button>
            )}
          </div>
        </PopoverAnchor>

        <PopoverContent
          align="center"
          sideOffset={14}
          className="max-h-[82dvh] w-[calc(100vw-1.5rem)] max-w-6xl overflow-y-auto overscroll-contain rounded-3xl border border-border/80 bg-popover p-0 text-popover-foreground shadow-lg outline-none"
        >
          <nav aria-label={t('menu')} className="p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col">
                <span className="mb-3 text-xs uppercase text-muted-foreground">
                  {t('quickLinks')}
                </span>
                <ul className="flex flex-col gap-2.5">
                  {quickLinks.map((item) => (
                    <li key={item.id ?? item.URL ?? item.text}>
                      <MenuLink
                        item={item}
                        locale={locale}
                        onNavigate={() => setOpen(false)}
                        className="text-sm font-medium text-foreground"
                      />
                    </li>
                  ))}
                </ul>
              </div>

              {groups.map((group) => (
                <div
                  key={group.id ?? group.text}
                  className="flex min-w-0 flex-col border-t border-border/60 pt-6 sm:border-t-0 sm:pt-0 lg:border-s lg:ps-8"
                >
                  {group.text && (
                    <h4 className="mb-3 text-xs uppercase text-muted-foreground">
                      {group.URL ? (
                        <MenuLink
                          item={group}
                          locale={locale}
                          onNavigate={() => setOpen(false)}
                          className="text-xs uppercase text-muted-foreground hover:text-foreground"
                        />
                      ) : (
                        group.text
                      )}
                    </h4>
                  )}
                  <ul className="flex flex-col gap-2.5">
                    {group.children?.map((child) => (
                      <li key={child.id ?? child.URL ?? child.text}>
                        <MenuLink
                          item={child}
                          locale={locale}
                          onNavigate={() => setOpen(false)}
                          className="text-sm font-medium text-muted-foreground hover:text-foreground"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        </PopoverContent>
      </Popover>
    </nav>
  );
}

function MenuLink({
  item,
  locale,
  onNavigate,
  className,
}: {
  item: NavbarItem;
  locale: string;
  onNavigate: () => void;
  className?: string;
}) {
  if (!item.text) return null;
  if (!item.URL) {
    return <span className={className}>{item.text}</span>;
  }
  return (
    <Link
      href={localizeHref(item.URL, locale)}
      target={item.target === '_blank' ? '_blank' : undefined}
      rel={item.target === '_blank' ? 'noreferrer' : undefined}
      onClick={onNavigate}
      className={cn(
        'block rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      {item.text}
    </Link>
  );
}

function ThemeToggle({ label }: { label: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-9 rounded-full text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={label}
    >
      <Sun
        className={cn(
          'size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0',
          !mounted && 'opacity-0'
        )}
      />
      <Moon
        className={cn(
          'absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100',
          !mounted && 'opacity-0'
        )}
      />
      <span className="sr-only">{label}</span>
    </Button>
  );
}

function LanguageMenu({
  locale,
  languages,
  onSelect,
}: {
  locale: string;
  languages: NonNullable<Props['languages']>;
  onSelect: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSlugContext();
  const { localizedSlugs } = state;

  const generateLocalizedPath = (targetLocale: string): string => {
    if (!pathname) return `/${targetLocale}`;
    const segments = pathname.split('/');
    if (segments.length <= 2) return `/${targetLocale}`;

    if (localizedSlugs[targetLocale]) {
      const newSegments = [...segments];
      newSegments[1] = targetLocale;
      newSegments[newSegments.length - 1] = localizedSlugs[targetLocale];
      return newSegments.join('/');
    }

    const newSegments = [...segments];
    newSegments[1] = targetLocale;
    return newSegments.join('/');
  };

  return (
    <div className="absolute end-0 top-full z-[60] mt-2 min-w-40 rounded-xl border border-border bg-popover p-1 shadow-lg">
      {languages.map((language) => {
        const info = languageLabels[language.code] || {
          label: language.name || language.code.toUpperCase(),
          flag: '🌐',
        };
        const isActive = language.code === locale;
        const config = getLocaleConfig(language.code);

        return (
          <button
            key={language.code}
            type="button"
            onClick={() => {
              router.push(generateLocalizedPath(language.code));
              onSelect();
            }}
            className={cn(
              'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
              isActive && 'bg-accent text-accent-foreground'
            )}
          >
            <span className="flex items-center gap-2">
              <span>{info.flag}</span>
              <span className={cn(config.fontClass)}>{info.label}</span>
            </span>
            {isActive && <Check className="size-4" />}
          </button>
        );
      })}
    </div>
  );
}
