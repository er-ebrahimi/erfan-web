import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ROUTES } from '../utils/constants';

export class CmsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get path(): string {
    return '';
  }

  async gotoBySlug(slug: string): Promise<void> {
    this._slug = slug;
    await this.page.goto(`${ROUTES.home}/${slug}`, { timeout: 15_000 }).catch(() => {});
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => {});
  }

  private _slug = '';

  get currentSlug(): string {
    return this._slug;
  }

  get headings(): Locator {
    return this.page.getByRole('heading');
  }
}
