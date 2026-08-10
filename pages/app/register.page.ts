import { expect, type Locator, type Page } from '@playwright/test';
import { Routes } from '../../enums/app/app';
import type { BankUser } from '../../fixtures/api/schemas/app/userSchema';

export class RegisterPage {
    constructor(private readonly page: Page) {}

    get nameInput(): Locator {
        return this.page.getByLabel('Full name');
    }
    get emailInput(): Locator {
        return this.page.getByLabel('Email address');
    }
    get phoneInput(): Locator {
        return this.page.getByLabel('Mobile number');
    }
    get passwordInput(): Locator {
        return this.page.getByLabel('Password', { exact: true });
    }
    get confirmInput(): Locator {
        return this.page.getByLabel('Confirm password');
    }
    get submitButton(): Locator {
        return this.page.getByRole('button', { name: 'Open account' });
    }

    async goto(): Promise<void> {
        await this.page.goto(Routes.BANK_REGISTER);
    }

    async register(user: BankUser): Promise<void> {
        await this.nameInput.fill(user.name);
        await this.emailInput.fill(user.email);
        await this.phoneInput.fill(user.phone);
        await this.passwordInput.fill(user.password);
        await this.confirmInput.fill(user.password);
        await this.submitButton.click();
        await expect(this.page).toHaveURL(/dashboard/);
    }
}
