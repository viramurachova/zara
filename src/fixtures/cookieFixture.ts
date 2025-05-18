import { test as base, Page } from '@playwright/test';

export const test = base.extend<{
  pageWithCookies: Page;
}>({
  pageWithCookies: async ({ page }, use) => {
    await page.goto('/');
    const acceptCookiesButton = page.locator('#onetrust-accept-btn-handler');
    const goToStoreButton = page.locator('[data-qa-action="go-to-store"]');

    await acceptCookiesButton.waitFor({ state: 'visible' });
    await acceptCookiesButton.click();

    await goToStoreButton.waitFor({ state: 'visible' });
    await goToStoreButton.click();

    await use(page);
  }
});