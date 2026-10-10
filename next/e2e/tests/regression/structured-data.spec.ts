import { expect } from '@playwright/test';

import { test } from '../../fixtures';

test.describe('Structured Data from Sitemap', { tag: '@regression' }, () => {
  let sitemapUrls: string[] = [];

  test.describe.configure({ mode: 'serial' });

  test('sitemap returns valid XML with URLs', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    expect(response.ok()).toBeTruthy();

    const xml = await response.text();
    expect(xml).toContain('<urlset');

    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length).toBeGreaterThan(0);

    sitemapUrls = locs;
  });

  test('pages with structured data render JSON-LD script tags', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const urlsToCheck = sitemapUrls.slice(0, 1000);
    test.skip(urlsToCheck.length === 0, 'No sitemap URLs to check');

    let pagesWithStructuredData = 0;
    let pagesChecked = 0;

    for (const url of urlsToCheck) {
      const path = new URL(url).pathname;
      const response = await page
        .goto(path, { waitUntil: 'domcontentloaded', timeout: 15_000 })
        .catch(() => null);
      if (!response?.ok()) continue;

      pagesChecked++;

      const jsonLdScripts = await page.evaluate(() => {
        const scripts = document.querySelectorAll(
          'script[type="application/ld+json"]'
        );
        return Array.from(scripts).map((s) => ({
          id: s.getAttribute('id'),
          content: s.textContent || '',
        }));
      });

      if (jsonLdScripts.length === 0) continue;

      pagesWithStructuredData++;

      for (const script of jsonLdScripts) {
        let parsed: any;
        expect
          .soft(
            (() => {
              parsed = JSON.parse(script.content);
              return true;
            })(),
            `${path} has invalid JSON in <script id="${script.id}">`
          )
          .toBe(true);

        if (parsed) {
          expect
            .soft(
              parsed['@context'],
              `${path} script id="${script.id}" missing @context`
            )
            .toBeTruthy();
          expect
            .soft(
              parsed['@type'],
              `${path} script id="${script.id}" missing @type`
            )
            .toBeTruthy();
        }
      }
    }

    expect(pagesChecked).toBeGreaterThan(0);
  });
});
