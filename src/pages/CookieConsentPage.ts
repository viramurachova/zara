import { Page, Locator } from '@playwright/test';
export class CookieConsentPage {
  private page: Page;
  private acceptCookiesButton: Locator;
  private goToStoreButton: Locator;
  private closePromoBannerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.acceptCookiesButton = page.locator('#onetrust-accept-btn-handler');
    this.goToStoreButton = page.locator('[data-qa-action="stay-in-store"]');
    this.closePromoBannerButton = page.locator('[aria-label="Close"]');
  }

  async acceptCookies(): Promise<void> {
    //await this.page.goto('/');
    await this.acceptCookiesButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.acceptCookiesButton.click();
  }

  async goToStore(): Promise<void> {
    await this.goToStoreButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.goToStoreButton.click();
  }

  async closePromoBannerIfVisible(): Promise<void> {
    if (await this.closePromoBannerButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.closePromoBannerButton.click();
    }
  }

}