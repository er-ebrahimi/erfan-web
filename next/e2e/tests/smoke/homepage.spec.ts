/**
 * Smoke Test: Homepage
 * 
 * Why: The homepage is the primary entry point for all visitors.
 * If it fails to load, every user sees a broken site.
 * 
 * Business risk: Complete loss of visitor acquisition and brand credibility.
 * Priority: P0 (Critical)
 */

import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { HomepagePage } from '../../pages/homepage.page';
import { NavbarPage } from '../../pages/navbar.page';
import { collectPageErrors } from '../../utils/helpers';

test.describe('Homepage', { tag: '@smoke' }, () => {
  let homepage: HomepagePage;
  let navbar: NavbarPage;

  test.beforeEach(async ({ page }) => {
    homepage = new HomepagePage(page);
    navbar = new NavbarPage(page);
    await homepage.goto();
  });

  test('loads without JavaScript errors', async ({ page }) => {
    const { errors, stop } = collectPageErrors(page);
    await page.waitForTimeout(500);
    stop();
    expect(errors).toHaveLength(0);
  });

  test('displays a main heading', async () => {
    await expect(homepage.mainHeading).toBeVisible();
  });

  test('renders navigation bar with links', async () => {
    await expect(navbar.navbar).toBeVisible();
    const linkCount = await navbar.navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('renders footer', async () => {
    await expect(homepage.footer).toBeVisible();
  });

  test('has Farsi direction (RTL)', async () => {
    const dir = await homepage.getDirection();
    expect(dir).toBe('rtl');
  });

  test('navigation links are clickable and lead to valid pages', async ({ page }) => {
    const links = await navbar.navLinks.all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        const response = await page.goto(href);
        expect(response?.ok()).toBe(true);
        await homepage.goto();
      }
    }
  });
});
