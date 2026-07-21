export const LOCALE = 'fa' as const;

export const BASE_PATH = `/${LOCALE}` as const;

export const ROUTES = {
  home: BASE_PATH,
  blog: `${BASE_PATH}/category/blog`,
  faq: `${BASE_PATH}/faq`,
} as const;

export const VIEWPORTS = {
  desktop: { width: 1280, height: 720 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
} as const;

export const NAV_ITEM_LABELS = {
  home: 'خانه',
  blog: 'وبلاگ',
  contact: 'تماس',
} as const;

export const ALTCHA_SELECTOR = 'altcha-widget';

export const TIMEOUTS = {
  altchaVerification: 30_000,
  navigation: 10_000,
  networkIdle: 5_000,
} as const;
