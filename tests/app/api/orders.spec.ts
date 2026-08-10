import { test, expect } from '../../../fixtures/pom/test-options';
import { ApiEndpoints } from '../../../enums/app/app';
import { OrdersResponseSchema } from '../../../fixtures/api/schemas/app/orderSchema';

// API specs need no browser session.
test.use({ storageState: { cookies: [], origins: [] } });

test('orders feed matches the strict contract', { tag: ['@api', '@smoke'] }, async ({ apiRequest }) => {
    const response = await apiRequest.get(ApiEndpoints.ORDERS);
    expect(response.status()).toBe(200);

    // strictObject: one unmapped field from the backend and this line fails loudly.
    const data = OrdersResponseSchema.parse(await response.json());

    expect(data.orders.length).toBeGreaterThan(0);
    for (const order of data.orders) {
        expect(order.amount).toBeGreaterThan(0);
    }
});

test('every order id is unique', { tag: '@api' }, async ({ apiRequest }) => {
    const response = await apiRequest.get(ApiEndpoints.ORDERS);
    const data = OrdersResponseSchema.parse(await response.json());
    const ids = data.orders.map((order) => order.id);
    expect(new Set(ids).size).toBe(ids.length);
});
