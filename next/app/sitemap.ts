import { type MetadataRoute } from 'next';

import { locales } from '@/config';
import fetchContentType from '@/lib/strapi/fetchContentType';

export const revalidate = 86400; // 24 hours

const BASE_URL = process.env.FRONT_URL || 'https://website.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  let blogArticles: any[] = [];
  try {
    const res = await fetchContentType('articles', { pagination: { pageSize: 1000 }, fields: ['slug', 'updatedAt', 'publishedAt'], populate: false, status: 'published' }, false);
    const articles: any[] = res?.data ?? [];
    blogArticles = articles.filter((a: any) => a.slug?.includes('blog'));

    const hasBlog = blogArticles.length > 0;

    for (const locale of locales) {
      entries.push(
        {
          url: `${BASE_URL}/${locale}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 1.0,
        },
        ...(hasBlog
          ? [{
              url: `${BASE_URL}/${locale}/category/blog`,
              lastModified: new Date(),
              changeFrequency: 'weekly' as const,
              priority: 0.8,
            }]
          : [])
      );
    }

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
