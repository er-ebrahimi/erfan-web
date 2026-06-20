import type { Metadata, Viewport } from 'next';
import { getLocale } from 'next-intl/server';

import './globals.css';

import { SlugProvider } from './context/SlugContext';
import { GlobalErrorBoundary } from '@/components/global-error-boundary';
import { getDirection } from '@/lib/rtl-utils';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#06b6d4' },
    { media: '(prefers-color-scheme: dark)', color: '#06b6d4' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} dir={getDirection(locale)} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GlobalErrorBoundary>
          <SlugProvider>{children}</SlugProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
