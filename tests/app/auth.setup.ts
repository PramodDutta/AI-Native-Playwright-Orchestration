import fs from 'fs';
import path from 'path';
import { test, expect } from '../../fixtures/pom/test-options';
import { StorageStatePaths } from '../../enums/app/app';
import { generateBankUser } from '../../test-data/factories/app/user.factory';

// TTA Bank has no token API: auth lives in localStorage. Register once through
// the real UI, then persist storageState (cookies + localStorage) so every
// dependent project starts pre-authenticated. Same auth-once principle as an
// API-token setup, adapted to a browser-storage app.
test('bank setup: register once and persist storage state', async ({ page, registerPage }) => {
    const user = generateBankUser();

    await registerPage.goto();
    await registerPage.register(user);
    await expect(page.getByTestId('balance-amount')).toHaveText('₹50,000');

    fs.mkdirSync(path.dirname(StorageStatePaths.APP), { recursive: true });
    await page.context().storageState({ path: StorageStatePaths.APP });
    fs.writeFileSync(StorageStatePaths.USER, JSON.stringify(user, null, 2));

    expect(fs.existsSync(StorageStatePaths.APP)).toBe(true);
});
