import type { Metadata, Viewport } from 'next';
import { getLocale } from 'next-intl/server';

import './globals.css';

import { SlugProvider } from './context/SlugContext';
import { GlobalErrorBoundary } from '@/components/global-error-boundary';

export const metadata: Metadata = {
  title: 'ErfanWeb',
  description: 'Professional web development services',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
      </body>
    </html>
  );
}
