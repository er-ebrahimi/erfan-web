/**
 * Smoke Test: Navigation
 * 
 * Why: Navigation is the core way users explore the site.
 * Broken navigation means users cannot reach any content.
 * 
 * Business risk: Site becomes unusable, all content hidden.
 * Priority: P0 (Critical)
 */

import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { HomepagePage } from '../../pages/homepage.page';
import { NavbarPage } from '../../pages/navbar.page';
import { NAV_ITEM_LABELS, VIEWPORTS } from '../../utils/constants';

test.describe('Navigation', { tag: '@smoke' }, () => {
  test.describe('Desktop navigation', () => {
    let homepage: HomepagePage;
    let navbar: NavbarPage;

    test.beforeEach(async ({ page }) => {
      homepage = new HomepagePage(page);
      navbar = new NavbarPage(page);
      await homepage.goto();
    });

    test('home link navigates to homepage', async () => {
      await navbar.clickNavLink(NAV_ITEM_LABELS.home);
      await expect(page).toHaveURL(/\/fa$/);
    });

    test('blog link navigates to blog listing', async () => {
      await navbar.clickNavLink(NAV_ITEM_LABELS.blog);
      await expect(page).toHaveURL(/\/fa\/category\/blog$/);
    });
  });

  test.describe('Mobile navigation', () => {
    test.use({ viewport: VIEWPORTS.mobile });

    test('mobile menu opens and displays nav items', async ({ page }) => {
      const homepage = new HomepagePage(page);
      const navbar = new NavbarPage(page);
      await homepage.goto();

      await navbar.openMobileMenu();
      await expect(navbar.mobileSheet).toBeVisible();
      const linkCount = await navbar.mobileNavLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    });

    test('mobile nav link navigates correctly', async ({ page }) => {
      const homepage = new HomepagePage(page);
      const navbar = new NavbarPage(page);
      await homepage.goto();

      await navbar.openMobileMenu();
      const blogLink = navbar.mobileSheet.getByRole('link', { name: NAV_ITEM_LABELS.blog });
      await blogLink.click();
      await page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => {});

      await expect(page).toHaveURL(/\/fa\/category\/blog$/);
    });
  });
});
