import { test as base, expect, Page, Browser, BrowserContext } from '@playwright/test';
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

    // Додатково: мова інтерфейсу браузера
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });

    // 🎯 Переходимо одразу на український сайт з англійською мовою
    await page.goto('https://www.zara.com/ua/en/');

    // ✅ Лог для дебагу
    console.log('🌐 Loaded URL:', await page.url());

    const acceptCookiesButton = page.locator('#onetrust-accept-btn-handler');
    const goToStoreButton = page.locator('[data-qa-action="stay-in-store"]');

    await acceptCookiesButton.waitFor({ state: 'visible' });
    await acceptCookiesButton.click();

    await goToStoreButton.waitFor({ state: 'visible' });
    await goToStoreButton.click();

    await use(page);
    await browser.close();
  }
});