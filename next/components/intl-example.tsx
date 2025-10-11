'use client';

import { useLocale, useTranslations } from 'next-intl';

import { getLocaleConfig } from '@/lib/fonts';

/**
 * Example component showing how to use next-intl
 * This demonstrates translations, locale detection, and RTL support
 */
export function IntlExample() {
  const t = useTranslations('common');
  const locale = useLocale();
  const localeConfig = getLocaleConfig(locale);

  return (
    <div className={`p-6 ${localeConfig.rtlClasses}`}>
      <h1 className={`text-2xl font-bold mb-4 ${localeConfig.fontClass}`}>
        {t('welcome')} - {locale.toUpperCase()}
      </h1>

      <div className="space-y-4">
        <p className={localeConfig.fontClass}>
          <strong>{t('language')}:</strong> {locale}
        </p>

        <p className={localeConfig.fontClass}>
          <strong>{t('direction')}:</strong> {localeConfig.direction}
        </p>

        <p className={localeConfig.fontClass}>
          <strong>{t('isRTL')}:</strong> {localeConfig.isRTL ? 'Yes' : 'No'}
        </p>

        <p className={localeConfig.fontClass}>
          <strong>{t('fontClass')}:</strong> {localeConfig.fontClass}
        </p>

        <div className={`${localeConfig.spacingPrefix}-4 p-4 bg-muted rounded`}>
          <p className={localeConfig.fontClass}>
            {t('spacingExample')}: {localeConfig.spacingPrefix}-4
          </p>
        </div>

        <div className="flex gap-4">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
            {t('save')}
          </button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded">
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
