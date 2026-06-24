/**
 * Regression Test: Responsive Design
 * 
 * Why: The site must work on all devices. Mobile traffic is significant.
 * The navbar switches from desktop (NavigationMenu) to mobile (Sheet).
 * 
 * Business risk: Losing mobile/tablet users, poor UX on smaller screens.
 * Priority: P1 (High)
 */

import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { HomepagePage } from '../../pages/homepage.page';
import { NavbarPage } from '../../pages/navbar.page';
import { BlogListingPage } from '../../pages/blog-listing.page';
import { VIEWPORTS } from '../../utils/constants';

test.describe('Responsive layout', { tag: '@regression' }, () => {
  const pages = [
    { name: 'homepage', PageClass: HomepagePage, path: '/fa' },
    { name: 'blog listing', PageClass: BlogListingPage, path: '/fa/category/blog' },
  ];

  for (const viewport of [VIEWPORTS.desktop, VIEWPORTS.tablet, VIEWPORTS.mobile]) {
    test.describe(`${viewport.width}x${viewport.height}`, () => {
      test.use({ viewport });

      for (const { name, path } of pages) {
        test(`renders ${name} without layout breakage`, async ({ page }) => {
          await page.goto(path, { timeout: 15_000 }).catch(() => {});
          await page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => {});

          const footer = page.getByRole('contentinfo');
          await expect(footer).toBeVisible();

          const heading = page.getByRole('heading').first();
          await expect(heading).toBeVisible();

          const html = page.locator('html');
          const dir = await html.getAttribute('dir');
          expect(dir).toBe('rtl');
        });
      }
    });
  }

  test.describe('Mobile navigation', () => {
    test.use({ viewport: VIEWPORTS.mobile });

    test('mobile menu button is visible on small screens', async ({ page }) => {
      const homepage = new HomepagePage(page);
      await homepage.goto();
      const navbar = new NavbarPage(page);

      await expect(navbar.mobileMenuButton).toBeVisible();
    });

    test('mobile sheet opens and contains nav links', async ({ page }) => {
      const homepage = new HomepagePage(page);
      await homepage.goto();
      const navbar = new NavbarPage(page);

      await navbar.openMobileMenu();
      await expect(page.locator('[role="dialog"]')).toBeVisible();
      const linkCount = await page.locator('[role="dialog"] a').count();
      expect(linkCount).toBeGreaterThan(0);
    });
  });

  test.describe('Tablet', () => {
    test.use({ viewport: VIEWPORTS.tablet });

    test('tablet viewport renders desktop-style navbar', async ({ page }) => {
      const homepage = new HomepagePage(page);
      await homepage.goto();
      const navbar = new NavbarPage(page);

      const mobileButton = navbar.mobileMenuButton;
      const mobileVisible = await mobileButton.isVisible().catch(() => false);
      expect(mobileVisible).toBe(false);
    });
  });
});
