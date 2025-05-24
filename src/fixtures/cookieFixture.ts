import { test as base, expect, Page, Browser } from '@playwright/test';
import { chromium as playwrightChromium } from '@playwright/test';
import { chromium as extraChromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Додаємо stealth-плагін до playwright-extra Chromium
extraChromium.use(StealthPlugin());

export const test = base.extend<{
  pageWithCookies: Page;
}>({
  pageWithCookies: async ({}, use) => {
    // Лаунчимо браузер з Stealth
    const browser: Browser = await extraChromium.launch({ headless: true });
    const page: Page = await browser.newPage();

    // Переходимо на головну
    await page.goto('/');

    const acceptCookiesButton = page.locator('#onetrust-accept-btn-handler');
    const goToStoreButton = page.locator('[data-qa-action="go-to-store"]');

    await acceptCookiesButton.waitFor({ state: 'visible' });
    await acceptCookiesButton.click();

    await goToStoreButton.waitFor({ state: 'visible' });
    await goToStoreButton.click();

    // Передаємо сторінку з cookies у тести
    await use(page);

    // Закриваємо браузер після тесту
    await browser.close();
  }
});