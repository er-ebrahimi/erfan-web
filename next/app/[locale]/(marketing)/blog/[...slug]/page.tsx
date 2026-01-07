import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import React from 'react';

import ClientSlugHandler from '../../ClientSlugHandler';
import { BlogLayout } from '@/components/blog-layout';
import fetchContentType from '@/lib/strapi/fetchContentType';

export default async function SingleArticlePage(props: {
  params: Promise<{ slug: string[]; locale: string }>;
}) {
  const params = await props.params;
  const { slug, locale } = params;
  const slugString = Array.isArray(slug) ? slug.join('/') : slug;

  const article = await fetchContentType(
    'articles',
    {
      filters: {
        slug: slugString,
        locale: locale,
      },
    },
    true
  );

  if (!article) {
    return <div>Blog not found</div>;
  }

  const localizedSlugs = article.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [locale]: slugString }
  );

  return (
    <BlogLayout article={article} locale={locale}>
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <BlocksRenderer content={article.content} />
    </BlogLayout>
  );
}
