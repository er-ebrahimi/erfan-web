import { type Locator, type Page } from '@playwright/test';

export class NavbarPage {
  constructor(public readonly page: Page) {}

  get navbar(): Locator {
    return this.page.getByRole('navigation').first();
  }

  get navLinks(): Locator {
    return this.navbar.getByRole('link');
  }

  get mobileMenuButton(): Locator {
    return this.page.getByRole('button', { name: 'منو' });
  }

  get mobileSheet(): Locator {
    return this.page.locator('[role="dialog"]');
  }

  get mobileNavLinks(): Locator {
    return this.mobileSheet.getByRole('link');
  }

  get themeToggle(): Locator {
    return this.navbar.getByRole('button', { name: /تم|theme/i });
  }

  async clickNavLink(name: string | RegExp): Promise<void> {
    const link = this.navbar.getByRole('link', { name });
    await link.click();
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10_000 }).catch(() => {});
  }

  async openMobileMenu(): Promise<void> {
    if (await this.mobileMenuButton.isVisible()) {
      await this.mobileMenuButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  async closeMobileMenu(): Promise<void> {
    const closeButton = this.mobileSheet.getByRole('button').first();
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  async getVisibleNavLabels(): Promise<string[]> {
    const links = await this.navLinks.all();
    const labels: string[] = [];
    for (const link of links) {
      const text = await link.textContent();
      if (text?.trim()) labels.push(text.trim());
    }
    return labels;
  }
}
