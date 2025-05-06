import { Page, Locator } from '@playwright/test';

export class MainPage {
  private page: Page;
  private searchButton: Locator;
  private cartButton: Locator;
  private searchInputField: Locator;
  private firstSearchResult: Locator;
  private sizeSelector: Locator;
  private shoppingBag: Locator;
  private productName: Locator;
  private availableSize: Locator;
  private closeButton: Locator;
  private continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchButton = page.locator('[data-qa-id="header-search-text-link"]');
    this.searchInputField = page.locator('#search-home-form-combo-input');
    this.firstSearchResult = page.locator('[data-qa-qualifier="media-image"]');
    this.cartButton = page.getByTestId('layout-header-go-to-cart');
    this.sizeSelector = page.locator('[data-qa-action="product-grid-open-size-selector"]'); //data-qa-action="product-grid-open-size-selector"
    this.shoppingBag = page.locator('[data-qa-id="layout-header-go-to-cart"]');
    this.productName = page.locator('.product-grid-product-info__main-info');
    this.availableSize = page.locator('[data-qa-action="size-in-stock"]');
    this.closeButton = page.locator('[aria-label="close"]');
    this.continueButton = page.locator('[data-qa-id="shop-continue"]');
    
  }

  async clickContinueButton(): Promise<void> {
    await this.continueButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.continueButton.click();
  }
  

  async clickSearchButton(): Promise<void> {
    await this.searchButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchButton.click();
  }

  async fillSearchField(itemName: string): Promise<void> {
    await this.searchInputField.click();
    await this.page.keyboard.type(itemName);
    await this.page.keyboard.press('Enter');
    await this.firstSearchResult.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async openShoppingBag(): Promise<void> {
    await this.shoppingBag.click();
  }

  async getProductNameByIndex(index: number): Promise<string> {
    return (await this.productName.nth(index).innerText()).trim();
  }

  // async clickAllAvailableSizes(): Promise<string[]> {
  //   const clickedSizes: string[] = [];
  
  //   await this.sizeSelector.first().waitFor({ state: 'visible', timeout: 5000 });
  //   await this.sizeSelector.first().click();
  
  //   await this.availableSize.first().waitFor({ state: 'visible', timeout: 5000 });
  //   const count = await this.availableSize.count();
  //   console.log(`Found ${count} available sizes`);
  
  //   for (let i = 0; i < count; i++) {
  //     const sizeLocator = this.availableSize.nth(i);
  //     const sizeText = await sizeLocator.innerText();
  
  //     await sizeLocator.click();
  
  //     await this.closeButton.waitFor({ state: 'visible', timeout: 3000 });
  //     await this.closeButton.click();
  
  //     clickedSizes.push(sizeText.trim());
  
  //     if (i === count - 1) break;
  
  //     await this.sizeSelector.first().click();
  //     await this.availableSize.first().waitFor({ state: 'visible', timeout: 5000 });
  //   }
  
  //   console.log('✅ Clicked all available sizes:', clickedSizes);
  //   return clickedSizes;
  // }

  async addFirstItemWithEnoughSizes(minSizes: number): Promise<{ sizes: string[]; productName: string }> {
    const totalItems = await this.sizeSelector.count();
  
    for (let i = 0; i < totalItems; i++) {
      // Відкрити SizeSelector для поточного айтема
      await this.sizeSelector.nth(i).waitFor({ state: 'visible', timeout: 5000 });
      await this.sizeSelector.nth(i).click();
  
      // Дочекатися, поки зʼявляться доступні розміри
      await this.availableSize.first().waitFor({ state: 'visible', timeout: 5000 });
      const count = await this.availableSize.count();
      console.log(`🧮 Item ${i + 1} has ${count} available sizes`);
  
      // Якщо кількість доступних розмірів >= minSizes — додаємо всі до корзини
      if (count >= minSizes) {
        const rawProductName = await this.getProductNameByIndex(i);
        const productName = rawProductName.split('\n')[0].trim();
        const clickedSizes: string[] = [];
  
        for (let j = 0; j < count; j++) {
          const sizeLocator = this.availableSize.nth(j);
          const sizeText = await sizeLocator.innerText();
  
          await sizeLocator.click();
          await this.closeButton.waitFor({ state: 'visible', timeout: 3000 });
          await this.closeButton.click();
  
          clickedSizes.push(sizeText.trim());
  
          if (j === count - 1) break; // ✅ Зупинити цикл після останнього розміру
  
          // Відкрити селектор знову для наступного кліку
          await this.sizeSelector.nth(i).click();
          await this.availableSize.first().waitFor({ state: 'visible', timeout: 5000 });
        }
  
        console.log('Final added item:', { productName, clickedSizes });
        return { sizes: clickedSizes, productName };
      }
  
      // Якщо не відповідає умові — переходимо до наступного айтема
    }
  
    throw new Error(`❗ No item found with at least ${minSizes} available sizes`);
  }
  



}