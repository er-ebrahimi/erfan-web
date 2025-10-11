import type { Viewport } from 'next';

import './globals.css';

import { SlugProvider } from './context/SlugContext';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#06b6d4' },
    { media: '(prefers-color-scheme: dark)', color: '#06b6d4' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SlugProvider>{children}</SlugProvider>
      </body>
    </html>
  );
}
