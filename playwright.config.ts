import { defineConfig, devices } from '@playwright/test';
import { StorageStatePaths } from './enums/app/app';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? [['blob'], ['html']] : [['list'], ['html', { open: 'never' }]],
    timeout: 60_000,
    expect: { timeout: 10_000 },
    use: {
        baseURL: 'https://app.thetestingacademy.com',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: 10_000,
        navigationTimeout: 30_000,
        testIdAttribute: 'data-testid',
    },
    projects: [
        { name: 'setup', testMatch: /.*\.setup\.ts/ },
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: StorageStatePaths.APP,
            },
            dependencies: ['setup'],
        },
    ],
});
