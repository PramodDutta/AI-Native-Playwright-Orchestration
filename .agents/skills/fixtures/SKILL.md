---
name: fixtures
description: >
  Extends the fixture system: new page-object fixtures, API fixtures, or
  worker-scoped helpers, merged through the single import point. Use when a
  test needs a capability that does not exist as a fixture yet, or when
  imports in a spec look wrong.
---

# Fixture wiring and the single import point

## Context
`fixtures/pom/test-options.ts` merges every fixture group with `mergeTests` and
re-exports `test`, `expect`, `request`. It is the only file a spec may import
test primitives from.

## Recipe
1. Decide the fixture group: page objects go in `fixtures/pom/`, API concerns
   in `fixtures/api/`. Run `ls fixtures/` first.
2. Extend with `base.extend<Type>()` in that group file, typing the fixture
   explicitly (no `any`, no implicit types).
3. If a new group file was created, add it to the `mergeTests(...)` call in
   `test-options.ts`. Existing groups need no change there.
4. Sweep the diff for `from '@playwright/test'` inside `tests/`: any hit other
   than type-only imports in fixtures themselves is a violation to fix.
5. Run one spec per affected group.

## Error handling
- "Fixture not found" at runtime: the group was not merged in test-options.ts.
- Worker-scoped state (auth tokens, seeded data) belongs in a setup project
  (see tests/app/auth.setup.ts), not in a test-scoped fixture.

## Example
`const test = mergeTests(pageObjectFixture, apiRequestFixture);`
