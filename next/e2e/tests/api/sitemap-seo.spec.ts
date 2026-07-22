import { expect } from '@playwright/test';
import { test } from '../../fixtures';

test.describe('Sitemap & SEO', { tag: '@api' }, () => {
  let sitemapUrls: string[] = [];

  test.describe.configure({ mode: 'serial' });

  test('sitemap returns valid XML with URLs', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBeTruthy();

    const xml = await response.text();
    expect(xml).toContain('<urlset');
    expect(xml).toContain('<url>');

    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length).toBeGreaterThan(0);

    for (const loc of locs) {
      expect(() => new URL(loc)).not.toThrow();
    }

    sitemapUrls = locs;
  });

  test('pages from sitemap have meta title, description, and canonical URL', async ({ page }) => {
    test.setTimeout(120_000);
    const urlsToCheck = sitemapUrls.slice(0, 1000);
    test.skip(urlsToCheck.length === 0, 'No sitemap URLs to check');

    for (const url of urlsToCheck) {
      const path = new URL(url).pathname;
      const response = await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 15_000 }).catch(() => null);
      if (!response?.ok()) continue;

      const seo = await page.evaluate(() => ({
        title: document.querySelector('title')?.textContent?.trim() || null,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content') || null,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
      }));

      expect.soft(seo.title, `${path} is missing <title>`).toBeTruthy();
      expect.soft(seo.description, `${path} is missing meta description`).toBeTruthy();
      expect.soft(seo.canonical, `${path} is missing canonical URL`).toBeTruthy();
    }
  });
});
