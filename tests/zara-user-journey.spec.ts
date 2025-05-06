// import { test, expect } from '@playwright/test';
// import { getStorageState } from '../helper/storageState';
// import { MainPage } from '../pages/MainPage';
// import { ShoppingBagPage } from '../pages/ShoppingBagPage';


// test.describe('Zara user journey: from cookie modal to registration', () => {
//   test.use({
//     storageState: getStorageState('authenticated'),
//   });


//   test('D-1 Search Boots and add all sizes', async ({ page }) => {
//     const mainPage = new MainPage(page);
//     const shoppingBagPage = new ShoppingBagPage(page);
//     const itemName = 'T-shirts';
//     const minSizes = 4;
    
//     await page.goto('/');
//     await mainPage.clickSearchButton();
//     await mainPage.fillSearchField(itemName);
//     await mainPage.addFirstItemWithEnoughSizes(4); 
//     await mainPage.openShoppingBag();
//     await expect(page).toHaveURL('https://www.zara.com/ua/en/shop/cart');
//     await mainPage.clickContinueButton();
//   });
// });



import { test, expect } from '@playwright/test';
import { getStorageState } from '../helper/storageState';
import { MainPage } from '../pages/MainPage';
import { ShoppingBagPage } from '../pages/ShoppingBagPage';

test.describe('Zara user journey: from cookie modal to registration', () => {
  test.use({
    storageState: getStorageState('authenticated'),
  });

  test('D-1 Search T-shirts and add all sizes', async ({ page }) => {
    const mainPage = new MainPage(page);
    const shoppingBagPage = new ShoppingBagPage(page);
    const itemName = 'T-shirts';
    const minSizes = 4;

    await page.goto('/');
    await mainPage.clickSearchButton();
    await mainPage.fillSearchField(itemName);

    
    const { productName, sizes: expectedSizes } = await mainPage.addFirstItemWithEnoughSizes(minSizes);
    console.log('Added item name:', productName);
    console.log('Added sizes:', expectedSizes);

    await mainPage.openShoppingBag();
    await expect(page).toHaveURL('https://www.zara.com/ua/en/shop/cart');

    const actualNames = await shoppingBagPage.getAllProductNames();
    const actualSizes = await shoppingBagPage.getAllProductSizes();
    console.log('Expected name:', productName);
    console.log('Expected sizes:', expectedSizes);
    console.log('Actual item names in bag:', actualNames);
    console.log('Actual sizes in bag:', actualSizes);


    for (const actualName of actualNames) {
      console.log(`🔍 Comparing item name: actual = "${actualName}", expected = "${productName}"`);
      expect(actualName).toBe(productName);
    }

    expect(actualSizes.sort()).toEqual(expectedSizes.sort());
    await mainPage.clickContinueButton();
  });
});