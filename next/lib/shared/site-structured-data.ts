const SITE_URL = (process.env.FRONT_URL || 'https://studioarman.com').replace(
  /\/$/,
  ''
);
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Studio Arman';
const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  'Studio Arman — portfolio and blog of Erfan, a web developer and designer.';

export function buildOrganizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon-sets/favicon-192x192.png`,
    description: SITE_DESCRIPTION,
    sameAs: [],
  };
}

export function buildWebSiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'fa',
  };
}

export function buildSiteStructuredData(): Record<string, unknown>[] {
  return [buildOrganizationSchema(), buildWebSiteSchema()];
}

export function siteStructuredDataJsonLd(): string {
  return JSON.stringify(buildSiteStructuredData()).replace(/</g, '\\u003c');
}
