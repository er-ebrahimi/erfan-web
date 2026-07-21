'use client';

import { FloatingNavbar } from './floating-navbar';
import { NavbarMenu } from './navbar-menue';
import { cn } from '@/lib/utils';

export function Navbar({
  data,
  locale,
  languages,
}: {
  data: any;
  locale: string;
  languages?: any[];
}) {
  const leftItems = data?.left_navbar_items;
  const rightItems = data?.right_navbar_items;
  const hasNavbarContent =
    data?.logo ||
    data?.theme ||
    data?.language ||
    (Array.isArray(leftItems) && leftItems.length > 0) ||
    (Array.isArray(rightItems) && rightItems.length > 0);

  if (!hasNavbarContent) {
    return null;
  }

  return (
    // <FloatingNavbar
    //   locale={locale}
    //   leftNavbarItems={data.left_navbar_items || []}
    //   rightNavbarItems={data.right_navbar_items || []}
    //   logo={data.logo}
    //   showTheme={data.theme}
    //   showLanguage={data.language}
    //   languages={languages || []}
    // />
    <div className={cn(
      "fixed z-50 bg-background w-fit max-w-[95vw] overflow-x-auto md:overflow-visible no-scrollbar transition-all duration-300 border border-solid border-black/20 dark:border-white/20",
      // Mobile: Top Right
      "top-4 right-4 m-0 left-auto rounded-full shadow-md",
      // Desktop: Top Center
      " lg:right-auto lg:left-1/2 lg:-translate-x-1/2 lg:px-3 lg:py-2 lg:rounded-3xl lg:shadow-none "
    )}>
      <NavbarMenu
        locale={locale}
        leftNavbarItems={data.left_navbar_items || []}
        rightNavbarItems={data.right_navbar_items || []}
        logo={data.logo}
        showTheme={data.theme}
        showLanguage={data.language}
        languages={languages || []}
      />
    </div>
  );
}
