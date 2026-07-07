import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ViewTransitions } from 'next-view-transitions';
import { notFound } from 'next/navigation';
import React from 'react';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/context/cart-context';
import { routing } from '@/i18n/routing';
import { getDirection } from '@/lib/rtl-utils';
import fetchContentType from '@/lib/strapi/fetchContentType';

export const revalidate = 60;

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;
  if (!routing.locales.includes(locale as any)) {
    console.error(`[LocaleLayout] Invalid locale "${locale}" - calling notFound()`);
    notFound();
  }

  const direction = getDirection(locale);

  const { children } = props;

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  let pageData;
  try {
    pageData = await fetchContentType('global', {}, true);
  } catch (error) {
    console.error('Failed to fetch global content type:', error);
    // Provide fallback data structure
    pageData = {
      navbar: {
        left_navbar_items: [],
        right_navbar_items: [],
        logo: null,
        theme: false,
        language: false,
      },
      footer: null,
    };
  }

  // Ensure pageData has required structure
  if (!pageData) {
    pageData = {
      navbar: {
        left_navbar_items: [],
        right_navbar_items: [],
        logo: null,
        theme: false,
        language: false,
      },
      footer: null,
    };
  }
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ViewTransitions>
        <ThemeProvider
          attribute="class"
          defaultTheme={process.env.NEXT_PUBLIC_DEFAULT_THEME || 'system'}
          enableSystem
          disableTransitionOnChange
        >
            <CartProvider>
              <div
                className="bg-background text-foreground antialiased h-full w-full"
                dir={direction}
              >
                <Navbar
                  data={pageData.navbar}
                  locale={locale}
                  languages={pageData.languages}
                />
                <main id="main-content">
                  {children}
                </main>
                <Footer data={pageData.footer} locale={locale} />
              </div>
            </CartProvider>
        </ThemeProvider>
      </ViewTransitions>
    </NextIntlClientProvider>
  );
}
