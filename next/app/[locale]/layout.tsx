import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ViewTransitions } from 'next-view-transitions';
import { notFound } from 'next/navigation';
import React from 'react';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth-context';
import { CartProvider } from '@/context/cart-context';
import { routing } from '@/i18n/routing';
import { getFontForLocale } from '@/lib/fonts';
import { getLocaleClasses } from '@/lib/rtl-utils';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { cn } from '@/lib/utils';

// Default Global SEO for pages without them
export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const pageData = await fetchContentType(
    'global',
    {
      filters: { locale: params.locale },
      populate: 'seo.metaImage',
    },
    true
  );

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const { fontClass, direction } = getLocaleClasses(locale);
  const font = getFontForLocale(locale);

  const { children } = props;

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  let pageData;
  try {
    pageData = await fetchContentType('global', { filters: { locale } }, true);
  } catch (error) {
    console.error('Failed to fetch global content type:', error);
    // Provide fallback data structure
    pageData = {
      navbar: {
        left_navbar_items: [],
        right_navbar_items: [],
        logo: null,
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
      },
      footer: null,
    };
  }
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ViewTransitions>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <div
                className={cn(
                  font?.className || 'font-sans',
                  fontClass,
                  'bg-background text-foreground antialiased h-full w-full'
                )}
                dir={direction}
              >
                <Navbar
                  data={pageData.navbar}
                  locale={locale}
                  languages={pageData.languages}
                />
                {children}
                <Footer data={pageData.footer} locale={locale} />
              </div>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </ViewTransitions>
    </NextIntlClientProvider>
  );
}
