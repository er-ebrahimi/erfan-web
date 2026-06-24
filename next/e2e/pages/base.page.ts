import { type Locator, type Page } from '@playwright/test';
import { LOCALE } from '../utils/constants';

export abstract class BasePage {
  constructor(public readonly page: Page) {}

  abstract get path(): string;

  async goto(): Promise<void> {
    await this.page.goto(this.path, { timeout: 15_000 }).catch(() => {});
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => {});
  }

  get locale(): string {
    return LOCALE;
  }

  get html(): Locator {
    return this.page.locator('html');
  }

  get main(): Locator {
    return this.page.locator('main');
  }

  get footer(): Locator {
    return this.page.getByRole('contentinfo');
  }

  async getDirection(): Promise<string> {
    return (await this.html.getAttribute('dir')) ?? 'ltr';
  }

  async isDarkMode(): Promise<boolean> {
    return this.html.evaluate((el) => el.classList.contains('dark'));
  }
}
