/**
 * Regression Test: RTL Rendering
 * 
 * Why: The site is Persian-first (Farsi). RTL support is critical.
 * Broken RTL means unreadable text, misaligned layouts, and a broken experience.
 * 
 * Business risk: All users see broken layout, complete loss of usability.
 * Priority: P1 (High)
 */

import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { ROUTES } from '../../utils/constants';

test.describe('RTL support', { tag: '@regression' }, () => {
  const testPages = [
    { name: 'homepage', path: ROUTES.home },
    { name: 'blog listing', path: ROUTES.blog },
  ];

  for (const { name, path } of testPages) {
    test(`html element has dir="rtl" on ${name}`, async ({ page }) => {
      await page.goto(path, { timeout: 15_000 }).catch(() => {});
      await page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => {});

      const dir = await page.locator('html').getAttribute('dir');
      expect(dir).toBe('rtl');
    });

    test(`body text renders in correct RTL order on ${name}`, async ({ page }) => {
      await page.goto(path, { timeout: 15_000 }).catch(() => {});
      await page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => {});

      const direction = await page.locator('body').evaluate((el) => {
        return window.getComputedStyle(el).direction;
      });
      expect(direction).toBe('rtl');
    });
  }
});
