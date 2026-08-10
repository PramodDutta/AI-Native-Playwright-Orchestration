import { type Locator, type Page } from '@playwright/test';
import { Routes } from '../../enums/app/app';

export class DashboardPage {
    constructor(private readonly page: Page) {}

    // Ladder exceptions, documented: these are display-only value nodes with no
    // interactive role; data-testid is the stable contract the app publishes.
    get balanceAmount(): Locator {
        return this.page.getByTestId('balance-amount');
    }
    get accountHolder(): Locator {
        return this.page.getByTestId('account-holder');
    }
    get recentRows(): Locator {
        return this.page.getByTestId('txn-row');
    }
    get sendMoneyLink(): Locator {
        return this.page.getByRole('link', { name: 'Send money' });
    }
    get logoutButton(): Locator {
        return this.page.getByRole('button', { name: 'Log out of TTA Bank' });
    }

    async goto(): Promise<void> {
        await this.page.goto(Routes.BANK_DASHBOARD);
    }

    async logout(): Promise<void> {
        await this.logoutButton.click();
    }
}
