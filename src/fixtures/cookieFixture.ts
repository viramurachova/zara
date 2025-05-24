import { test as base, Page, Browser, BrowserContext } from '@playwright/test';
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
      geolocation: { latitude: 50.4501, longitude: 30.5234 },
      permissions: ['geolocation'],
      viewport: { width: 1280, height: 720 },
    });

    const page: Page = await context.newPage();

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    await page.goto('https://www.zara.com/ua/en/');

    await page.addStyleTag({
      content: `
    .geolocation-modal__container {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
    #onetrust-consent-sdk,
    .optanon-alert-box-wrapper,
    .zds-cookie-banner {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
      `,
    });

    await use(page);
    await browser.close();
  },
});