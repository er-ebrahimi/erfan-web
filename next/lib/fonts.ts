import localFont from 'next/font/local';

export const iranSans = localFont({
  src: [
    { path: '../fonts/fa/IRANSans_UltraLight.ttf', weight: '100', style: 'normal' },
    { path: '../fonts/fa/IRANSans_Light.ttf', weight: '300', style: 'normal' },
    { path: '../fonts/fa/IRANSansWeb.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/fa/IRANSans_Medium.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/fa/IRANSans_Bold.ttf', weight: '700', style: 'normal' },
    { path: '../fonts/fa/IRANSans_Black.ttf', weight: '900', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-iransans',
  fallback: ['system-ui', 'sans-serif'],
});

export const geistSans = localFont({
  src: [
    { path: '../fonts/en/Geist-Thin.ttf', weight: '100', style: 'normal' },
    { path: '../fonts/en/Geist-ExtraLight.ttf', weight: '200', style: 'normal' },
    { path: '../fonts/en/Geist-Light.ttf', weight: '300', style: 'normal' },
    { path: '../fonts/en/Geist-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/en/Geist-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/en/Geist-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/en/Geist-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../fonts/en/Geist-ExtraBold.ttf', weight: '800', style: 'normal' },
    { path: '../fonts/en/Geist-Black.ttf', weight: '900', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-geist-sans',
  fallback: ['system-ui', 'sans-serif'],
});

export const fontConfig: Record<string, { variable: string; dir: 'ltr' | 'rtl' }> = {
  fa: { variable: '--font-iransans', dir: 'rtl' },
  ar: { variable: '--font-iransans', dir: 'rtl' },
};

export function getLanguageFont(locale: string): string {
  return fontConfig[locale]?.variable || '--font-geist-sans';
}

export function getLanguageDir(locale: string): 'ltr' | 'rtl' {
  return fontConfig[locale]?.dir || 'ltr';
}

// Legacy config shape — kept for backward compatibility
export function getLocaleConfig(locale: string) {
  const dir = getLanguageDir(locale);
  const isRTL = dir === 'rtl';

  return {
    font: iranSans,
    direction: dir,
    textAlign: isRTL ? 'text-right' : 'text-left',
    isRTL,
    fontClass: isRTL ? 'font-iran-sans' : 'font-sans',
    rtlClasses: isRTL ? 'rtl text-right' : 'ltr text-left',
    spacingPrefix: isRTL ? 'mr' : 'ml',
    paddingPrefix: isRTL ? 'pr' : 'pl',
  };
}
