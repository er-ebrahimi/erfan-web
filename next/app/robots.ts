import { type MetadataRoute } from 'next';

const BASE_URL =
  process.env.WEBSITE_URL ??
  (process.env.DOMAIN ? `https://${process.env.DOMAIN}` : 'https://studioarman.com');

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
