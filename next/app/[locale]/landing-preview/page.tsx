import type { Metadata } from 'next';
import { draftMode } from 'next/headers';

import { LandingPreview } from '@/components/landing/landing-preview';
import PageContent from '@/lib/shared/PageContent';
import fetchContentType from '@/lib/strapi/fetchContentType';

/**
 * Throwaway preview route for the Kodom Tech landing. Renders the hardcoded
 * copy until a Strapi page with slug `landing-preview` is authored; then it
 * renders the dynamic zone exactly like the homepage.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const revalidate = 60;

export default async function LandingPreviewPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { isEnabled } = await draftMode();

  const pageData = await fetchContentType(
    'pages',
    {
      filters: {
        slug: 'landing-preview',
        locale: params.locale,
      },
    },
    true,
    { preview: isEnabled }
  );

  if (pageData) {
    return <PageContent pageData={pageData} />;
  }

  return <LandingPreview />;
}
