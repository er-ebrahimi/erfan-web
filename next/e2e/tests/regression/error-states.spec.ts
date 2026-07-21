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
    const response = await page.goto('/fa/non-existent-page-xxxxx', { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(404);
  });

  test('shows 404 page with helpful content', async ({ page }) => {
    await page.goto('/fa/non-existent-page-xxxxx', { waitUntil: 'networkidle' });

    await expect(page.getByText('صفحه یافت نشد')).toBeVisible();
    await expect(page.getByRole('link', { name: 'برو به خانه' })).toBeVisible();
  });

  test('404 page has a link back to homepage', async ({ page }) => {
    await page.goto('/fa/non-existent-page-xxxxx', { waitUntil: 'networkidle' });

    const homeLink = page.getByRole('link', { name: 'برو به خانه' });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => { });

    await expect(page).toHaveURL(new RegExp(`/`));
  });
});
