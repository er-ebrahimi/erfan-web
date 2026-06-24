import { test as base, type Page } from '@playwright/test';

type Mocks = {
  mockContactApi: void;
};

type Pages = {
  mockContactApiWithFailure: { message: string };
};

export const test = base.extend<Mocks & Pages>({
  mockContactApi: async ({ page }, use) => {
    await setupContactApiMock(page, true);
    await use();
  },

  mockContactApiWithFailure: async ({ page }, use) => {
    await setupContactApiMock(page, false);
    await use();
  },
});

async function setupContactApiMock(page: Page, success: boolean): Promise<void> {
  await page.route('**/api/contact', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }
    if (success) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'TEST_SUCCESS' }),
      });
    } else {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'TEST_ERROR',
        }),
      });
    }
  });
}

export { expect } from '@playwright/test';
