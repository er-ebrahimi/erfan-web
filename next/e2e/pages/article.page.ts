import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ROUTES } from '../utils/constants';

export class ArticlePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get path(): string {
    return '';
  }

  async gotoBySlug(slug: string): Promise<void> {
    await this.page.goto(`${ROUTES.home}/category/${slug}`, { timeout: 15_000 }).catch(() => {});
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => {});
  }

  get title(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  get articleElement(): Locator {
    return this.page.locator('article');
  }

  get contentRegion(): Locator {
    return this.page.locator('[class*="prose"]');
  }

  get backLink(): Locator {
    return this.page.getByRole('link', { name: 'بازگشت' });
  }

  get categories(): Locator {
    return this.page.locator('[class*="rounded-full bg-primary capitalize"]');
  }

  get publishedDate(): Locator {
    return this.page.locator('time');
  }

  get image(): Locator {
    return this.page.locator('[class*="aspect-square"] img').first();
  }
}
