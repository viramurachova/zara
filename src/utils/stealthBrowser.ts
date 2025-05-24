import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(StealthPlugin());

export async function launchStealthPage() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: 'uk-UA',
    geolocation: { latitude: 50.4501, longitude: 30.5234 },
    permissions: ['geolocation'],
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  return { page, context, browser };
}