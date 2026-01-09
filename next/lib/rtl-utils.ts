/**
 * RTL (Right-to-Left) utility functions for Persian language support
 */

export type Locale = 'en' | 'fr' | 'fa';

/**
 * Check if a locale is RTL
 */
export function isRTL(locale: string): boolean {
  return locale === 'fa';
}

/**
 * Get text direction for a locale
 */
export function getDirection(locale: string): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}

/**
 * Get text alignment class for a locale
 */
export function getTextAlignClass(locale: string): string {
  return isRTL(locale) ? 'text-right' : 'text-left';
}

/**
 * Get font class for a locale
 */
export function getFontClass(locale: string): string {
  return isRTL(locale) ? 'font-iran-sans' : 'font-sans';
}

/**
 * Get margin/padding classes that respect RTL
 */
export function getSpacingClasses(locale: string, baseClass: string): string {
  if (!isRTL(locale)) return baseClass;

  // Convert LTR classes to RTL equivalents
  return baseClass
    .replace(/\bml-\d+\b/g, (match) => match.replace('ml-', 'mr-'))
    .replace(/\bmr-\d+\b/g, (match) => match.replace('mr-', 'ml-'))
    .replace(/\bpl-\d+\b/g, (match) => match.replace('pl-', 'pr-'))
    .replace(/\bpr-\d+\b/g, (match) => match.replace('pr-', 'pl-'))
    .replace(/\btext-left\b/g, 'text-right')
    .replace(/\btext-right\b/g, 'text-left');
}

/**
 * Get all locale-specific classes
 */
export function getLocaleClasses(locale: string): {
  direction: 'ltr' | 'rtl';
  fontClass: string;
  textAlignClass: string;
  isRTL: boolean;
} {
  return {
    direction: getDirection(locale),
    fontClass: getFontClass(locale),
    textAlignClass: getTextAlignClass(locale),
    isRTL: isRTL(locale),
  };
}
