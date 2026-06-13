import { Metadata } from 'next';

import ClientSlugHandler from './ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { JsonLd } from '@/components/seo/json-ld';

function parseStructuredData(value: unknown) {
  if (!value) return null;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  return value;
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const pageData = await fetchContentType(
    'pages',
    {
      filters: {
        slug: 'homepage',
        locale: params.locale,
      },
      populate: 'seo.metaImage',
    },
    true
  );

  const seo = pageData?.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const pageData = await fetchContentType(
    'pages',
    {
      filters: {
        slug: 'homepage',
        locale: params.locale,
      },
    },
    true
  );

  const localizedSlugs = pageData?.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = '';
      return acc;
    },
    { [params.locale]: '' }
  );
  return (
    <>
      <JsonLd data={parseStructuredData(pageData?.seo?.structuredData)} />
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={pageData} />
    </>
  );
}
