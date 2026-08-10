import { test as base } from '@playwright/test';
import { RegisterPage } from '../../pages/app/register.page';
import { LoginPage } from '../../pages/app/login.page';
import { DashboardPage } from '../../pages/app/dashboard.page';
import { SendPage } from '../../pages/app/send.page';

export type FrameworkFixtures = {
    registerPage: RegisterPage;
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
    sendPage: SendPage;
};

// Dependency injection: tests destructure page objects, they never construct them.
export const test = base.extend<FrameworkFixtures>({
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
    sendPage: async ({ page }, use) => {
        await use(new SendPage(page));
    },
});
