---
name: page-objects
description: >
  Creates and edits page object classes that plug into the DI fixture system.
  Use when adding a page object, adding locators or actions to one, or when a
  spec needs an interaction that belongs in a page object instead of the test.
---

# Page objects that respect DI

## Context
Page objects live in `pages/{area}/[name].page.ts`, expose locators as getters
and behaviors as async methods, and are instantiated exactly once: inside
`fixtures/pom/page-object-fixture.ts`. Specs receive them by destructuring.

## Recipe
1. Run `ls pages/` to find the real `{area}` folder. Do not invent one.
2. Snapshot the target page and list the elements the flow needs (selectors
   skill applies for every locator).
3. Write the class: `constructor(private readonly page: Page) {}`, locator
   getters first, then a `goto()` using a `Routes` enum value, then behavior
   methods that end in a web-first assertion or a waited navigation, never a
   hard wait.
4. Register it in `fixtures/pom/page-object-fixture.ts`: add to the
   `FrameworkFixtures` type and add the `await use(new X(page))` block.
5. Confirm the spec can now destructure it from the test function, with zero
   `new` calls in the spec.
6. Run one spec that touches the new object to prove the wiring.

## Error handling
- Circular import: page objects import types from schemas or enums, never from
  fixtures. If a page object needs a fixture, the design is wrong; invert it.
- A method that only wraps one locator call adds noise: expose the locator
  getter instead and assert in the spec.

## Example
Spec usage after wiring:
`test('...', async ({ sendPage }) => { await sendPage.sendMoney('Aarav Sharma', 500, 'Food', 'Dinner'); })`
