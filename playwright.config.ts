import { test as base, Page, BrowserContext, expect } from '@playwright/test';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { chromium } from 'playwright-extra';

chromium.use(StealthPlugin());

export const test = base.extend<{
  pageWithCookies: Page;
}>({
  pageWithCookies: async ({ browser }, use) => {
    const context: BrowserContext = await browser.newContext({
      locale: 'uk-UA',
      geolocation: { latitude: 50.4501, longitude: 30.5234 },
      permissions: ['geolocation'],
      viewport: { width: 1280, height: 720 },
    });

    const page: Page = await context.newPage();

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    await page.goto('https://www.zara.com/ua/en/');

    const acceptCookiesButton = page.locator('#onetrust-accept-btn-handler');
    if (await acceptCookiesButton.isVisible({ timeout: 3000 })) {
      await acceptCookiesButton.click();
    }

    const stayInStoreButton = page.locator('[data-qa-action="stay-in-store"]');
    if (await stayInStoreButton.isVisible({ timeout: 3000 })) {
      await stayInStoreButton.click();
    }

    await use(page);
    await context.close(); 
  },
});