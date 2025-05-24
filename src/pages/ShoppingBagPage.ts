import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
export class ShoppingBagPage {
  page: Page;
  productNames: Locator;
  productSizes: Locator;
  removeButton: Locator;
  undoToast: Locator;
  orderIdLocators: Locator;
  imageProduct: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productNames = page.locator('.shop-cart-item-header__description-link.link');
    this.productSizes = page.locator('.shop-cart-item-details-base__size');
    this.removeButton = page.locator('[data-qa-action="remove-order-item]');
    this.undoToast = page.locator('.zds-toast-action');
    this.orderIdLocators = page.locator('[data-qa-order-item-id]')
    this.imageProduct = page.locator('[data-qa-qualifier="media-image"]')
  }

  async getAllProductNames(): Promise<string[]> {
    await this.productNames.first().waitFor({ state: 'attached', timeout: 5000 });
    //await this.productNames.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await this.productNames.count();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const name = await this.productNames.nth(i).innerText();
      names.push(name.trim());
    }

    console.log(`Found ${names.length} product name(s) in bag:`, names);
    return names;
  }


  async getAllProductSizes(): Promise<string[]> {
    await this.productSizes.first().waitFor({ state: 'visible', timeout: 5000 });
    const count = await this.productSizes.count();
    const sizes: string[] = [];

    for (let i = 0; i < count; i++) {
      sizes.push((await this.productSizes.nth(i).innerText()).trim());
    }
    console.log('Sizes in bag:', sizes);
    return sizes;
  }

  async removeEverySecondItem(): Promise<void> {
    const orderIds = await this.getAllOrderIds();
    console.log('Order IDs in cart:', orderIds);
    const itemsToRemove: string[] = [];

    for (let i = 0; i < orderIds.length; i++) {
      if (i % 2 !== 0) {
        itemsToRemove.push(orderIds[i]);
      }
    }
    console.log('Order IDs to remove:', itemsToRemove);
    for (const orderId of itemsToRemove) {

      console.log(`Removing product with Order ID: ${orderId}`);
      const deleteButtonByID = this.page.locator(`[data-qa-order-item-id="${orderId}"]`);
      const deleteButton = deleteButtonByID.locator('[data-qa-action="remove-order-item"]')
      await deleteButtonByID.scrollIntoViewIfNeeded();
      await deleteButtonByID.hover();
      await deleteButton.click({ force: true });

      console.log(`Clicked removeButton for Order ID: ${orderId}`);
      await deleteButtonByID.waitFor({ state: 'detached', timeout: 7000 });
    }

    const remainingOrderIds = await this.getAllOrderIds();
    console.log('Remaining Order IDs after removal:', remainingOrderIds);

    const expectedRemainingItems = orderIds.filter(id => !itemsToRemove.includes(id));
    console.log('Expected remaining Order IDs:', expectedRemainingItems);

    expect(remainingOrderIds).toEqual(expectedRemainingItems);
  }

  async getAllOrderIds(): Promise<string[]> {
    const orderIdLocators = this.page.locator('[data-qa-order-item-id]');
    const count = await orderIdLocators.count();
    const orderIds: string[] = [];

    for (let i = 0; i < count; i++) {
      const orderId = await orderIdLocators.nth(i).getAttribute('data-qa-order-item-id');
      orderIds.push(orderId!);
    }
    return orderIds;
  }
}