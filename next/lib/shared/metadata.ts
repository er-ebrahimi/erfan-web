import { strapiImage } from '../strapi/strapiImage';

export function generateMetadataObject(seo: any) {
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
      title: seo?.ogTitle || seo?.metaTitle || 'Default OG Title',
      description:
        seo?.ogDescription || seo?.metaDescription || 'Default OG Description',
      images: seo?.metaImage ? [{ url: strapiImage(seo?.metaImage.url) }] : [],
    },
    twitter: {
      card: seo?.twitterCard || 'summary_large_image',
      title: seo?.twitterTitle || seo?.metaTitle || 'Default Twitter Title',
      description:
        seo?.twitterDescription ||
        seo?.metaDescription ||
        'Default Twitter Description',
      images: seo?.twitterImage ? [{ url: seo.twitterImage }] : [],
    },
  };
}

export function generateStructuredData(seo: any): string | undefined {
  if (!seo?.structuredData) return undefined;
  return JSON.stringify(seo.structuredData);
}
