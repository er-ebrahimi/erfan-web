'use client';

import { NavigationNavbar } from './navigation-6-navbar';

export function Navbar({
  data,
  locale,
  languages,
}: {
  data: any;
  locale: string;
  languages?: any[];
}) {
  return <NavigationNavbar data={data} locale={locale} languages={languages} />;
}
