import { faker } from '@faker-js/faker';
import { BankUserSchema, type BankUser } from '../../../fixtures/api/schemas/app/userSchema';

// The factory validates its own output: bad test data dies here, not mid-test.
export const generateBankUser = (overrides?: Partial<BankUser>): BankUser => {
    const defaultUser: BankUser = {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.string.numeric(10),
        password: `Aa1!${faker.internet.password({ length: 10 })}`,
    };
    return BankUserSchema.parse({ ...defaultUser, ...overrides });
};
