'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/components/elements/button';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';

export function NotFound() {
  const locale = useLocale();
  const t = useTranslations('notFound');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
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

        <div className="flex flex-col gap-2 md:flex-row">
          <Button as={Link} href="/" variant="primary" className="w-full">
            {t('goHome')}
          </Button>
          <Button
            as={Link}
            href={`/${locale}/blog`}
            variant="outline"
            className="w-full"
          >
            {t('browseBlog')}
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>{t('supportMessage')}</p>
        </div>
      </div>
    </div>
  );
}
