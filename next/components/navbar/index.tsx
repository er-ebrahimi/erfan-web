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
  // Add safety checks to prevent errors during SSR
  if (!data || !data.left_navbar_items) {
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
      "fixed z-50 bg-background w-fit max-w-[95vw] overflow-x-auto md:overflow-visible no-scrollbar transition-all duration-300 border border-solid",
      // Mobile: Top Right
      "top-4 right-4 m-0 left-auto p-2 rounded-full shadow-md",
      // Desktop: Top Center
      "md:m-4 md:top-2 md:left-1/2 md:-translate-x-1/2 md:px-3 md:py-2 md:rounded-3xl md:shadow-none"
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
