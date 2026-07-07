import type { Metadata, Viewport } from 'next';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { getLocale } from 'next-intl/server';

import './globals.css';
import './themes.css';

import { LocaleScript } from '@/components/locale-script';
import { GlobalErrorBoundary } from '@/components/global-error-boundary';
import { geistSans, getLanguageDir, getLanguageFont, iranSans } from '@/lib/fonts';

import { SlugProvider } from './context/SlugContext';

const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'site-a';

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: `/${siteId}/favicon-sets/favicon-32x32.png`, sizes: '32x32', type: 'image/png' },
      { url: `/${siteId}/favicon-sets/favicon-16x16.png`, sizes: '16x16', type: 'image/png' },
    ],
    shortcut: `/${siteId}/favicon-sets/favicon.ico`,
    apple: `/${siteId}/favicon-sets/apple-touch-icon.png`,
  },
};

export function generateViewport(): Viewport {
  const themeVars: Record<string, { light: string; dark: string }> = {
    'site-a': { light: '#bdac62', dark: '#bdac62' },
    'painfoolsstudio': { light: '#3b82f6', dark: '#60a5fa' },
  };
  const colors = themeVars[siteId] ?? themeVars['site-a'];

  return {
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: colors.light },
      { media: '(prefers-color-scheme: dark)', color: colors.dark },
    ],
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const fontVariable = getLanguageFont(locale);
  const fontDataAttribute = fontVariable.replace('--font-', '');
  return (
    <html lang={locale} dir={getLanguageDir(locale)} className={`theme-${siteId}`} suppressHydrationWarning>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
      <body
        data-font={fontDataAttribute}
        className={`${geistSans.variable} ${iranSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <LocaleScript />
        <GlobalErrorBoundary>
          <SlugProvider>{children}</SlugProvider>
        </GlobalErrorBoundary>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}
