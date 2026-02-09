import localFont from 'next/font/local';

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


export const systemFont = {
  className: 'font-sans',
  variable: '--font-system',
};

// Font configuration for different locales
export const getFontForLocale = (locale: string) => {
  switch (locale) {
    case 'fa':
      return iranSans;
    default:
      return systemFont;
  }
};

// RTL language detection
export const isRTLLocale = (locale: string): boolean => {
  const rtlLocales = ['fa', 'ar', 'he', 'ur'];
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
    fontClass: font.className,
    rtlClasses: isRTL ? 'rtl text-right' : 'ltr text-left',
    spacingPrefix: isRTL ? 'mr' : 'ml',
    paddingPrefix: isRTL ? 'pr' : 'pl',
  };
};
