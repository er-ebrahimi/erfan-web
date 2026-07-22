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
});
