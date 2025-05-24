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
  private lowAvailableSize: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchButton = page.locator('[data-qa-id="header-search-text-link"]');
    this.searchInputField = page.locator('#search-home-form-combo-input');
    this.firstSearchResult = page.locator('[data-qa-qualifier="media-image"]');
    this.cartButton = page.getByTestId('layout-header-go-to-cart');
    this.sizeSelector = page.locator('[data-qa-action="product-grid-open-size-selector"]');
    this.shoppingBag = page.locator('[data-qa-id="layout-header-go-to-cart"]');
    this.productName = page.locator('.product-grid-product-info__main-info');
    this.availableSize = page.locator('.size-selector-sizes__size.size-selector-sizes-size.size-selector-sizes-size--enabled');
    this.lowAvailableSize = page.locator('[data-qa-action="size-low-on-stock"]');
    this.closeButton = page.locator('.zds-drawer-close-button');
    this.continueButton = page.locator('[data-qa-id="shop-continue"]');

  }

  async clickContinueButton(): Promise<void> {
    await this.continueButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.continueButton.click();
  }

  async clickSearchButton(): Promise<void> {
    await this.searchButton.waitFor({ state: 'visible', timeout: 20000 });
    await this.searchButton.scrollIntoViewIfNeeded();
    await this.searchButton.click({ trial: true });
    await this.searchButton.click();
  }

  async getAllSearchResults(itemName: string): Promise<string[]> {
    const allResults = this.page.locator('.product-grid-product-info__main-info');
    const productNames: string[] = [];
    const count = await allResults.count();

    for (let i = 0; i < count; i++) {
      const productName = await allResults.nth(i).innerText();
      productNames.push(productName.trim());
    }
    const searchedResults = productNames.filter((productName) =>
      productName.toLowerCase().includes(itemName.toLowerCase())
    );
    return searchedResults;
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

  async addFirstItemWithEnoughSizes(minSizes: number): Promise<{ sizes: string[]; productName: string }> {
    const totalItems = await this.sizeSelector.count();

    for (let i = 0; i < totalItems; i++) {
      await this.sizeSelector.nth(i).waitFor({ state: 'visible', timeout: 5000 });
      await this.sizeSelector.nth(i).click();

      await this.availableSize.first().waitFor({ state: 'visible', timeout: 5000 });
      const count = await this.availableSize.count();
      console.log(`Item ${i + 1} has ${count} available sizes`);

      if (count >= minSizes) {
        const rawProductName = await this.getProductNameByIndex(i);
        const productName = rawProductName.split('\n')[0].trim();
        const clickedSizes: string[] = [];

        for (let j = 0; j < count; j++) {
          const sizeLocator = this.availableSize.nth(j);

          await sizeLocator.waitFor({ state: 'visible', timeout: 5000 });
          const sizeText = await sizeLocator.innerText();

          await sizeLocator.click();

          await this.closeButton.waitFor({ state: 'visible', timeout: 3000 });
          await this.closeButton.click();

          const cleanSize = sizeText.trim().split(/\s+/)[0];
          clickedSizes.push(cleanSize);

          if (j === count - 1) break;

          await this.sizeSelector.nth(i).click();
        }

        console.log('Final added item:', { productName, clickedSizes });
        return { sizes: clickedSizes, productName };
      }
    }
    throw new Error(`❗ No item found with at least ${minSizes} available sizes`);
  }
}