import type { Metadata, Viewport } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getLocale } from 'next-intl/server';

import './globals.css';

import { SlugProvider } from './context/SlugContext';
import { GlobalErrorBoundary } from '@/components/global-error-boundary';

const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'site-a';

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: `/favicon-sets/${siteId}/favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
      { url: `/favicon-sets/${siteId}/favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
    ],
    shortcut: `/favicon-sets/${siteId}/favicon.ico`,
    apple: `/favicon-sets/${siteId}/apple-touch-icon.png`,
  },
};

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
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GlobalErrorBoundary>
          <SlugProvider>{children}</SlugProvider>
        </GlobalErrorBoundary>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}
