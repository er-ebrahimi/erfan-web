# Internationalization (i18n) and Font Setup Documentation

## Overview

This project uses Next.js with `next-intl` for internationalization and conditional font application based on locale. The setup supports multiple languages with appropriate font rendering for each locale.

## Current Setup

### Font Strategy

- **English/French**: System fonts (Inter, system-ui, sans-serif)
- **Farsi**: IranSans font for proper Persian text rendering
- **Numbers**: Display with appropriate fonts based on locale

## Architecture

### 1. Next-intl Configuration

#### Routing Configuration (`i18n/routing.ts`)

```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr', 'fa'],
  defaultLocale: 'en',
});
```

#### Request Configuration (`i18n/request.ts`)

```typescript
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const validLocale = locale || 'en';

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
  };
});
```

#### Middleware (`middleware.ts`)

```typescript
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(fa|fr|en)/:path*'],
};
```

### 2. Unified Locale Configuration

#### Font and RTL Configuration (`lib/fonts.ts`)

```typescript
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

// Font configuration for different locales
export const getFontForLocale = (locale: string) => {
  switch (locale) {
    case 'fa':
      return iranSans;
    default:
      return null; // Use system fonts for English and French
  }
};

// RTL language detection
export const isRTLLocale = (locale: string): boolean => {
  const rtlLocales = ['fa', 'ar', 'he', 'ur']; // Add more RTL languages as needed
  return rtlLocales.includes(locale);
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
```

### 3. Layout Structure

#### Root Layout (`app/layout.tsx`)

- Minimal root layout without font application
- Handles hydration warnings

#### Locale Layout (`app/[locale]/layout.tsx`)

- Applies fonts conditionally based on locale
- Uses `getFontForLocale()` to determine appropriate font
- Wraps content with `NextIntlClientProvider`

### 4. Translation Files

#### Structure (`messages/`)

```
messages/
├── en.json    # English translations
├── fr.json    # French translations
└── fa.json    # Farsi translations
```

#### Example Translation File (`messages/en.json`)

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "save": "Save"
  },
  "navigation": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  }
}
```

## How to Add a New Language

### Step 1: Update Routing Configuration

1. **Add locale to `i18n/routing.ts`**:

```typescript
export const routing = defineRouting({
  locales: ['en', 'fr', 'fa', 'ar'], // Add new locale
  defaultLocale: 'en',
});
```

2. **Update middleware matcher in `middleware.ts`**:

```typescript
export const config = {
  matcher: ['/', '/(fa|fr|en|ar)/:path*'], // Add new locale
};
```

### Step 2: Create Translation File

Create `messages/ar.json` (for Arabic example):

```json
{
  "common": {
    "loading": "جاري التحميل...",
    "error": "خطأ",
    "success": "نجح",
    "cancel": "إلغاء",
    "save": "حفظ"
  },
  "navigation": {
    "home": "الرئيسية",
    "about": "حول",
    "contact": "اتصل"
  }
}
```

### Step 3: Update Language Components

1. **Update `components/language-selector.tsx`**:

```typescript
const languageLabels: Record<string, { label: string; flag: string }> = {
  en: { label: 'English', flag: '🇺🇸' },
  fr: { label: 'Français', flag: '🇫🇷' },
  fa: { label: 'فارسی', flag: '🇮🇷' },
  ar: { label: 'العربية', flag: '🇸🇦' }, // Add new language
};
```

2. **Update `components/locale-switcher.tsx`**:

```typescript
const languageLabels: Record<string, string> = {
  en: 'EN',
  fr: 'FR',
  fa: 'فا',
  ar: 'عر', // Add new language
};
```

### Step 4: Test the New Language

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/ar` (or your new locale) and you need to add that in Strapi too
3. Verify translations and font rendering

## How to Add a New Font for a Language

### Step 1: Add Font File

1. Place the font file in `fonts/` directory
2. Ensure it's a web-compatible format (`.woff2`, `.woff`, `.ttf`)

### Step 2: Update Font Configuration

1. **Add font definition in `lib/fonts.ts`**:

```typescript
// Add new font for Arabic
export const arabicFont = localFont({
  src: '../fonts/ArabicFont.woff2',
  variable: '--font-arabic',
  display: 'swap',
  preload: true,
  weight: '400 500 600 700',
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

// Update getFontForLocale function
export const getFontForLocale = (locale: string) => {
  switch (locale) {
    case 'fa':
      return iranSans;
    case 'ar':
      return arabicFont; // Add new font
    default:
      return null; // Use system fonts
  }
};
```

### Step 3: Update CSS (if needed)

If the new font needs special CSS rules, add them to `app/globals.css`:

```css
.font-arabic {
  font-family:
    'ArabicFont',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif !important;
}
```

### Step 4: Update Tailwind Config (if needed)

If you want to use the font in Tailwind classes, update `tailwind.config.ts`:

```typescript
fontFamily: {
  'iran-sans': ['IRANSans', 'system-ui', 'sans-serif'],
  'arabic': ['ArabicFont', 'system-ui', 'sans-serif'], // Add new font
  sans: ['Inter', 'system-ui', 'sans-serif'],
},
```

## Usage in Components

### Using Translations

```typescript
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('common');

  return (
    <div>
      <h1>{t('loading')}</h1>
      <p>{t('error')}</p>
    </div>
  );
}
```

### Using Locale Information

```typescript
import { useLocale } from 'next-intl';

export function MyComponent() {
  const locale = useLocale();

  return (
    <div>
      <p>Current locale: {locale}</p>
    </div>
  );
}
```

### Using Unified Locale Configuration

#### Server-Side Usage (Server Components, Layouts, Pages)

```typescript
// app/[locale]/layout.tsx - Server Component
import { getLocaleConfig } from '@/lib/fonts';

export default async function LocaleLayout({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const localeConfig = getLocaleConfig(locale);

  return (
    <html dir={localeConfig.direction}>
      <body className={localeConfig.fontClass}>
        <div className={localeConfig.rtlClasses}>
          <h1>Server-side RTL: {localeConfig.isRTL ? 'RTL' : 'LTR'}</h1>
          <p className={`${localeConfig.spacingPrefix}-4`}>
            Server-side spacing: {localeConfig.spacingPrefix}
          </p>
        </div>
      </body>
    </html>
  );
}
```

```typescript
// app/[locale]/page.tsx - Server Component
import { getLocaleConfig } from '@/lib/fonts';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const localeConfig = getLocaleConfig(locale);

  return (
    <div className={localeConfig.rtlClasses}>
      <h1 className={localeConfig.fontClass}>
        Server Component - Locale: {locale}
      </h1>
      <p>Direction: {localeConfig.direction}</p>
      <p>Is RTL: {localeConfig.isRTL ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

#### Client-Side Usage (Client Components)

```typescript
// components/MyClientComponent.tsx - Client Component
'use client';

import { useLocaleConfig } from '@/hooks/use-locale-config';

export function MyClientComponent() {
  const localeConfig = useLocaleConfig();

  return (
    <div className={localeConfig.rtlClasses}>
      <h1 className={localeConfig.fontClass}>
        {localeConfig.isRTL ? 'مرحبا' : 'Hello'}
      </h1>
      <p className={`${localeConfig.spacingPrefix}-4`}>
        Client-side spacing: {localeConfig.spacingPrefix}
      </p>
      <button className={`${localeConfig.paddingPrefix}-4`}>
        RTL-aware padding
      </button>
    </div>
  );
}
```

#### Manual Locale Configuration (Both Server & Client)

```typescript
// Server or Client Component
import { getLocaleConfig } from '@/lib/fonts';

// For a specific locale
const config = getLocaleConfig('fa');
console.log(config.isRTL); // true
console.log(config.direction); // 'rtl'
console.log(config.fontClass); // 'font-iran-sans'
console.log(config.spacingPrefix); // 'mr'
console.log(config.paddingPrefix); // 'pr'

// For English locale
const enConfig = getLocaleConfig('en');
console.log(enConfig.isRTL); // false
console.log(enConfig.direction); // 'ltr'
console.log(enConfig.fontClass); // 'font-sans'
console.log(enConfig.spacingPrefix); // 'ml'
console.log(enConfig.paddingPrefix); // 'pl'
```

#### Advanced Server-Side Example

```typescript
// lib/server-utils.ts - Server-side utility
import { getLocaleConfig } from '@/lib/fonts';

export function generateLocaleMetadata(locale: string) {
  const config = getLocaleConfig(locale);

  return {
    htmlLang: locale,
    htmlDir: config.direction,
    bodyClass: `${config.fontClass} ${config.rtlClasses}`,
    isRTL: config.isRTL,
    // Generate RTL-aware CSS classes
    containerClass: config.isRTL ? 'rtl-container' : 'ltr-container',
    textClass: config.textAlign,
  };
}

// Usage in layout
export default async function Layout({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const metadata = generateLocaleMetadata(locale);

  return (
    <html lang={metadata.htmlLang} dir={metadata.htmlDir}>
      <body className={metadata.bodyClass}>
        <div className={metadata.containerClass}>
          <h1 className={metadata.textClass}>Content</h1>
        </div>
      </body>
    </html>
  );
}
```

### Conditional Font and RTL Application

Both font and RTL are automatically applied based on locale through the unified configuration system. No manual intervention needed in components.

## Best Practices

### 1. Translation Keys

- Use nested objects for organization: `common.loading`, `navigation.home`
- Keep keys descriptive and consistent
- Use camelCase for keys

### 2. Font Management

- Only apply custom fonts when necessary (for languages with special requirements)
- Use system fonts for Latin-based languages
- Ensure fallback fonts are always specified

### 3. RTL Support

- Use `dir="rtl"` attribute for RTL languages
- Test layout with RTL content
- Consider text alignment and spacing

### 4. Performance

- Preload important fonts
- Use `display: 'swap'` for better loading experience
- Minimize font file sizes

## Troubleshooting

### Common Issues

1. **Font not loading**: Check font file path and format
2. **Translations not showing**: Verify translation file exists and has correct structure
3. **Hydration errors**: Ensure `suppressHydrationWarning` is applied to body element
4. **Build errors**: Check that all locales are properly configured

### Debug Steps

1. Check browser console for errors
2. Verify translation files are in correct location
3. Test with different locales
4. Check font loading in Network tab

## File Structure

```
next/
├── app/
│   ├── [locale]/
│   │   └── layout.tsx          # Locale-specific layout
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── language-selector.tsx   # Language selection component
│   └── locale-switcher.tsx     # Locale switching component
├── i18n/
│   ├── routing.ts              # Routing configuration
│   └── request.ts              # Request configuration
├── lib/
│   └── fonts.ts                # Font configuration
├── messages/
│   ├── en.json                 # English translations
│   ├── fr.json                 # French translations
│   └── fa.json                 # Farsi translations
├── fonts/
│   └── IRANSansWeb.ttf         # Font files
├── middleware.ts               # Next.js middleware
└── next.config.mjs             # Next.js configuration
```

This setup provides a robust, scalable internationalization system that can easily accommodate new languages and fonts while maintaining clean code organization.
