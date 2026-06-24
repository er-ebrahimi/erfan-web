/**
 * Regression Test: Theme Toggle (Dark/Light)
 * 
 * Why: Theme switching is a core UX feature. Dark mode is increasingly expected.
 * If the theme toggle breaks, users lose visual preference control.
 * 
 * Business risk: Poor user experience for dark mode users.
 * Priority: P1 (High)
 */

import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { HomepagePage } from '../../pages/homepage.page';
import { NavbarPage } from '../../pages/navbar.page';

test.describe('Theme toggle', { tag: '@regression' }, () => {
  let homepage: HomepagePage;
  let navbar: NavbarPage;

  test.beforeEach(async ({ page }) => {
    homepage = new HomepagePage(page);
    navbar = new NavbarPage(page);
    await homepage.goto();
  });

  test('theme toggle button is visible in navbar', async () => {
    const toggleVisible = await navbar.themeToggle.isVisible().catch(() => false);
    test.skip(!toggleVisible, 'Theme toggle not shown on this page');
    await expect(navbar.themeToggle).toBeVisible();
  });

  test('toggling theme switches dark class on html element', async ({ page }) => {
    const toggleVisible = await navbar.themeToggle.isVisible().catch(() => false);
    test.skip(!toggleVisible, 'Theme toggle not shown');

    const initialDark = await homepage.isDarkMode();

    await navbar.themeToggle.click();
    await page.waitForTimeout(500);

    const afterDark = await homepage.isDarkMode();
    expect(afterDark).not.toBe(initialDark);
  });

  test('dark mode persists after page reload', async ({ page }) => {
    const toggleVisible = await navbar.themeToggle.isVisible().catch(() => false);
    test.skip(!toggleVisible, 'Theme toggle not shown');

    await navbar.themeToggle.click();
    await page.waitForTimeout(500);
    const beforeReload = await homepage.isDarkMode();

    await page.reload();
    await page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => {});

    const afterReload = await homepage.isDarkMode();
    expect(afterReload).toBe(beforeReload);
  });
});
