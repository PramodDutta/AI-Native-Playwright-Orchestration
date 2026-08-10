import { expect, type Locator, type Page } from '@playwright/test';
import { Messages, Routes } from '../../enums/app/app';

export class LoginPage {
    constructor(private readonly page: Page) {}

    get emailInput(): Locator {
        return this.page.getByLabel('Email address');
    }
    get passwordInput(): Locator {
        return this.page.getByLabel('Password');
    }
    get signInButton(): Locator {
        return this.page.getByRole('button', { name: 'Sign in' });
    }
    // Ladder exception, documented: the error banner is a styled div with no
    // role or label surface, so getByTestId is the highest stable rung left.
    get errorBanner(): Locator {
        return this.page.getByTestId('login-error');
    }

    async goto(): Promise<void> {
        await this.page.goto(Routes.BANK_LOGIN);
    }

    async login(email: string, password: string): Promise<void> {
        // The app binds its submit handler on load; interacting earlier risks a
        // native form submit. Wait for the page to be fully interactive first.
        await this.page.waitForLoadState('load');
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }

    async loginAndVerify(email: string, password: string, name: string): Promise<void> {
        await this.login(email, password);
        await expect(this.page).toHaveURL(/dashboard/);
        await expect(this.page.getByTestId('account-holder')).toHaveText(name);
    }

    async expectLoginError(): Promise<void> {
        await expect(this.errorBanner).toBeVisible();
        await expect(this.errorBanner).toHaveText(Messages.LOGIN_ERROR);
    }
}
