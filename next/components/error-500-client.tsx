'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/components/elements/button';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { useLocaleConfig } from '@/hooks/use-locale-config';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface Error500ClientProps {
  onRetry?: () => void;
}

export function Error500Client({ onRetry }: Error500ClientProps) {
  const locale = useLocale();

  const t = useTranslations('serverError');
  const localeConfig = useLocaleConfig();
  const theme = useTheme();
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-background",localeConfig.rtlClasses, localeConfig.fontClass)}>
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <Heading as="h1" className="text-6xl font-bold text-primary mb-4">
            {t('title')}
          </Heading>
          <Heading as="h2" className="text-2xl font-semibold mb-4">
            {t('heading')}
          </Heading>
          <Subheading className="text-muted-foreground mb-8">
            {t('description')}
          </Subheading>
        </div>

        <div className="space-y-4">
          <Button as={Link} href="/" variant="primary" className="w-full">
            {t('goHome')}
          </Button>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="w-full">
              {t('tryAgain')}
            </Button>
          )}
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>{t('supportMessage')}</p>
        </div>
      </div>
    </div>
  );
}
