import { type Page, type Locator } from '@playwright/test';
import { TIMEOUTS } from './constants';

export async function waitForPageStable(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.networkIdle }).catch(() => {});
}

export function collectPageErrors(page: Page): { errors: string[]; stop: () => void } {
  const errors: string[] = [];
  const handler = (err: Error) => errors.push(err.message);
  page.on('pageerror', handler);
  return {
    errors,
    stop: () => page.off('pageerror', handler),
  };
}

export function hasDarkClass(htmlLocator: Locator): Promise<boolean> {
  return htmlLocator.evaluate((el) => el.classList.contains('dark'));
}
