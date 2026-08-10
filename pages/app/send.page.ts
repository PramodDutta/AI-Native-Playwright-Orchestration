import { expect, type Locator, type Page } from '@playwright/test';
import { Routes } from '../../enums/app/app';

export class SendPage {
    constructor(private readonly page: Page) {}

    beneficiaryOption(fullName: string): Locator {
        return this.page.getByRole('option', { name: `Pay ${fullName}` });
    }
    get amountInput(): Locator {
        return this.page.getByLabel('Amount in rupees');
    }
    get categorySelect(): Locator {
        return this.page.getByLabel('Expense category');
    }
    get noteInput(): Locator {
        return this.page.getByLabel('Transfer note');
    }
    get reviewButton(): Locator {
        return this.page.getByRole('button', { name: 'Review transfer' });
    }
    get confirmButton(): Locator {
        return this.page.getByRole('button', { name: 'Confirm and send' });
    }
    get topbarBalance(): Locator {
        return this.page.getByTestId('topbar-balance');
    }
    get successToast(): Locator {
        return this.page.getByTestId('toast-success');
    }

    async goto(): Promise<void> {
        await this.page.goto(Routes.BANK_SEND);
    }

    async sendMoney(beneficiary: string, amount: number, category: string, note: string): Promise<void> {
        await this.beneficiaryOption(beneficiary).click();
        await this.amountInput.fill(String(amount));
        await this.categorySelect.selectOption(category);
        await this.noteInput.fill(note);
        await this.reviewButton.click();
        await expect(this.page.getByTestId('confirm-dialog')).toBeVisible();
        await this.confirmButton.click();
        await expect(this.successToast).toBeVisible();
    }
}
