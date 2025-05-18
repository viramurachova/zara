import { Page, Locator } from '@playwright/test';
export class ItemPage {
    page: Page;
    addToCartButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addToCartButton = page.locator('[data-qa-action="add-to-cart"]');
    }

    async clickAddToCartButton() {
        await this.addToCartButton.click();
    }
}