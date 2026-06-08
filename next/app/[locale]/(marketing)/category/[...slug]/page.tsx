import 'next-intl';
import { getTranslations } from 'next-intl/server';
import ClientSlugHandler from '../../ClientSlugHandler';
import { BlogLayout } from '@/components/blog/blog-layout';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { NotFound } from '@/components/not-found';
import { generateMetadataObject } from "@/lib/shared/metadata";
import { type Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { slug, locale } = params;
  const slugString = Array.isArray(slug) ? slug.join('/') : slug;
  const article = await fetchContentType(
    "articles",
    {
      filters: {
        slug: slugString,
        locale: locale,
      },
      populate: "seo",
    },
    true
  );

  const seo = article?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function SingleArticlePage(props: {
  params: Promise<{ slug: string[]; locale: string }>;
}) {
  const t = await getTranslations('common');
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
    return <NotFound />;
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
      {/* <BlocksRenderer content={article.content} /> */}
    </BlogLayout>
  );
}
