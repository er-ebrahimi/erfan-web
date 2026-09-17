import { expect } from '@playwright/test';

import { test } from '../../fixtures';

test.describe('Agent Readiness', { tag: '@api' }, () => {
  test('non-existent bare path returns real 404, not 200 shell', async ({
    request,
  }) => {
    const response = await request.get('/some-path-that-does-not-exist');
    expect(response.status()).toBe(404);
  });

  test('non-existent locale path returns real 404', async ({ request }) => {
    const response = await request.get('/fa/some-path-that-does-not-exist');
    expect(response.status()).toBe(404);
  });

  test('404 body offers agent resources (sitemap + llms.txt)', async ({
    request,
  }) => {
    const response = await request.get('/fa/does-not-exist-probe', {
      headers: { Accept: 'text/markdown' },
    });
    expect(response.status()).toBe(404);
    const body = await response.text();
    expect(body).toContain('404');
    expect(body).toContain('/sitemap.xml');
    expect(body).toContain('/llms.txt');
  });

  test('llms.txt serves markdown and negotiates by Accept', async ({
    request,
  }) => {
    const plain = await request.get('/llms.txt', {
      headers: { Accept: 'text/plain' },
    });
    expect(plain.status()).toBe(200);
    expect(plain.headers()['content-type']).toContain('text/plain');
    expect(plain.headers()['vary']?.toLowerCase()).toContain('accept');

    const markdown = await request.get('/llms.txt', {
      headers: { Accept: 'text/markdown' },
    });
    expect(markdown.status()).toBe(200);
    expect(markdown.headers()['content-type']).toContain('text/markdown');
    expect(markdown.headers()['vary']?.toLowerCase()).toContain('accept');

    const body = await markdown.text();
    expect(body.trim().startsWith('# ')).toBeTruthy();
  });

  test('llms.txt is reachable from the public sitemap point of view', async ({
    request,
  }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain('sitemap');
  });

  test('homepage renders server-side JSON-LD identity', async ({ request }) => {
    const response = await request.get('/fa');
    expect(response.status()).toBe(200);
    const html = await response.text();

    const scripts = [
      ...html.matchAll(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
      ),
    ].map((m) => m[1]);

    const parsed = scripts
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .flat();

    const types = new Set(
      parsed
        .map((node: any) => (Array.isArray(node) ? node : [node]))
        .flat()
        .map((node: any) => node?.['@type'])
    );

    expect(types.has('Organization')).toBeTruthy();
    expect(types.has('WebSite')).toBeTruthy();
  });
});
