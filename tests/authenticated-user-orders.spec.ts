import { test, expect } from '@playwright/test';
import { getStorageState } from '../helper/storageState';
import { MainPage } from '../pages/MainPage';

test.use({
  storageState: getStorageState('authenticated'),
});

test.skip('User can access orders page', async ({ page }) => {
  const mainPage = new MainPage(page)
  await page.goto('https://www.zara.com/ua/');
  
});