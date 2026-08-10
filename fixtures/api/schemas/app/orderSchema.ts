import { z } from 'zod';

// strictObject: an unmapped field added by the backend fails the parse loudly.
export const OrderSchema = z.strictObject({
    id: z.string().regex(/^ORD-\d+$/),
    customer: z.string().min(1),
    item: z.string().min(1),
    amount: z.number().positive(),
    status: z.enum(['processing', 'shipped', 'delivered']),
});

export const OrdersResponseSchema = z.strictObject({
    orders: z.array(OrderSchema),
});

export type Order = z.output<typeof OrderSchema>;
export type OrdersResponse = z.output<typeof OrdersResponseSchema>;
