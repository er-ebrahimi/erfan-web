import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

// English/French font configuration
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Persian font configuration
export const iranSans = localFont({
  src: '../fonts/IRANSansWeb.ttf',
  variable: '--font-iran-sans',
  display: 'swap',
  preload: true,
  weight: '400 500 600 700 800 900',
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
});

// Font configuration for different locales
export const getFontForLocale = (locale: string) => {
  switch (locale) {
    case 'fa':
      return iranSans;
    default:
      return inter; // Use Inter for English and French
  }
};

// RTL language detection
export const isRTLLocale = (locale: string): boolean => {
  const rtlLocales = ['fa', 'ar', 'he', 'ur']; // Add more RTL languages as needed
  return rtlLocales.includes(locale);
};

// Get direction for locale
export const getDirectionForLocale = (locale: string): 'ltr' | 'rtl' => {
  return isRTLLocale(locale) ? 'rtl' : 'ltr';
};

// Get text alignment for locale
export const getTextAlignForLocale = (locale: string): string => {
  return isRTLLocale(locale) ? 'text-right' : 'text-left';
};

// Unified locale configuration
export const getLocaleConfig = (locale: string) => {
  const font = getFontForLocale(locale);
  const isRTL = isRTLLocale(locale);

  return {
    font,
    direction: getDirectionForLocale(locale),
    textAlign: getTextAlignForLocale(locale),
    isRTL,
    fontClass: font?.className || 'font-sans',
    // Additional utility classes
    rtlClasses: isRTL ? 'rtl text-right' : 'ltr text-left',
    // Spacing utilities for RTL
    spacingPrefix: isRTL ? 'mr' : 'ml',
    paddingPrefix: isRTL ? 'pr' : 'pl',
  };
};
