import { type Locator, type Page } from '@playwright/test';

import { ROUTES } from '../utils/constants';
import { BasePage } from './base.page';

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
