import fs from 'fs';
import { test, expect } from '../../../fixtures/pom/test-options';
import { StorageStatePaths } from '../../../enums/app/app';
import { BankUserSchema, type BankUser } from '../../../fixtures/api/schemas/app/userSchema';

const TRANSFER_AMOUNT = 500;
const BENEFICIARY = 'Aarav Sharma';

let user: BankUser;

test.beforeAll(() => {
    // Parse, never trust: even our own setup artifact goes through the schema.
    user = BankUserSchema.parse(JSON.parse(fs.readFileSync(StorageStatePaths.USER, 'utf8')));
});

test(
    'authenticated user sends money and the balance reconciles',
    { tag: ['@e2e', '@smoke'] },
    async ({ dashboardPage, sendPage }) => {
        await test.step('GIVEN an authenticated user with the welcome balance', async () => {
            await dashboardPage.goto();
            await expect(dashboardPage.accountHolder).toHaveText(user.name);
            await expect(dashboardPage.balanceAmount).toHaveText('₹50,000');
        });

        await test.step(`WHEN the user sends ₹${TRANSFER_AMOUNT} to ${BENEFICIARY}`, async () => {
            await sendPage.goto();
            await sendPage.sendMoney(BENEFICIARY, TRANSFER_AMOUNT, 'Food', 'Dinner split');
        });

        await test.step('THEN the balance drops by exactly the transfer amount', async () => {
            await expect(sendPage.topbarBalance).toHaveText('₹49,500');
            await dashboardPage.goto();
            await expect(dashboardPage.balanceAmount).toHaveText('₹49,500');
            await expect(dashboardPage.recentRows.first()).toContainText(BENEFICIARY);
        });
    }
);
