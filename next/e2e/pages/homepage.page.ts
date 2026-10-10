import { type Locator, type Page } from '@playwright/test';

import { ROUTES } from '../utils/constants';
import { BasePage } from './base.page';

export class HomepagePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get path(): string {
    return ROUTES.home;
  }

  get mainHeading(): Locator {
    return this.page.getByRole('heading').first();
  }
}
