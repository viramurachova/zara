import { Page, Locator } from '@playwright/test';
export class ItemPage {
    page: Page;
    addToCartButton: Locator;
    closePromoBannerButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addToCartButton = page.locator('[data-qa-action="add-to-cart"]');
        this.closePromoBannerButton = page.locator('[aria-label="Close"]');
    }

    async clickAddToCartButton() {
        await this.addToCartButton.click();
    }


}