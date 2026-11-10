import { type Locator, type Page } from '@playwright/test';

import { ROUTES } from '../utils/constants';
import { BasePage } from './base.page';

export class LandingPreviewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get path(): string {
    return ROUTES.landingPreview;
  }

  get heroHeading(): Locator {
    return this.page.getByRole('heading', {
      level: 1,
      name: /فضای خود را طراحی کنید/,
    });
  }

  get benefitsHeading(): Locator {
    return this.page.getByRole('heading', { level: 2, name: 'چرا کودم تک؟' });
  }

  get howItWorksHeading(): Locator {
    return this.page.getByRole('heading', { level: 2, name: /چطور کار/ });
  }

  get galleryHeading(): Locator {
    return this.page.getByRole('heading', {
      level: 2,
      name: 'سبک‌هایی برای کشف کردن',
    });
  }

  get showcaseHeading(): Locator {
    return this.page.getByRole('heading', {
      level: 2,
      name: 'یک دستیار، در تمام مسیر',
    });
  }

  get statsValue(): Locator {
    return this.page.getByText('سبک طراحی');
  }

  get finalCtaHeading(): Locator {
    return this.page.getByRole('heading', {
      level: 2,
      name: 'اتاق شما فقط یک عکس فاصله دارد',
    });
  }

  async getHorizontalOverflow(): Promise<number> {
    return this.page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    );
  }
}
