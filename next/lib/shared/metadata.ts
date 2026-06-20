import { Metadata } from 'next';

import { strapiImage } from '../strapi/strapiImage';

export function generateMetadataObject(seo: any): Metadata {
  return {
    title: seo?.metaTitle || 'Default Title',
    description: seo?.metaDescription || 'Default Description',
    keywords: seo?.keywords || undefined,
    robots: seo?.metaRobots || undefined,
    other: {
      ...(seo?.metaViewport ? { viewport: seo.metaViewport } : {}),
    },
    alternates: seo?.canonicalURL
      ? { canonical: seo.canonicalURL }
      : undefined,
    openGraph: {
      type: 'website',
      title: seo?.ogTitle || seo?.metaTitle || 'Default OG Title',
      description:
        seo?.ogDescription || seo?.metaDescription || 'Default OG Description',
      url: seo?.canonicalURL || undefined,
      siteName: 'استودیو آرمان',
      images: seo?.metaImage
        ? [{ url: strapiImage(seo?.metaImage.url) }]
        : [{ url: 'https://studioarman.com/og/default.png' }],
    },
    twitter: {
      card: seo?.twitterCard || 'summary_large_image',
      title: seo?.twitterTitle || seo?.metaTitle || 'Default Twitter Title',
      description:
        seo?.twitterDescription ||
        seo?.metaDescription ||
        'Default Twitter Description',
      images: seo?.twitterImage
        ? [{ url: seo.twitterImage }]
        : ['https://studioarman.com/og/default.png'],
    },
  };
}

export function generateStructuredData(seo: any): string | undefined {
  if (!seo?.structuredData) return undefined;
  return JSON.stringify(seo.structuredData);
}
