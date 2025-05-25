import { MainPage } from '../src/pages/MainPage';
import { ShoppingBagPage } from '../src/pages/ShoppingBagPage';
import {CookieConsentPage} from '../src/pages/CookieConsentPage'
import { test, expect } from '../src/fixtures/stealth-fixtures.ts';

test.describe('Unauthenticated User Attempts to Register with Invalid Data During Checkout', () => {
  test('TC 1: Search Item by Name', async ({page}) => {
    const cookieConsentPage = new CookieConsentPage(page);
    const mainPage = new MainPage(page);
    const itemName = 'top';

    await page.goto('ua/en');
    await cookieConsentPage.acceptCookies();
    await cookieConsentPage.goToStore();
    
    await mainPage.clickSearchButton();
    await mainPage.fillSearchField(itemName);

    const searchResults = await mainPage.getAllSearchResults(itemName);
    console.log('Search Results:', searchResults);

    for (const result of searchResults) {
      expect(result.toLowerCase()).toContain(itemName.toLowerCase());
    }
  });

  test('TC 2: Add All Available Sizes to Shopping Bag if Available Sizes ≥ 4', async ({page}) => {
    const cookieConsentPage = new CookieConsentPage(page);
    const mainPage = new MainPage(page);
    const shoppingBagPage = new ShoppingBagPage(page);
    const itemName = 'skirt';
    const minSizes = 6;

    
    await page.goto('ua/en');
    await cookieConsentPage.acceptCookies();
    await cookieConsentPage.goToStore();
    
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

  test('TC 3: Remove every second item from the shopping bag', async ({page}) => {
    const cookieConsentPage = new CookieConsentPage(page);
    const mainPage = new MainPage(page);
    const shoppingBagPage = new ShoppingBagPage(page);
    const itemName = 'shirt';
    const minSizes = 6;

    
    await page.goto('ua/en');
    await cookieConsentPage.acceptCookies();
    await cookieConsentPage.goToStore();
    

    await mainPage.clickSearchButton();
    await mainPage.fillSearchField(itemName);
    await mainPage.addFirstItemWithEnoughSizes(minSizes);

    await mainPage.openShoppingBag();
    const productSizesInBag = await shoppingBagPage.getAllProductSizes();
    expect(productSizesInBag.length).toBeGreaterThan(0);

    await shoppingBagPage.removeEverySecondItem();
    const updatedProductSizesInBag = await shoppingBagPage.getAllProductSizes();

    const expectedRemainingSizes = productSizesInBag.filter((_, index) => index % 2 === 0);
    expect(updatedProductSizesInBag.sort()).toEqual(expectedRemainingSizes.sort());
  });
});