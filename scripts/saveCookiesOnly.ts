//npx tsx scripts/saveCookiesOnly.ts

import { chromium } from '@playwright/test';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.zara.com/');
  
  const acceptCookiesButton = page.locator('#onetrust-accept-btn-handler');
  const goToStoreButton = page.locator('[data-qa-action="go-to-store"]');

  await acceptCookiesButton.waitFor({ state: 'visible' });
  await acceptCookiesButton.click();

  await goToStoreButton.waitFor({ state: 'visible' });
  await goToStoreButton.click();

  // Зберігаємо тільки cookies
  const cookies = await context.cookies();
  fs.writeFileSync(
    'storage/zara-cookies-only.json',
    JSON.stringify({ cookies }, null, 2)
  );

  await browser.close();
})();