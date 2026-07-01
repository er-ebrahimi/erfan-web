"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  IconArticle,
  IconBriefcase,
  IconEdit,
  IconHelp,
  IconHome,
  IconLanguage,
  IconMail,
  IconMoon,
  IconQuestionMark,
  IconSettings,
  IconSun,
  IconUser,
  IconCheck,
  IconMenu2,
  IconPlus,
} from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/elements/button"

import { useSlugContext } from '@/app/context/SlugContext';
import { languageLabels } from '@/lib/constants';
import { getLocaleConfig } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { useRouter } from "next/navigation";

type NavbarItem = {
  URL: string;
  text: string;
  target?: string;
  icon?: string;
  children?: NavbarItem[];
  variant?: string;
};

type Props = {
  leftNavbarItems: NavbarItem[];
  rightNavbarItems: NavbarItem[];
  logo: any;
  locale: string;
  showTheme?: boolean;
  showLanguage?: boolean;
  languages?: {
    id: number;
    code: string;
    name: string;
  }[];
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

// Icon mapping for Strapi icon field or text-based fallback
const getIconForNavItem = (text: string, iconName?: string) => {
  if (iconName) {
    switch (iconName) {
      case 'IconHome':
        return <IconHome className="h-4 w-4" />;
      case 'IconArticle':
        return <IconArticle className="h-4 w-4" />;
      case 'IconEdit':
        return <IconEdit className="h-4 w-4" />;
      case 'IconMail':
        return <IconMail className="h-4 w-4" />;
      case 'IconHelp':
        return <IconHelp className="h-4 w-4" />;
      case 'IconQuestionMark':
        return <IconQuestionMark className="h-4 w-4" />;
      case 'IconUser':
        return <IconUser className="h-4 w-4" />;
      case 'IconBriefcase':
        return <IconBriefcase className="h-4 w-4" />;
      case 'IconSettings':
        return <IconSettings className="h-4 w-4" />;
      default:
        break;
    }
  }
  const lowercaseText = text.toLowerCase();
  if (lowercaseText.includes('home') || lowercaseText.includes('accueil')) {
    return <IconHome className="h-4 w-4" />;
  }
  if (lowercaseText.includes('blog') || lowercaseText.includes('article')) {
    return <IconArticle className="h-4 w-4" />;
  }
  if (lowercaseText.includes('about') || lowercaseText.includes('à propos')) {
    return <IconUser className="h-4 w-4" />;
  }
  if (
    lowercaseText.includes('service') ||
    lowercaseText.includes('work') ||
    lowercaseText.includes('portfolio')
  ) {
    return <IconBriefcase className="h-4 w-4" />;
  }
  if (lowercaseText.includes('contact')) {
    return <IconMail className="h-4 w-4" />;
  }
  if (lowercaseText.includes('faq') || lowercaseText.includes('help')) {
    return <IconHelp className="h-4 w-4" />;
  }
  if (lowercaseText.includes('settings') || lowercaseText.includes('config')) {
    return <IconSettings className="h-4 w-4" />;
  }
  return <IconBriefcase className="h-4 w-4" />;
};

export function NavbarMenu({
  leftNavbarItems,
  rightNavbarItems,
  logo,
  locale,
  showTheme = false,
  showLanguage = false,
  languages = [],
}: Props) {
  const { theme, setTheme } = useTheme();
  const [sheetOpen, setSheetOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
  }, [sheetOpen]);

  useEffect(() => {
  }, [pathname]);
  // Language logic
  const { state } = useSlugContext();
  const { localizedSlugs } = state;
  const currentLocale = useLocale();
  const t = useTranslations('common');
  const { direction: dir, isRTL, fontClass } = getLocaleConfig(currentLocale);

  const segments = pathname?.split('/') || [];
  const router = useRouter();
  const generateLocalizedPath = (targetLocale: string): string => {
    if (!pathname) return `/${targetLocale}`;

    // Handle homepage (e.g., "/en" -> "/fr")
    if (segments.length <= 2) {
      return `/${targetLocale}`;
    }

    // Handle dynamic paths (e.g., "/en/blog/[slug]")
    if (localizedSlugs[targetLocale]) {
      const newSegments = [...segments];
      newSegments[1] = targetLocale;
      newSegments[newSegments.length - 1] = localizedSlugs[targetLocale];
      return newSegments.join('/');
    }

    // Fallback to replace only the locale
    const newSegments = [...segments];
    newSegments[1] = targetLocale;
    return newSegments.join('/');
  };

  return (
    <>
      {/* Mobile View: Inline Trigger inside Top Right Container */}
      <div className="md:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="simple"
              className="h-auto p-2 rounded-full z-1"
              aria-label={t('menu')}
            >
              <IconMenu2 className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className={cn("overflow-y-auto p-6", fontClass)} dir={dir}>
            <SheetHeader>
              <SheetTitle className="sr-only">{t('menu')}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-6 pb-6">
              {/* Left Navbar Items — Home first */}
              {leftNavbarItems
                .map((item, index) => (
                  <MobileNavItem key={`left-${index}`} item={item} locale={locale} onClose={() => setSheetOpen(false)} />
                ))}

              {/* Right Navbar Items */}
              {rightNavbarItems?.map((item, index) => (
                <MobileNavItem key={`right-${index}`} item={item} locale={locale} onClose={() => setSheetOpen(false)} />
              ))}

              <div className="flex flex-col gap-4 mt-4 pt-4 border-t">
                {/* Theme Toggle */}
                {showTheme && (
                  <div
                    className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-accent rounded-md"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    <div className="relative h-4 w-4 mr-1">
                      <IconSun
                        className="
      absolute
      rotate-0 scale-100
      dark:-rotate-90 dark:scale-0 h-4 w-4
    "
                      />
                      <IconMoon
                        className="
      absolute
      rotate-90 scale-0
      dark:rotate-0 dark:scale-100  h-4 w-4
    "
                      />
                    </div>
                    <span>{theme === 'dark' ? t('lightMode') : t('darkMode')}</span>
                  </div>
                )}

                {/* Language Selector */}
                {showLanguage && languages && languages.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="px-3 text-sm font-medium text-muted-foreground">{t('language')}</div>
                    {languages.map((language) => {
                      const languageInfo = languageLabels[language.code] || {
                        label: language.name || language.code.toUpperCase(),
                        flag: '🌐',
                      };
                      const isActive = language.code === currentLocale;
                      const localeConfig = getLocaleConfig(language.code);

                      return (
                        <Link
                          key={language.code}
                          href={generateLocalizedPath(language.code)}
                          onClick={() => setSheetOpen(false)}
                          className={cn(
                            "flex items-center justify-between w-full rounded-md px-3 py-3 hover:bg-accent hover:text-accent-foreground",
                            isActive && "bg-accent text-accent-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span>{languageInfo.flag}</span>
                            <span className={cn("text-sm", localeConfig.fontClass)}>
                              {languageInfo.label}
                            </span>
                          </div>
                          {isActive && <IconCheck className="h-4 w-4" />}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop View: Traditional Navbar */}
      <div className="hidden md:flex w-fit justify-center">
        <NavigationMenu viewport={false} delayDuration={200}>
          <NavigationMenuList className="flex-nowrap gap-1 whitespace-nowrap rtl:flex-row-reverse">
            {/* Left Navbar Items */}
            {leftNavbarItems?.map((item, index) => {
              if (item.children && item.children.length > 0) {
                return (
                  <NavigationMenuItem key={`left-${index}`}>
                    <NavigationMenuTrigger className="px-2" onClick={() => { router.push(`/${locale}/${(item.URL || '').replace(/^\//, '')}`) }}>
                      <div className="flex items-center gap-2">
                        <span>{item.text}</span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="border border-border rounded-xl">
                      <ul className={cn(
                        "flex flex-col max-h-[calc(100vh-100px)] p-4 w-max h-auto",
                        isRTL ? "text-right flex-wrap-reverse" : "text-left flex-wrap"
                      )}>
                        {item.children.map((child, childIndex) => (
                          <ListItem
                            key={`child-${childIndex}`}
                            title={child.text}
                            href={`/${locale}/${(child.URL || '').replace(/^\//, '')}`}
                          >
                            {/* {child.variant} */}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              }
              return (
                <NavigationMenuItem key={`left-${index}`} className="flex justify-center items-center">
                  <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "px-2")}>
                    <Link href={`/${locale}/${(item.URL || '').replace(/^\//, '')}`} className="flex items-center gap-2">
                      <span>{item.text}</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}

            {/* Theme Toggle */}
            {showTheme && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <button
                    className={cn(navigationMenuTriggerStyle(), "cursor-pointer px-2")}
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    <div className="flex items-center gap-2 h-4 w-4">
                      <IconSun
                        className="
      absolute
      rotate-0 scale-100
      dark:-rotate-90 dark:scale-0
    "
                      />
                      <IconMoon
                        className="
      absolute
      rotate-90 scale-0
      dark:rotate-0 dark:scale-100
    "
                      />
                      <span className="sr-only">{t('theme')}</span>
                    </div>
                  </button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}

            {/* Language Selector */}
            {showLanguage && languages && languages.length > 0 && (
              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-2">
                  <div className="flex items-center gap-2">
                    <IconLanguage className="h-4 w-4" />
                    <span className="sr-only">{t('language')}</span>
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 p-4">
                    {languages.map((language) => {
                      const languageInfo = languageLabels[language.code] || {
                        label: language.name || language.code.toUpperCase(),
                        flag: '🌐',
                      };
                      const isActive = language.code === currentLocale;
                      const localeConfig = getLocaleConfig(language.code);

                      return (
                        <li key={language.code}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={generateLocalizedPath(language.code)}
                              className={cn(
                                "flex items-center justify-between w-full rounded-md p-2 hover:bg-accent hover:text-accent-foreground",
                                isActive && "bg-accent text-accent-foreground"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <span>{languageInfo.flag}</span>
                                <span className={cn("text-sm", localeConfig.fontClass)}>
                                  {languageInfo.label}
                                </span>
                              </div>
                              {isActive && <IconCheck className="h-4 w-4" />}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}

            {/* Right Navbar Items */}
            {rightNavbarItems?.map((item, index) => {
              if (item.children && item.children.length > 0) {
                return (
                  <NavigationMenuItem key={`right-${index}`}>
                    <NavigationMenuTrigger className="px-2">
                      <div className="flex items-center gap-2">
                        {item.icon ? (
                          getIconForNavItem(item.text || '', item.icon)
                        ) : index === (rightNavbarItems?.length || 0) - 1 ? (
                          <IconUser className="h-4 w-4" />
                        ) : (
                          <IconBriefcase className="h-4 w-4" />
                        )}
                        <span>{item.text}</span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className={cn(
                        "grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]",
                        isRTL ? "text-right" : "text-left"
                      )}>
                        {item.children.map((child, childIndex) => (
                          <ListItem
                            key={`child-${childIndex}`}
                            title={child.text}
                            href={`/${locale}/${(child.URL || '').replace(/^\//, '')}`}
                          >
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              }
              return (
                <NavigationMenuItem key={`right-${index}`}>
                  <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "px-2")}>
                    <Link href={`/${locale}/${(item.URL || '').replace(/^\//, '')}`} className="flex items-center gap-2">
                      {item.icon ? (
                        getIconForNavItem(item.text || '', item.icon)
                      ) : index === (rightNavbarItems?.length || 0) - 1 ? (
                        <IconUser className="h-4 w-4" />
                      ) : (
                        <IconBriefcase className="h-4 w-4" />
                      )}
                      <span>{item.text}</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  )
}

function MobileNavItem({ item, locale, onClose }: { item: NavbarItem, locale: string, onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [animation, setAnimation] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const { isRTL } = getLocaleConfig(locale);
  const router = useRouter();

  if (hasChildren) {
    return (
      <div className="flex flex-col gap-2">
        <div
          className="flex items-center justify-between px-3 py-3 rounded-md hover:bg-accent cursor-pointer"
          onClick={(e) => {
            onClose?.()
            router.push(`/${locale}/${(item.URL || '').replace(/^\//, '')}`)
          }}
        >
          <div className="flex items-center gap-2 font-medium">
            {getIconForNavItem(item.text || '', item.icon)}
            <span>{item.text}</span>
          </div>
          <button className="rounded-full p-1.5 border border-border hover:border-primary 
             text-muted-foreground hover:text-primary hover:bg-primary/10 
             active:scale-95 transition-all duration-200"
            onPointerDownCapture={(e) => e.stopPropagation()}

            onClick={(e) => {
              e.stopPropagation()
              setIsOpen((prev) => {
                return !prev
              })
            }}>

            <IconPlus className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} />
          </button>
        </div>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className={cn(
                "flex flex-col gap-2 pb-2",
                isRTL ? "border-r mr-2 pr-4" : "border-l ml-2 pl-4"
              )}>
                {item.children?.map((child, i) => (
                  <Link
                    key={i}
                    href={`/${locale}/${(child.URL || '').replace(/^\//, '')}`}
                    onClick={onClose}
                    className="block px-3 py-3 text-sm hover:bg-accent rounded-md transition-colors text-right"
                  >
                    <span style={{ unicodeBidi: "isolate", direction: "ltr" }}>
                      {child.text}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <Link
      href={`/${locale}/${(item.URL || '').replace(/^\//, '')}`}
      onClick={onClose}
      className="flex items-center gap-2 px-3 py-3 rounded-md hover:bg-accent font-medium"
    >
      {getIconForNavItem(item.text || '', item.icon)}
      <span>{item.text}</span>
    </Link>
  )
}
