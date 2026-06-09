import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { format } from 'date-fns';
import { getTranslations } from 'next-intl/server';
import { Link } from 'next-view-transitions';

import Script from 'next/script';

import { Container } from '../container';
import DynamicZoneManager from '../dynamic-zone/manager';
import { StrapiImage } from '@/components/ui/strapi-image';
import { Article } from '@/types/types';
import { generateStructuredData } from '@/lib/shared/metadata';
import { cn } from '@/lib/utils';

export async function BlogLayout({
  article,
  locale,
  children,
}: {
  article: Article;
  locale: string;
  children: React.ReactNode;
}) {
  const t = await getTranslations({ locale, namespace: 'blog' });
  const structuredData = article.seo ? generateStructuredData(article.seo) : undefined;

  return (
    <Container className="mt-16 lg:mt-32">
      {structuredData && (
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      )}
      <div className="flex justify-between items-center px-2 py-8">
        <Link
          href={`/${locale}/category/blog`}
          className="flex space-x-2 items-center hover:text-foreground transition-colors"
        >
          <IconArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{t('back')}</span>
        </Link>
      </div>
      <div className="relative w-full mx-auto h-40 md:h-96 aspect-square rounded-3xl overflow-hidden">
        {article?.image ? (
          <StrapiImage
            src={article.image.url}
            alt={article.title}
            fill
            loading="lazy"
            sizes="(max-width: 768px) calc(100vw - 2rem), 384px"
            className="object-cover dark:[mask-image:radial-gradient(circle,white,transparent)]"
          />
        ) : (
          <div className="absolute inset-0 shadow-derek bg-card flex items-center justify-center">
            {/* <Logo /> */}
          </div>
        )}
      </div>
      <div className="xl:relative">
        <div className="mx-auto max-w-2xl">
          <article className="pb-8 pt-8">
            <div className="flex gap-4 flex-wrap ">
              {article.categories?.map((category, idx) => (
                <p
                  key={`category-${idx}`}
                  className="text-xs font-bold text-primary-foreground px-2 py-1 rounded-full bg-primary capitalize"
                >
                  {category.name}
                </p>
              ))}
            </div>
            <header className="flex flex-col">
              <h1 className={cn("mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-5xl", "!leading-relaxed")}>
                {article.title}
              </h1>
            </header>
            <div className="mt-8 prose prose-sm dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
              {children}
            </div>
          </article>
        </div>
      </div>
      {article?.dynamic_zone && (
        <DynamicZoneManager
          dynamicZone={article?.dynamic_zone}
          locale={locale}
        />
      )}

      <div className="flex space-x-2 items-center pt-12 border-t border-border mt-12 p-10">
        <div className="h-5 rounded-lg w-0.5 bg-border m-1" />
        <time
          dateTime={article.publishedAt}
          className="flex items-center text-base "
        >
          <span className="text-muted-foreground text-sm">
            {format(new Date(article.publishedAt), 'MMMM dd, yyyy')}
          </span>
        </time>
      </div>
    </Container>
  );
}
