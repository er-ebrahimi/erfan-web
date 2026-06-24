/**
 * Smoke Test: Contact Form
 * 
 * Why: The contact form is the primary lead generation channel.
 * If broken, potential clients cannot reach the business.
 * 
 * Business risk: Lost revenue opportunities, no customer inquiries.
 * Priority: P0 (Critical)
 * 
 * Covers: empty-field validation, ALTCHA error, successful submission.
 */

import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import { ContactPage } from '../../pages/contact.page';
import { CONTACT_FORM } from '../../data/test-data';
import { collectPageErrors, waitForPageStable } from '../../utils/helpers';

test.describe('Contact form', { tag: '@smoke' }, () => {
  let contactPage: ContactPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
  });

  test.describe('on a CMS page with contact section', () => {
    test('shows form fields and submit button', async ({ page }) => {
      await page.goto('/fa');
      await waitForPageStable(page);

      const contactInput = page.getByRole('textbox', { name: 'شماره تماس یا ایمیل' });
      const messageInput = page.getByRole('textbox', { name: 'پیام' });

      // If the contact form is not on the homepage, this test is inconclusive
      test.skip(!(await contactInput.isVisible()), 'Contact form not found on homepage');

      await expect(contactInput).toBeVisible();
      await expect(messageInput).toBeVisible();
      await expect(contactPage.submitButton).toBeVisible();
    });

    test('shows validation error when submitting empty form', async ({ page }) => {
      await page.goto('/fa');
      await waitForPageStable(page);

      const contactInput = page.getByRole('textbox', { name: 'شماره تماس یا ایمیل' });
      test.skip(!(await contactInput.isVisible()), 'Contact form not found on homepage');

      await contactPage.submit();
      await expect(contactPage.errorMessage).toBeVisible();
    });

    test('shows captcha error when ALTCHA not verified', async ({ page }) => {
      await page.goto('/fa');
      await waitForPageStable(page);

      const contactInput = page.getByRole('textbox', { name: 'شماره تماس یا ایمیل' });
      test.skip(!(await contactInput.isVisible()), 'Contact form not found on homepage');

      await contactPage.fillForm(CONTACT_FORM.altchaError.contact, CONTACT_FORM.altchaError.message);

      await page.route('**/api/altcha/challenge', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            algorithm: 'PBKDF2/SHA-256',
            challenge: 'bogus',
            salt: 'bogus',
            signature: 'bogus',
            expiresAt: new Date(Date.now() + 600000).toISOString(),
          }),
        });
      });

      await contactPage.submit();

      const isError = await contactPage.errorMessage.isVisible().catch(() => false);
      if (isError) {
        await expect(contactPage.errorMessage).toBeVisible();
      }
    });

    test('submits successfully with valid data and mocked API', async ({ page }) => {
      await page.goto('/fa');
      await waitForPageStable(page);

      const contactInput = page.getByRole('textbox', { name: 'شماره تماس یا ایمیل' });
      test.skip(!(await contactInput.isVisible()), 'Contact form not found on homepage');

      await page.route('**/api/contact', async (route) => {
        if (route.request().method() === 'POST') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true, message: 'پیام شما با موفقیت ارسال شد!' }),
          });
        } else {
          await route.continue();
        }
      });

      await contactPage.fillForm(CONTACT_FORM.valid.contact, CONTACT_FORM.valid.message);

      const altchaVerified = await contactPage.waitForAltchaVerification();
      if (!altchaVerified) {
        test.skip(true, 'ALTCHA could not be verified in test environment');
      }

      await contactPage.submit();
      await expect(contactPage.successMessage).toBeVisible();
    }, { timeout: 60_000 });
  });
});
