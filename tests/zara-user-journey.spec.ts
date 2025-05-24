import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/MainPage';
import { ShoppingBagPage } from '../src/pages/ShoppingBagPage';
import { Page, Browser, BrowserContext } from '@playwright/test';
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import {CookieConsentPage} from '../src/pages/CookieConsentPage'

chromium.use(StealthPlugin());

test.describe('Unauthenticated User Attempts to Register with Invalid Data During Checkout', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  test.beforeEach(async () => {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({
      locale: 'uk-UA',
      geolocation: { latitude: 50.4501, longitude: 30.5234 },
      permissions: ['geolocation'],
      viewport: { width: 1280, height: 720 },
    });
    page = await context.newPage();
  });

  test.afterEach(async () => {
    await context.close();
    await browser.close();
  });

  test('TC 1: Search Item by Name', async () => {
    const cookieConsentPage = new CookieConsentPage(page);
    const mainPage = new MainPage(page);
    const itemName = 'top';

    await page.goto('https://www.zara.com/');
    await cookieConsentPage.goToStore();
    await cookieConsentPage.acceptCookies();
    
    await mainPage.clickSearchButton();
    await mainPage.fillSearchField(itemName);

    const searchResults = await mainPage.getAllSearchResults(itemName);
    console.log('Search Results:', searchResults);

    for (const result of searchResults) {
      expect(result.toLowerCase()).toContain(itemName.toLowerCase());
    }
  });

  test('TC 2: Add All Available Sizes to Shopping Bag if Available Sizes ≥ 4', async () => {
    const cookieConsentPage = new CookieConsentPage(page);
    const mainPage = new MainPage(page);
    const shoppingBagPage = new ShoppingBagPage(page);
    const itemName = 'boots';
    const minSizes = 4;

    
    await page.goto('https://www.zara.com/');
    await cookieConsentPage.goToStore();
    await cookieConsentPage.acceptCookies();

    await mainPage.clickSearchButton();
    await mainPage.fillSearchField(itemName);

    const { productName, sizes: expectedSizes } = await mainPage.addFirstItemWithEnoughSizes(minSizes);

    await mainPage.openShoppingBag();
    const actualNames = await shoppingBagPage.getAllProductNames();
    const actualSizes = await shoppingBagPage.getAllProductSizes();

    for (const actualName of actualNames) {
      expect(actualName).toBe(productName);
    }

    expect(actualSizes.sort()).toEqual(expectedSizes.sort());
  });

  test('TC 3: Remove every second item from the shopping bag', async () => {
    const cookieConsentPage = new CookieConsentPage(page);
    const mainPage = new MainPage(page);
    const shoppingBagPage = new ShoppingBagPage(page);
    const itemName = 'boots';
    const minSizes = 4;

    
    await page.goto('https://www.zara.com/');
    await cookieConsentPage.goToStore();
    await cookieConsentPage.acceptCookies();

    await mainPage.clickSearchButton();
    await mainPage.fillSearchField(itemName);
    await mainPage.addFirstItemWithEnoughSizes(minSizes);

    await mainPage.openShoppingBag();
    const productSizesInBag = await shoppingBagPage.getAllProductSizes();
    expect(productSizesInBag.length).toBeGreaterThan(0);

    const remainingProductSizes = await shoppingBagPage.removeEverySecondItem();
    const updatedProductSizesInBag = await shoppingBagPage.getAllProductSizes();

    const expectedRemainingSizes = productSizesInBag.filter((_, index) => index % 2 === 0);
    expect(updatedProductSizesInBag.sort()).toEqual(expectedRemainingSizes.sort());
  });
});