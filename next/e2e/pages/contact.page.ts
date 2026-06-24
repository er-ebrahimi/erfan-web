import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { TIMEOUTS } from '../utils/constants';

export class ContactPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get path(): string {
    return '';
  }

  get contactInput(): Locator {
    return this.page.getByRole('textbox', { name: 'شماره تماس یا ایمیل' });
  }

  get messageInput(): Locator {
    return this.page.getByRole('textbox', { name: 'پیام' });
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: 'ارسال پیام' });
  }

  get submittingButton(): Locator {
    return this.page.getByRole('button', { name: 'در حال ارسال...' });
  }

  get successMessage(): Locator {
    return this.page.locator('[class*="bg-green"]');
  }

  get errorMessage(): Locator {
    return this.page.locator('[class*="bg-red"]');
  }

  get altchaWidget(): Locator {
    return this.page.locator('altcha-widget');
  }

  async fillContact(value: string): Promise<void> {
    await this.contactInput.fill(value);
  }

  async fillMessage(value: string): Promise<void> {
    await this.messageInput.fill(value);
  }

  async fillForm(contact: string, message: string): Promise<void> {
    await this.fillContact(contact);
    await this.fillMessage(message);
  }

  async waitForAltchaVerification(): Promise<boolean> {
    await this.altchaWidget.waitFor({ state: 'attached', timeout: TIMEOUTS.altchaVerification });
    try {
      await this.page.waitForFunction(
        () => {
          const widget = document.querySelector('altcha-widget');
          if (!widget) return false;
          const state = (widget as unknown as { getState: () => string }).getState();
          return state === 'verified';
        },
        { timeout: TIMEOUTS.altchaVerification }
      );
      return true;
    } catch {
      return false;
    }
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
  }

  async isSubmitting(): Promise<boolean> {
    return this.submittingButton.isVisible();
  }
}
