/**
 * Smoke Test: Kodom landing preview
 *
 * Why: the hardcoded preview is the visual contract for the Strapi migration.
 * If a section disappears or the page overflows, the migration is wrong.
 *
 * Priority: P0 for the preview route only (noindex).
 */
import { expect } from '@playwright/test';

import { test } from '../../fixtures';
import { LandingPreviewPage } from '../../pages/landing-preview.page';
import { NavbarPage } from '../../pages/navbar.page';
import { collectPageErrors } from '../../utils/helpers';

test.describe('Landing preview', { tag: '@smoke' }, () => {
  let preview: LandingPreviewPage;
  let navbar: NavbarPage;

  test.beforeEach(async ({ page }) => {
    preview = new LandingPreviewPage(page);
    navbar = new NavbarPage(page);
    await preview.goto();
  });

  test('loads without JavaScript errors', async ({ page }) => {
    const { errors, stop } = collectPageErrors(page);
    await page.waitForTimeout(500);
    stop();
    expect(errors).toHaveLength(0);
  });

  test('renders every Kodom section', async () => {
    await expect(preview.heroHeading).toBeVisible();
    await expect(preview.benefitsHeading).toBeVisible();
    await expect(preview.howItWorksHeading).toBeVisible();
    await expect(preview.galleryHeading).toBeVisible();
    await expect(preview.showcaseHeading).toBeVisible();
    await expect(preview.statsValue).toBeVisible();
    await expect(preview.finalCtaHeading).toBeVisible();
  });

  test('has Farsi direction (RTL)', async () => {
    expect(await preview.getDirection()).toBe('rtl');
  });

  test('does not overflow horizontally', async () => {
    const overflow = await preview.getHorizontalOverflow();
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('opens the mega menu with Strapi links', async () => {
    await navbar.openMobileMenu();
    const count = await navbar.mobileNavLinks.count();
    test.skip(count === 0, 'No Strapi navigation data');
    await expect(navbar.mobileNavLinks.first()).toBeVisible();
  });
});
