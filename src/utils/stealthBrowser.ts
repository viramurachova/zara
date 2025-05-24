import { chromium } from 'playwright-extra';
import { Page } from 'playwright'; 
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(StealthPlugin());

export const launchStealthPage = async (): Promise<Page> => {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    locale: 'uk-UA',
    geolocation: { latitude: 50.4501, longitude: 30.5234 },
    permissions: ['geolocation'],
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
  });

  await page.goto('https://www.zara.com/ua/en/', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  const acceptCookies = page.locator('#onetrust-accept-btn-handler');
  if (await acceptCookies.isVisible({ timeout: 3000 })) {
    await acceptCookies.click();
  }

  const stayInStore = page.locator('[data-qa-action="stay-in-store"]');
  if (await stayInStore.isVisible({ timeout: 3000 })) {
    await stayInStore.click();
  }

  return page;
};