/**
 * Regression Test: Error States
 *
 * Why: Users encounter 404 pages when content is missing or deleted.
 * A broken 404 page confuses users and damages credibility.
 *
 * Business risk: Poor UX on error paths, lost users on broken links.
 * Priority: P1 (High)
 */
import { expect } from '@playwright/test';

import { test } from '../../fixtures';

test.describe('Error states', { tag: '@regression' }, () => {
  test('returns 404 for non-existent page', async ({ page }) => {
    const response = await page.goto('/fa/non-existent-page-xxxxx', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(404);
  });

  test('returns 404 for non-existent nested page', async ({ page }) => {
    const response = await page.goto('/fa/non-existent/child-page', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(404);
    await expect(page.getByText('صفحه یافت نشد')).toBeVisible();
  });

  test('bare unknown path shows the localized 404', async ({ page }) => {
    const response = await page.goto('/non-existent-page-xxxxx', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(404);
    await expect(page.getByText('صفحه یافت نشد')).toBeVisible();
  });

  test('shows 404 page with helpful content', async ({ page }) => {
    await page.goto('/fa/non-existent-page-xxxxx', {
      waitUntil: 'domcontentloaded',
    });

    await expect(page.getByText('صفحه یافت نشد')).toBeVisible();
    await expect(page.getByRole('link', { name: 'برو به خانه' })).toBeVisible();
  });

  test('404 page has a link back to homepage', async ({ page }) => {
    await page.goto('/fa/non-existent-page-xxxxx', {
      waitUntil: 'domcontentloaded',
    });

    const homeLink = page.getByRole('link', { name: 'برو به خانه' });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await page
      .waitForLoadState('domcontentloaded', { timeout: 10_000 })
      .catch(() => {});

    await expect(page).toHaveURL(new RegExp(`/`));
  });
});

const NOT_FOUND_HEADING = 'صفحه یافت نشد';
const HOME_LINK = 'برو به خانه';
const OLD_ENGLISH_COPY = 'The page you are looking for does not exist';

test.describe('404 routing edge cases', { tag: '@regression' }, () => {
  const localized404Paths = [
    { name: 'a bare single-segment path', path: '/no-such-page-xxxxx' },
    { name: 'a bare multi-segment path', path: '/no-such/deep/path' },
    {
      name: 'a bare path with a query string',
      path: '/no-such-page-xxxxx?x=1',
    },
    { name: 'a locale-prefixed nested path', path: '/fa/no/such/page' },
    { name: 'a locale-prefixed content-like path', path: '/fa/contact/asdf' },
    { name: 'an unsupported locale prefix', path: '/de/whatever' },
    { name: 'an asset-like path', path: '/nothing.png' },
  ];

  for (const { name, path } of localized404Paths) {
    test(`shows the localized 404 for ${name}`, async ({ page }) => {
      const response = await page.goto(path, {
        waitUntil: 'domcontentloaded',
      });

      expect(response?.status()).toBe(404);
      await expect(page.getByText(NOT_FOUND_HEADING)).toBeVisible();
      await expect(page.getByRole('link', { name: HOME_LINK })).toBeVisible();

      // Internal rewrite must not turn into a redirect or lose the query.
      const requested = new URL(path, 'http://localhost:3000');
      const actual = new URL(page.url());
      expect(actual.pathname).toBe(requested.pathname);
      expect(actual.search).toBe(requested.search);
    });
  }

  test('normalizes a trailing slash and shows the localized 404', async ({
    page,
  }) => {
    const response = await page.goto('/no-such-page-xxxxx/', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.status()).toBe(404);
    await expect(page.getByText(NOT_FOUND_HEADING)).toBeVisible();
    expect(new URL(page.url()).pathname).toBe('/no-such-page-xxxxx');
  });

  test('renders the 404 in Persian RTL without the old English copy', async ({
    page,
  }) => {
    await page.goto('/no-such-page-xxxxx', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(NOT_FOUND_HEADING)).toBeVisible();

    await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('body')).not.toContainText(OLD_ENGLISH_COPY);
  });

  test('asset-like 404 declares the Persian RTL document', async ({ page }) => {
    await page.goto('/nothing.png', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(NOT_FOUND_HEADING)).toBeVisible();

    await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});

test.describe(
  '404 content negotiation and route sanity',
  { tag: '@regression' },
  () => {
    const barePaths = [
      '/no-such-page-xxxxx',
      '/no-such/deep/path',
      '/de/whatever',
    ];

    for (const path of barePaths) {
      test(`serves a markdown 404 with agent links for ${path}`, async ({
        request,
      }) => {
        const response = await request.get(path, {
          headers: { Accept: 'text/markdown' },
          maxRedirects: 0,
        });

        expect(response.status()).toBe(404);
        expect(response.headers()['content-type']).toContain('text/markdown');
        expect(response.headers()['vary']?.toLowerCase()).toContain('accept');

        const body = await response.text();
        expect(body).toContain('/llms.txt');
        expect(body).toContain('/sitemap.xml');
      });
    }

    // A rendered not-found boundary always replies as HTML; only the proxy can
    // set text/markdown. When an agent asks for markdown, the page body still
    // contains the markdown agent payload.
    test('locale-prefixed 404 serves agent markdown in the body', async ({
      request,
    }) => {
      const response = await request.get('/fa/no/such/page', {
        headers: { Accept: 'text/markdown' },
      });

      expect(response.status()).toBe(404);

      const body = await response.text();
      expect(body).toContain('# 404 - Not Found');
      expect(body).toContain('/llms.txt');
      expect(body).toContain('/sitemap.xml');
    });

    test('does not shadow valid routes', async ({ request }) => {
      for (const path of ['/fa', '/', '/llms.txt', '/fa/category/blog']) {
        const response = await request.get(path);
        expect(response.status(), `${path} should stay reachable`).toBe(200);
      }

      const homeWithMarkdown = await request.get('/', {
        headers: { Accept: 'text/markdown' },
      });
      expect(homeWithMarkdown.status()).toBe(200);
      expect(homeWithMarkdown.headers()['content-type']).toContain('text/html');
    });
  }
);
