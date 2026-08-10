import { z } from 'zod';

export const BankUserSchema = z.strictObject({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().regex(/^\d{10}$/),
    password: z.string().min(8),
});

export type BankUser = z.output<typeof BankUserSchema>;
