# CLAUDE.md - The Orchestrator

You are working inside an AI-native Playwright framework. This file is the conductor,
not the musician: it never writes test code itself, it routes you to the rules and
skills that do. Read it fully before generating anything.

App under test: The Testing Academy practice apps.
- TTA Bank (UI): https://app.thetestingacademy.com/playwright/tta-bank/
- Orders API (read-only): https://app.thetestingacademy.com/playwright/api/orders.json

## The Constitution

### Absolute requirements

1. **Dependency Injection.** Page objects arrive through fixtures. Tests destructure
   `({ loginPage, dashboardPage })` from the test function. Constructing a page object
   inside a spec (`new LoginPage(page)`) is a defect.
2. **Single import point.** Specs import `test`, `expect`, and `request` from
   `fixtures/pom/test-options.ts` and from nowhere else. Never import from
   `@playwright/test` inside a spec.
3. **Strict selectors, in ladder order.** `getByRole()` first, then `getByLabel()`,
   then `getByPlaceholder()`, then `getByText()`, then `getByTestId()`. Every drop
   below `getByRole` needs a one-line comment saying why. See the `selectors` skill.
4. **Type safety through schemas.** Every external payload passes through a Zod
   `strictObject` schema (`fixtures/api/schemas/`). The word `any` does not appear
   in this codebase. Types derive from schemas via `z.output<typeof Schema>`.
5. **Explore before generate.** Navigate to the real page or call the real endpoint
   and read the actual DOM or JSON before writing a locator or a schema. Guessing a
   selector from memory is a defect even when the guess is right.

### Hard guardrails

1. **No XPath.** Ever. It couples tests to DOM structure.
2. **No hard waits.** `page.waitForTimeout()` is forbidden. Wait for responses,
   states, or use web-first assertions that retry.
3. **No loose schemas.** `z.object()` is banned; use `z.strictObject()` so an
   unmapped field added by the backend fails the suite loudly.
4. **No guessed exploration.** Do not invent DOM shapes from training memory.
   Snapshot the live page (Playwright MCP, playwright-cli, or a headed run)
   before writing locators.
5. **No hardcoded test data.** Inline literal credentials or user data in a spec is
   a defect. Data comes from `test-data/factories/` and validates itself with
   `Schema.parse()` before it is returned.

## The asset map

Never invent a path. The `{area}` placeholder is discovered, not guessed: run `ls`
on the parent folder and use a real area name (currently `app`).

| Asset | Path template |
|---|---|
| Page object | `pages/{area}/[name].page.ts` |
| Zod schema | `fixtures/api/schemas/{area}/[name]Schema.ts` |
| Data factory | `test-data/factories/{area}/[name].factory.ts` |
| Enum / constants | `enums/{area}/[name].ts` |
| E2E spec | `tests/{area}/e2e/[name].spec.ts` |
| Functional spec | `tests/{area}/functional/[name].spec.ts` |
| API spec | `tests/{area}/api/[name].spec.ts` |

## The skills index

Load a skill only when its trigger matches the task. Do not load all of them.

| Skill | Load when the task involves |
|---|---|
| `.agents/skills/selectors/SKILL.md` | writing or fixing any locator |
| `.agents/skills/page-objects/SKILL.md` | creating or editing a page object |
| `.agents/skills/fixtures/SKILL.md` | adding a fixture or wiring DI |
| `.agents/skills/api-testing/SKILL.md` | API specs, schemas, contract checks |
| `.agents/skills/test-data/SKILL.md` | factories, generated data, credentials |

## The 8-step verification loop

1. **Restate** the task in one sentence and name the assets you will touch.
2. **Explore.** Navigate and snapshot the real DOM or call the real endpoint. No guessing.
3. **Map.** Locate target paths with `ls` against the asset map.
4. **Load** the matching skills from the index. Only the matching ones.
5. **Plan** the change as a short list of edits.
6. **Generate** code that obeys the Constitution.
7. **Self-review** against the requirements and guardrails above, line by line.
8. **Run and fix.** Execute the affected tests (`npx playwright test <spec>`).
   Loop back to step 2 on any failure. Report success only with a passing run
   as evidence.

## Non-negotiable behaviors

- Never claim a test passes without running it in this session.
- Never edit `skills-lock.json` by hand; it pins skill content hashes.
- When a Constitution rule and a user request conflict, say so and propose the
  compliant alternative before writing code.
