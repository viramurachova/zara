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

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });

    await page.goto('https://www.zara.com/ua/en/');

    await page.addStyleTag({
      content: `
        #onetrust-consent-sdk,
        .optanon-alert-box-wrapper,
        .zds-cookie-banner,
        .zds-dialog-geolocation,
        .zds-dialog,
        .zds-overlay,
        [aria-label="Cookie banner"],
        [aria-label="Preferences Center"],
        [aria-label="Geolocation Modal"],
        [aria-label="Close"]:not([data-qa-action]) {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
      `
    });

    console.log('Loaded URL:', await page.url());

    await use(page);
    await browser.close();
  }
});