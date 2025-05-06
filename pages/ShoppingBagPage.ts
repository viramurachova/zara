import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class ShoppingBagPage {
  page: Page;
  productNames: Locator;
  productSizes: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productNames = page.locator('.shop-cart-item-header__description-link.link');
    this.productSizes = page.locator('.shop-cart-item-details-base__size');
  }

  async getAllProductNames(): Promise<string[]> {
    await this.productNames.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await this.productNames.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const name = await this.productNames.nth(i).innerText();
      names.push(name.trim());
    }

    console.log(`🛒 Found ${names.length} product name(s) in bag:`, names);
    return names;
  }

  async getAllProductSizes(): Promise<string[]> {
    await this.productNames.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await this.productSizes.count();
    const sizes: string[] = [];

    for (let i = 0; i < count; i++) {
      sizes.push((await this.productSizes.nth(i).innerText()).trim());
    }
    console.log('Sizes in bag:', sizes);
    return sizes;
  }
  
}