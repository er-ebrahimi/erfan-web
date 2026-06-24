import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ROUTES } from '../utils/constants';

export class BlogListingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get path(): string {
    return ROUTES.blog;
  }

  get heading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  get searchInput(): Locator {
    return this.page.getByPlaceholder('جستجوی مقالات');
  }

  get morePostsHeading(): Locator {
    return this.page.getByRole('heading', { name: 'مقالات بیشتر' });
  }

  get articleRowLinks(): Locator {
    return this.page.locator('a[href*="/fa/category/"]').filter({
      has: this.page.locator('span.sr-only'),
    });
  }

  get firstArticleLink(): Locator {
    return this.articleRowLinks.first();
  }

  get previousButton(): Locator {
    return this.page.getByRole('button', { name: 'Previous page' });
  }

  get nextButton(): Locator {
    return this.page.getByRole('button', { name: 'Next page' });
  }

  get pageInfo(): Locator {
    return this.page.locator('text=Page');
  }

  get noResultsMessage(): Locator {
    return this.page.getByText('نتیجه‌ای یافت نشد');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(300);
  }

  async clickFirstArticle(): Promise<void> {
    await this.firstArticleLink.click();
    await this.page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
  }
}
