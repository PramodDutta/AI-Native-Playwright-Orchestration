# RULES.md - The Constitution (single normative source)

This file is the law of this repository, for every agent and every human.
Agent entry files (CLAUDE.md, and any Cursor/Copilot equivalents) are thin
adapters: they may add operational guidance, they may never weaken, duplicate,
or override anything written here.

**Precedence:** RULES.md > agent entry files > convenience. When a user request
conflicts with a rule, the agent says so and proposes the compliant alternative
before writing code.

## Absolute requirements

1. **Dependency Injection.** Page objects arrive through fixtures. Tests
   destructure `({ loginPage, dashboardPage })` from the test function.
   Constructing a page object inside a spec (`new LoginPage(page)`) is a defect.
2. **Single import point.** Specs import `test`, `expect`, and `request` from
   `fixtures/pom/test-options.ts` and from nowhere else. Never import from
   `@playwright/test` inside a spec.
3. **Strict selectors, in ladder order.** `getByRole()` first, then
   `getByLabel()`, then `getByPlaceholder()`, then `getByText()`, then
   `getByTestId()`. Every drop below `getByRole` needs a one-line comment
   saying why.
4. **Type safety through schemas.** Every external payload passes through a Zod
   `strictObject` schema (`fixtures/api/schemas/`). The word `any` does not
   appear in this codebase. Types derive from schemas via
   `z.output<typeof Schema>`.
5. **Explore before generate.** Navigate to the real page or call the real
   endpoint and read the actual DOM or JSON before writing a locator or a
   schema. Guessing a selector from memory is a defect even when the guess is
   right.

## Hard guardrails

1. **No XPath.** Ever. It couples tests to DOM structure.
2. **No hard waits.** `page.waitForTimeout()` is forbidden. Wait for responses,
   states, or use web-first assertions that retry.
3. **No loose schemas.** `z.object()` is banned; use `z.strictObject()` so an
   unmapped field added by the backend fails the suite loudly.
4. **No guessed exploration.** Do not invent DOM shapes from training memory.
   Snapshot the live page (Playwright MCP, BrowserBash, or a headed run)
   before writing locators.
5. **No hardcoded test data.** Inline literal credentials or user data in a
   spec is a defect. Data comes from `test-data/factories/` and validates
   itself with `Schema.parse()` before it is returned.

## Skill governance

1. **Route, do not bulk-load.** Load a skill only when the skills index in the
   agent entry file matches the task. Never load all skills at once; that is
   how context rot starts.
2. **Skills are pinned dependencies.** `skills-lock.json` records a sha256
   content hash per skill. Never edit the lockfile by hand. When a SKILL.md
   changes, regenerate its hash in the same commit.
3. **A skill that did not fire did not run.** If the task matched a skill's
   trigger and the skill was not read, the generation is non-compliant;
   redo it with the skill loaded.
4. **New skills follow the anatomy.** Kebab-case name, a description that
   states capability AND exact firing conditions, a numbered recipe, one
   worked example, one error-handling clause. Register every new skill in the
   agent entry file's index and in the lockfile in the same commit.

## Verification law

1. **Run before report.** No agent or human claims a test passes without a
   run in the current session as evidence.
2. **Failures loop, not mask.** A failing check is fixed at the cause;
   loosening a schema, widening a timeout, or deleting an assertion to go
   green is a violation of this file.
