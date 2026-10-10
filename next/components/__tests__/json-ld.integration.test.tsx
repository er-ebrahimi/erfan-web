import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { JsonLd } from '../../components/json-ld';

vi.mock('next/script', () => ({
  default: function MockScript({ id, type, dangerouslySetInnerHTML }: any) {
    return React.createElement('script', { id, type, dangerouslySetInnerHTML });
  },
}));

const STRAPI_URL =
  process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

async function fetchStrapi(path: string) {
  if (!STRAPI_URL) return null;
  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

describe.skipIf(!STRAPI_URL)('JsonLd integration — real Strapi data', () => {
  it('renders structured data from Strapi global seo', async () => {
    const data = await fetchStrapi(
      '/global?populate[seo][fields][0]=structuredData&populate[seo][fields][1]=metaTitle'
    );
    const seo = data?.data?.seo;
    if (!seo?.structuredData) return;

    const { container } = render(
      React.createElement(JsonLd, { seo, id: 'global-structured-data' })
    );
    const script = container.querySelector(
      'script[type="application/ld+json"]'
    );
    expect(script).toBeTruthy();

    const content = JSON.parse(script?.innerHTML || '{}');
    expect(content['@context']).toBe('https://schema.org');
  });

  it('renders structured data from Strapi pages', async () => {
    const data = await fetchStrapi(
      '/pages?populate[seo][fields][0]=structuredData&filters[seo][structuredData][$notNull]=true&fields[0]=slug&pagination[pageSize]=5'
    );
    const pages = data?.data ?? [];

    for (const page of pages) {
      if (!page.seo?.structuredData) continue;

      const { container } = render(
        React.createElement(JsonLd, {
          seo: page.seo,
          id: 'page-structured-data',
        })
      );
      const script = container.querySelector(
        'script[type="application/ld+json"]'
      );
      expect(script).toBeTruthy();

      const content = JSON.parse(script?.innerHTML || '{}');
      expect(content['@context']).toBe('https://schema.org');
    }
  });

  it('renders structured data from Strapi articles', async () => {
    const data = await fetchStrapi(
      '/articles?populate[seo][fields][0]=structuredData&filters[seo][structuredData][$notNull]=true&fields[0]=slug&pagination[pageSize]=5'
    );
    const articles = data?.data ?? [];

    for (const article of articles) {
      if (!article.seo?.structuredData) continue;

      const { container } = render(
        React.createElement(JsonLd, {
          seo: article.seo,
          id: 'article-structured-data',
        })
      );
      const script = container.querySelector(
        'script[type="application/ld+json"]'
      );
      expect(script).toBeTruthy();

      const content = JSON.parse(script?.innerHTML || '{}');
      expect(content['@context']).toBe('https://schema.org');
    }
  });

  it('renders structured data from Strapi blog-page', async () => {
    const data = await fetchStrapi(
      '/blog-page?populate[seo][fields][0]=structuredData'
    );
    const seo = data?.data?.seo;
    if (!seo?.structuredData) return;

    const { container } = render(
      React.createElement(JsonLd, { seo, id: 'blog-structured-data' })
    );
    const script = container.querySelector(
      'script[type="application/ld+json"]'
    );
    expect(script).toBeTruthy();

    const content = JSON.parse(script?.innerHTML || '{}');
    expect(content['@context']).toBe('https://schema.org');
  });
});
