'use client';

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
} from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { BackendLanguageSelector } from '../backend-language-selector';
import { FloatingDock } from '@/components/ui/floating-dock';

type Props = {
  leftNavbarItems: {
    URL: string;
    text: string;
    target?: string;
    icon?: string; // Add icon field from Strapi
  }[];
  rightNavbarItems: {
    URL: string;
    text: string;
    target?: string;
    icon?: string; // Add icon field from Strapi
  }[];
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

// Icon mapping for Strapi icon field or text-based fallback
const getIconForNavItem = (text: string, iconName?: string) => {
  // If Strapi provides an icon name, use it
  if (iconName) {
    switch (iconName) {
      case 'IconHome':
        return <IconHome className="h-full w-full" />;
      case 'IconArticle':
        return <IconArticle className="h-full w-full" />;
      case 'IconEdit':
        return <IconEdit className="h-full w-full" />;
      case 'IconMail':
        return <IconMail className="h-full w-full" />;
      case 'IconHelp':
        return <IconHelp className="h-full w-full" />;
      case 'IconQuestionMark':
        return <IconQuestionMark className="h-full w-full" />;
      case 'IconUser':
        return <IconUser className="h-full w-full" />;
      case 'IconBriefcase':
        return <IconBriefcase className="h-full w-full" />;
      case 'IconSettings':
        return <IconSettings className="h-full w-full" />;
      default:
        break;
    }
  }
  const lowercaseText = text.toLowerCase();
  if (lowercaseText.includes('home') || lowercaseText.includes('accueil')) {
    return <IconHome className="h-full w-full" />;
  }
  if (lowercaseText.includes('blog') || lowercaseText.includes('article')) {
    return <IconArticle className="h-full w-full" />;
  }
  if (lowercaseText.includes('about') || lowercaseText.includes('à propos')) {
    return <IconUser className="h-full w-full" />;
  }
  if (
    lowercaseText.includes('service') ||
    lowercaseText.includes('work') ||
    lowercaseText.includes('portfolio')
  ) {
    return <IconBriefcase className="h-full w-full" />;
  }
  if (lowercaseText.includes('contact')) {
    return <IconMail className="h-full w-full" />;
  }
  if (lowercaseText.includes('faq') || lowercaseText.includes('help')) {
    return <IconHelp className="h-full w-full" />;
  }
  if (lowercaseText.includes('settings') || lowercaseText.includes('config')) {
    return <IconSettings className="h-full w-full" />;
  }
  return <IconBriefcase className="h-full w-full" />;
};

export const FloatingNavbar = ({
  leftNavbarItems,
  rightNavbarItems,
  logo,
  locale,
  showTheme = false,
  showLanguage = false,
  languages = [],
}: Props) => {
  console.log("🚀 ~ FloatingNavbar ~ showTheme:", showTheme)
  console.log("🚀 ~ FloatingNavbar ~ leftNavbarItems:", leftNavbarItems)
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !leftNavbarItems || !Array.isArray(leftNavbarItems)) {
    return null;
  }

  const dockItems = [
    ...leftNavbarItems.map((item) => ({
      title: item.text || 'Navigation',
      icon: getIconForNavItem(item.text || '', item.icon),
      href: `/${locale}${item.URL || '/'}`,
    })),
    ...(showTheme
      ? [
          {
            title: 'Toggle Theme',
            icon:
              theme === 'dark' ? (
                <IconSun className="h-full w-full" />
              ) : (
                <IconMoon className="h-full w-full" />
              ),
            href: '#',
            onClick: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
          },
        ]
      : []),
    ...(showLanguage
      ? [
          {
            title: 'Change Language',
            icon: <IconLanguage className="h-full w-full" />,
            href: '#',
            onClick: () => {
              setShowLanguageSelector(!showLanguageSelector);
            },
          },
        ]
      : []),
    ...(rightNavbarItems && Array.isArray(rightNavbarItems)
      ? rightNavbarItems
      : []
    ).map((item, index) => ({
      title: item.text || 'Action',
      icon: item.icon ? (
        getIconForNavItem(item.text || '', item.icon)
      ) : index === (rightNavbarItems?.length || 0) - 1 ? (
        <IconUser className="h-full w-full" />
      ) : (
        <IconBriefcase className="h-full w-full" />
      ),
      href: `/${locale}${item.URL || '/'}`,
    })),
  ];

  return (
    <>
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock
          items={dockItems}
          desktopClassName="bg-card/80 bg-gray-50 backdrop-blur-md border border-border"
          mobileClassName="bg-card/80 backdrop-blur-md border border-border rounded-full"
        />
      </div>

      {/* Language Selector - Shows when language button is clicked */}
      {showLanguageSelector && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-card/90 backdrop-blur-md border border-border rounded-lg p-2 shadow-lg bg-muted dark:bg-primary/20">
            <BackendLanguageSelector
              languages={languages}
              onClose={() => setShowLanguageSelector(false)}
            />
          </div>
        </div>
      )}

      {/* Backdrop to close language selector */}
      {showLanguageSelector && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowLanguageSelector(false)}
        />
      )}
    </>
  );
};
