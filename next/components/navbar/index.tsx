'use client';

import { FloatingNavbar } from './floating-navbar';

export function Navbar({ data, locale }: { data: any; locale: string }) {
  // Add safety checks to prevent errors during SSR
  if (!data || !data.left_navbar_items) {
    return null;
  }

  return (
    <FloatingNavbar
      locale={locale}
      leftNavbarItems={data.left_navbar_items || []}
      rightNavbarItems={data.right_navbar_items || []}
      logo={data.logo}
      showTheme={data.theme}
      showLanguage={data.language}
    />
  );
}
