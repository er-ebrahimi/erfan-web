import { Metadata } from 'next';
import { draftMode } from 'next/headers';

import ClientSlugHandler from './ClientSlugHandler';
import PageContent from '@/lib/shared/PageContent';
import { generateMetadataObject } from '@/lib/shared/metadata';
import fetchContentType from '@/lib/strapi/fetchContentType';

export const revalidate = 60;

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
      populate: 'seo',
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
  const { isEnabled } = await draftMode();

  const pageData = await fetchContentType(
    'pages',
    {
      filters: {
        slug: 'homepage',
        locale: params.locale,
      },
    },
    true,
    { preview: isEnabled }
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
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={pageData} />
    </>
  );
}
