import { test as base, Browser, BrowserContext, Page } from '@playwright/test';
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// ⏺ Додаємо Stealth плагін
chromium.use(StealthPlugin());

// 🧩 Типи для того, що ми хочемо передавати в тести
type StealthFixtures = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
};

// 🧪 Розширюємо Playwright test
export const test = base.extend<StealthFixtures>({
  // 1. Створюємо браузер
  browser: async ({}, use) => {
    const browser = await chromium.launch({ headless: true });
    await use(browser);              // передаємо у тест
    await browser.close();          // ❗ закриваємо після тесту
  },

  // 2. Створюємо context для кожного тесту
  context: async ({ browser }, use) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
    });
    await use(context);             // передаємо у тест
    await context.close();          // ❗ закриваємо після тесту
  },

  // 3. Створюємо сторінку
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);                // передаємо у тест
  },
});

// ⏺ Якщо потрібно, залишаємо expect
export { expect } from '@playwright/test';