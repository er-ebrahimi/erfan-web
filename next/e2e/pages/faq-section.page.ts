import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { ROUTES } from '../utils/constants';

export class FaqSectionPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get path(): string {
    return ROUTES.faq;
  }

  get faqItems(): Locator {
    return this.page.getByRole('heading', { level: 4 });
  }
}
