// scripts/saveStorageState.ts
import { chromium } from '@playwright/test';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.zara.com/');
  await page.locator('#onetrust-accept-btn-handler').click();
  await page.locator('[data-qa-action="go-to-store"]').click();

  // Додаткові дії, якщо треба, як пошук чи скрол

  await context.storageState({ path: 'storage/zara-full-state.json' });
  await browser.close();
})();