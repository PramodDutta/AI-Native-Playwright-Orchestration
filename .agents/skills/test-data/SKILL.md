---
name: test-data
description: >
  Creates self-validating Faker factories for test data. Use when a spec needs
  a user, an entity, or any generated data, or when hardcoded strings are found
  in a spec and must be replaced.
---

# Self-validating factories

## Context
Factories live in `test-data/factories/{area}/` and return data that has
already passed its own Zod schema: `return Schema.parse(merged)`. Bad test
data dies in the factory with a clear stack, not three steps into a flow.

## Recipe
1. Find or create the matching schema first (api-testing skill). The factory
   validates against it; the schema is the single source of shape truth.
2. Build defaults with Faker only: names, emails, phone digits, passwords.
   No literal example strings.
3. Accept `overrides?: Partial<T>` and spread them over defaults so specs can
   pin only the field under test.
4. End with `return Schema.parse({ ...defaults, ...overrides });`.
5. Replace any hardcoded data found in specs with a factory call, then run
   those specs.

## Error handling
- Factory throws ZodError: the defaults drifted from the schema; fix the
  factory, never wrap the parse in try/catch.
- Deterministic needs (visual tests): accept the value via overrides from the
  spec rather than seeding Faker globally.

## Example
`const user = generateBankUser({ phone: '9876543210' });`
