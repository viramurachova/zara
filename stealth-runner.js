import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(StealthPlugin());

const run = async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('⏳ Navigating to Zara...');
    await page.goto('https://www.zara.com', { waitUntil: 'networkidle' });
    console.log('Page loaded successfully!');
  } catch (e) {
    console.error('Failed to load page:', e.message);
  }

  await page.screenshot({ path: 'zara-stealth.png', fullPage: true });
  await browser.close();
};

run();