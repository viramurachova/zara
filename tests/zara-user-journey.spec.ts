import { test } from '../src/fixtures/cookieFixture';
import { expect } from '@playwright/test';
import { MainPage } from '../src/pages/MainPage';
import { ShoppingBagPage } from '../src/pages/ShoppingBagPage';

test.describe('Unauthenticated User Attempts to Register with Invalid Data During Checkout', () => {

  test('TC 1: Search Item by Name', async ({ page }) => {
    const mainPage = new MainPage(page);
    const itemName = 'top';

    await page.goto('https://www.zara.com/ua/en/');

    const acceptCookies = page.locator('#onetrust-accept-btn-handler');
    if (await acceptCookies.isVisible({ timeout: 3000 })) {
      await acceptCookies.click();
    }

    const stayInStore = page.locator('[data-qa-action="stay-in-store"]');
    if (await stayInStore.isVisible({ timeout: 3000 })) {
      await stayInStore.click();
    }

    await mainPage.clickSearchButton();
    await mainPage.fillSearchField(itemName);

    const searchResults = await mainPage.getAllSearchResults(itemName);
    console.log('Search Results:', searchResults);

    for (const result of searchResults) {
      console.log(`Checking result: "${result}"`);
      expect(result.toLowerCase()).toContain(itemName.toLowerCase());
    }
  });

  test('TC 2: Add All Available Sizes to Shopping Bag if Available Sizes ≥ 4', async ({ page }) => {
    
    const mainPage = new MainPage(page);
    const shoppingBagPage = new ShoppingBagPage(page);
    const itemName = 'boots';
    const minSizes = 4;

    await page.goto('https://www.zara.com/ua/en/');

    const acceptCookies = page.locator('#onetrust-accept-btn-handler');
    if (await acceptCookies.isVisible({ timeout: 3000 })) {
      await acceptCookies.click();
    }

    const stayInStore = page.locator('[data-qa-action="stay-in-store"]');
    if (await stayInStore.isVisible({ timeout: 3000 })) {
      await stayInStore.click();
    }


    await mainPage.clickSearchButton();
    await mainPage.fillSearchField(itemName);

    const { productName, sizes: expectedSizes } = await mainPage.addFirstItemWithEnoughSizes(minSizes);
    console.log('Added item name:', productName);
    console.log('Added sizes:', expectedSizes);

    await mainPage.openShoppingBag();
    const actualNames = await shoppingBagPage.getAllProductNames();
    const actualSizes = await shoppingBagPage.getAllProductSizes();
    console.log('Expected name:', productName);
    console.log('Expected sizes:', expectedSizes);
    console.log('Actual item names in bag:', actualNames);
    console.log('Actual sizes in bag:', actualSizes);

    for (const actualName of actualNames) {
      console.log(`Comparing item name: actual = "${actualName}", expected = "${productName}"`);
      expect(actualName).toBe(productName);
    }

    expect(actualSizes.sort()).toEqual(expectedSizes.sort());
    await mainPage.clickContinueButton();
  });

  test('TC 3: Remove every second item from the shopping bag', async ({ page }) => {
    const mainPage = new MainPage(page);
    const shoppingBagPage = new ShoppingBagPage(page);
    const itemName = 'boots';
    const minSizes = 4;

    await page.goto('https://www.zara.com/ua/en/');

    const acceptCookies = page.locator('#onetrust-accept-btn-handler');
    if (await acceptCookies.isVisible({ timeout: 3000 })) {
      await acceptCookies.click();
    }

    const stayInStore = page.locator('[data-qa-action="stay-in-store"]');
    if (await stayInStore.isVisible({ timeout: 3000 })) {
      await stayInStore.click();
    }


    await mainPage.clickSearchButton();
    await mainPage.fillSearchField(itemName);
    await mainPage.addFirstItemWithEnoughSizes(minSizes);

    await mainPage.openShoppingBag();
    const productSizesInBag = await shoppingBagPage.getAllProductSizes();
    expect(productSizesInBag.length).toBeGreaterThan(0);

    const remainingProductSizes = await shoppingBagPage.removeEverySecondItem();
    const updatedProductSizesInBag = await shoppingBagPage.getAllProductSizes();

    const expectedRemainingSizes = productSizesInBag.filter((_, index) => index % 2 === 0);

    console.log('Expected remaining sizes:', expectedRemainingSizes);
    console.log('Remaining sizes in cart after removal:', updatedProductSizesInBag);

    expect(updatedProductSizesInBag.sort()).toEqual(expectedRemainingSizes.sort());

  });

  test.skip('TC 4:  Proceed to Checkout for Unauthenticated User ', async ({ page }) => {
    
  });

  test.skip('TC 5: Register with Incorrect Data and error handling', async ({ page }) => {
    
  });

});  