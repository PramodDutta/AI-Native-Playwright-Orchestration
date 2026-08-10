import { test, expect } from '../../../fixtures/pom/test-options';
import { generateBankUser } from '../../../test-data/factories/app/user.factory';

// These specs exercise the unauthenticated flows: start from a clean state.
test.use({ storageState: { cookies: [], origins: [] } });

test('rejects an unknown email with a visible error', { tag: '@functional' }, async ({ loginPage }) => {
    const stranger = generateBankUser();
    await loginPage.goto();
    await loginPage.login(stranger.email, stranger.password);
    await loginPage.expectLoginError();
});

test(
    'a freshly registered user can sign out of context and sign back in',
    { tag: ['@functional', '@smoke'] },
    async ({ registerPage, loginPage, dashboardPage }) => {
        const user = generateBankUser();

        await test.step('GIVEN the user registers through the real UI', async () => {
            await registerPage.goto();
            await registerPage.register(user);
        });

        await test.step("WHEN the user logs out with the app's own control", async () => {
            await dashboardPage.logout();
            await loginPage.signInButton.waitFor();
        });

        await test.step('THEN the same credentials sign back in', async () => {
            await loginPage.goto();
            await loginPage.loginAndVerify(user.email, user.password, user.name);
        });
    }
);
