---
name: selectors
description: >
  Chooses stable Playwright locators using the strict selector ladder
  (getByRole > getByLabel > getByPlaceholder > getByText > getByTestId).
  Use when writing any new locator, fixing a broken or flaky locator, or
  reviewing selector quality in a page object or spec.
---

# Selector discipline

## Context
This framework bans CSS class selectors and XPath entirely. The ladder exists
because role-based locators survive redesigns; class names do not. The app under
test sets `testIdAttribute: 'data-testid'` in playwright.config.ts.

## Recipe
1. Snapshot the real element first. Navigate to the page and read the actual DOM
   (accessibility snapshot preferred). Never write a locator from memory.
2. Try `getByRole(role, { name })`. The accessible name comes from aria-label,
   label text, or visible text, in that priority. An `aria-label` overrides the
   visible text: `aria-label="Sign in"` on a button reading "Sign in securely"
   means the name is `'Sign in'`.
3. If the element has no role surface, try `getByLabel()` (inputs with a
   `<label>` or `aria-label`), then `getByPlaceholder()`, then `getByText()`
   for static copy.
4. `getByTestId()` is the last rung, allowed only for display-only value nodes
   (a balance figure, a status chip) and it requires a one-line comment
   explaining why the higher rungs do not apply.
5. Disambiguate duplicates structurally, never positionally: prefer
   `locator.filter({ hasText })` or scoping through a parent role over `.nth()`.
6. Prove stability: run the affected spec twice. A locator that needs `.first()`
   to pass is a smell; scope it properly instead.

## Error handling
- Strict mode violation (two matches): scope through the nearest labeled
  container, e.g. `page.getByRole('listbox', { name: 'Beneficiaries' })
  .getByRole('option', { name: 'Pay Aarav Sharma' })`.
- Icon-only button: the accessible name lives in `aria-label`; if there is none,
  that is an app accessibility bug worth reporting, not a reason to use CSS.

## Example
Bad: `page.locator('.btn-primary')`
Good: `page.getByRole('button', { name: 'Review transfer' })`
