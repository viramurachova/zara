import { test as base } from '@playwright/test';
import { chromium } from 'playwright-extra';
import type { Browser, Page, BrowserContext } from 'playwright';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(StealthPlugin());

type StealthFixtures = {
  stealthPage: Page;
};

export const test = base.extend<StealthFixtures>({
  stealthPage: async ({}, use) => {
    const browser: Browser = await chromium.launch({ headless: true });
    const context: BrowserContext = await browser.newContext({
      locale: 'uk-UA',
      geolocation: { latitude: 50.4501, longitude: 30.5234 },
      permissions: ['geolocation'],
      viewport: { width: 1280, height: 720 },
    });
    const page = await context.newPage();

    await use(page);

    await context.close();
    await browser.close();
  },
});