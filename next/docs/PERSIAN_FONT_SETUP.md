# Persian Font and RTL Support Setup

This document explains how to use Persian fonts and RTL (Right-to-Left) support in your Next.js application.

## 🎯 What's Included

- **IRANSans Font**: Persian font loaded from `fonts/IRANSansWeb.ttf`
- **RTL Support**: Automatic right-to-left text alignment for Persian
- **Utility Functions**: Helper functions for locale-based styling
- **Tailwind Classes**: Custom utility classes for Persian text

## 🚀 Quick Usage

### 1. Basic Persian Text

```tsx
import { LocaleWrapper } from '@/components/locale-wrapper';

export function MyComponent({ locale }: { locale: string }) {
  return (
    <LocaleWrapper locale={locale}>
      <h1>سلام! این یک متن فارسی است</h1>
      <p>این متن به صورت خودکار از فونت فارسی استفاده می‌کند.</p>
    </LocaleWrapper>
  );
}
```

### 2. Using Utility Functions

```tsx
import { getLocaleClasses } from '@/lib/rtl-utils';

export function MyComponent({ locale }: { locale: string }) {
  const { fontClass, textAlignClass, isRTL } = getLocaleClasses(locale);

  return (
    <div className={`${fontClass} ${textAlignClass}`}>
      <h1>{isRTL ? 'متن فارسی' : 'English Text'}</h1>
    </div>
  );
}
```

### 3. Manual Font Application

```tsx
// Using Tailwind class
<div className="font-iran-sans">
  متن فارسی با فونت IRANSans
</div>

// Using CSS variable
<div style={{ fontFamily: 'var(--font-iran-sans)' }}>
  متن فارسی با فونت IRANSans
</div>
```

## 🎨 Available Classes

### Font Classes

- `font-iran-sans` - Apply IRANSans font
- `font-persian` - Alternative Persian font class

### RTL Classes

- `text-right-rtl` - Right-aligned text for RTL
- `text-left-rtl` - Left-aligned text for RTL
- `mr-rtl` - Right margin for RTL
- `ml-rtl` - Left margin for RTL

### Direction Classes

- `[dir="rtl"]` - RTL direction
- `[dir="ltr"]` - LTR direction

## 🔧 Configuration Files

### Font Configuration (`lib/fonts.ts`)

```typescript
export const iranSans = localFont({
  src: '../fonts/IRANSansWeb.ttf',
  variable: '--font-iran-sans',
  display: 'swap',
  preload: true,
});
```

### RTL Utilities (`lib/rtl-utils.ts`)

```typescript
export function getLocaleClasses(locale: string) {
  // Returns direction, fontClass, textAlignClass, isRTL
}
```

### Tailwind Config (`tailwind.config.ts`)

```typescript
fontFamily: {
  'iran-sans': ['var(--font-iran-sans)', 'system-ui', 'sans-serif'],
}
```

## 📱 Responsive RTL Support

```tsx
<div
  className="
  text-left md:text-right-rtl
  ml-4 md:mr-rtl
  font-iran-sans
"
>
  متن فارسی که در موبایل چپ‌چین و در دسکتاپ راست‌چین است
</div>
```

## 🌐 Locale-Based Styling

```tsx
import { getSpacingClasses } from '@/lib/rtl-utils';

export function ResponsiveComponent({ locale }: { locale: string }) {
  return (
    <div className={getSpacingClasses(locale, 'ml-4 mr-2 pl-6 pr-3')}>
      {/* Spacing automatically adjusts for RTL */}
    </div>
  );
}
```

## 🎯 Best Practices

1. **Use LocaleWrapper**: Wrap components that need RTL support
2. **Test Both Directions**: Always test in both LTR and RTL modes
3. **Consistent Spacing**: Use utility functions for consistent spacing
4. **Font Loading**: The font is preloaded for better performance
5. **Fallback Fonts**: System fonts are used as fallbacks

## 🐛 Troubleshooting

### Font Not Loading

- Check if the font file exists in `fonts/IRANSansWeb.ttf`
- Verify the path in `lib/fonts.ts`
- Check browser developer tools for font loading errors

### RTL Not Working

- Ensure you're using the correct locale (`fa` for Persian)
- Check if `dir="rtl"` is applied to the container
- Verify CSS classes are applied correctly

### Text Alignment Issues

- Use `text-right-rtl` for Persian text
- Check if parent containers have conflicting text-align styles
- Use the utility functions for consistent alignment

## 📚 Examples

See `components/examples/persian-text-example.tsx` for a complete example of Persian text rendering with RTL support.

## 🔗 Related Files

- `lib/fonts.ts` - Font configuration
- `lib/rtl-utils.ts` - RTL utility functions
- `components/locale-wrapper.tsx` - Locale wrapper component
- `app/globals.css` - Global styles and RTL support
- `tailwind.config.ts` - Tailwind configuration
