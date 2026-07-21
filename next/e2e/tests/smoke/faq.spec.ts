import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { FaqSectionPage } from '../../pages/faq-section.page';

test.describe('FAQ Section', { tag: '@smoke' }, () => {
  let faqPage: FaqSectionPage;

  test.beforeEach(async ({ page }) => {
    faqPage = new FaqSectionPage(page);
    await faqPage.goto();
  });

  test('displays FAQ items when available', async () => {
    const count = await faqPage.faqItems.count();
    test.skip(count === 0, 'No FAQ items');
    await expect(faqPage.faqItems.first()).toBeVisible();
  });
});
