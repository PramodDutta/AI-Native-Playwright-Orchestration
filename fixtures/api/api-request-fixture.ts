import { test as base, expect, type APIRequestContext } from '@playwright/test';

type ApiFixtures = {
    apiRequest: APIRequestContext;
};

// A thin, named seam for API calls. Tests never build their own request context.
export const test = base.extend<ApiFixtures>({
    apiRequest: async ({ request }, use) => {
        await use(request);
    },
});

export { expect };
