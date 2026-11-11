import { SITE_URL } from '@/lib/shared/site-url';

export interface SiteIdentity {
  siteName: string;
  siteDescription: string;
}

export function buildOrganizationSchema({
  siteName,
  siteDescription,
}: SiteIdentity): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon-sets/favicon-192x192.png`,
    description: siteDescription,
    sameAs: [],
  };
}

export function buildWebSiteSchema({
  siteName,
  siteDescription,
}: SiteIdentity): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: SITE_URL,
    description: siteDescription,
    inLanguage: 'fa',
  };
}

export function buildSiteStructuredData(
  identity: SiteIdentity
): Record<string, unknown>[] {
  return [buildOrganizationSchema(identity), buildWebSiteSchema(identity)];
}

export function siteStructuredDataJsonLd(identity: SiteIdentity): string {
  return JSON.stringify(buildSiteStructuredData(identity)).replace(
    /</g,
    '\\u003c'
  );
}
