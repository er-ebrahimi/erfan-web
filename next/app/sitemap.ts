import { type MetadataRoute } from 'next';

import { locales } from '@/config';
import fetchContentType from '@/lib/strapi/fetchContentType';

const BASE_URL = 'https://studioarman.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push(
      {
        url: `${BASE_URL}/${locale}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1.0,
      },
      {
        url: `${BASE_URL}/${locale}/category/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }
    );
  }

  try {
    const res = await fetchContentType('articles', { populate: '' }, false);
    const articles: any[] = res?.data ?? [];

    for (const article of articles) {
      entries.push({
        url: `${BASE_URL}/${article.locale ?? 'fa'}/category/${article.slug}`,
        lastModified: new Date(article.updatedAt ?? article.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  } catch (err) {
    console.error('[Sitemap] Failed to fetch articles:', err);
  }

  return entries;
}
