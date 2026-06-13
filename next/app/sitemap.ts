import { type MetadataRoute } from 'next';

import { locales } from '@/config';
import fetchContentType from '@/lib/strapi/fetchContentType';

const BASE_URL = 'https://studioarman.com';

async function getPageRoutes(locale: string): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetchContentType('pages', {
      filters: {},
      fields: ['slug', 'updatedAt'],
      pagination: { pageSize: 100 },
      locale,
    });
    const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    return items
      .map((p: any) => p?.slug)
      .filter((slug: string) => slug && slug !== 'homepage')
      .map((slug: string) => ({
        url: `${BASE_URL}/${locale}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}

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

  return [...entries, ...(await getPageRoutes('fa'))];
}
