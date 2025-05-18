import { Page, Locator } from '@playwright/test';
export class ModalPage {
    page: Page;
    acceptCookiesButton: Locator;
    rejectCookiesButton: Locator;
    cookiesSettingButton: Locator;
    cookiesPolicyLink: Locator;
    modalWindow: Locator;

    constructor (page:Page) {
        this.page = page;
        this.modalWindow = this.page.locator('.ot-sdk-row')
        this.acceptCookiesButton = this.page.locator('#onetrust-accept-btn-handler');
        this.rejectCookiesButton = this.page.locator('#onetrust-reject-all-handler');
        this.cookiesSettingButton = this.page.locator('onetrust-pc-btn-handler');
        this.cookiesPolicyLink = this.page.locator('.ot-cookie-policy-link');
    }

    async clickAcceptCookiesButton() {
        await this.acceptCookiesButton.click();
    }

    async clickRejectCookiesButton() {
        await this.rejectCookiesButton.click();
    }
}