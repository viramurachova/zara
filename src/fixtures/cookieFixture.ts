import { test as base, expect, Page, Browser, BrowserContext } from '@playwright/test';
import { chromium as playwrightChromium } from '@playwright/test';
import { chromium as extraChromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

extraChromium.use(StealthPlugin());

export const test = base.extend<{
  pageWithCookies: Page;
}>({
  pageWithCookies: async ({}, use) => {
    const browser: Browser = await extraChromium.launch({ headless: true });

    const context: BrowserContext = await browser.newContext({
      locale: 'uk-UA',
      geolocation: { latitude: 50.4501, longitude: 30.5234 }, // Київ, Україна
      permissions: ['geolocation'],
      viewport: { width: 1280, height: 720 },
    });

    const page: Page = await context.newPage();

    // Додатковий захист — встановимо Accept-Language
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'uk-UA,uk;q=0.9,en;q=0.8'
    });

    // Переходимо на головну
    await page.goto('/');

    const acceptCookiesButton = page.locator('#onetrust-accept-btn-handler');
    const goToStoreButton = page.locator('[data-qa-action="go-to-store"]');

    await acceptCookiesButton.waitFor({ state: 'visible' });
    await acceptCookiesButton.click();

    await goToStoreButton.waitFor({ state: 'visible' });
    await goToStoreButton.click();

    await use(page);
    await browser.close();
  }
});