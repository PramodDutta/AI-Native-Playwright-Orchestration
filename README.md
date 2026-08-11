# AI-Native Playwright Orchestration

Teach the AI how YOUR framework works, instead of hoping it guesses right.

This repo is a complete, runnable demonstration of the **Orchestration Pattern**
for AI-assisted test automation:

```
CLAUDE.md  (the Orchestrator: always loaded, routes, never writes code)
   |
   +-- The Constitution   (5 absolute requirements + 5 hard guardrails)
   +-- The Asset Map      ({area} placeholders force `ls`, not path guessing)
   +-- The Skills Index   (5 on-demand domain experts under .agents/skills/)
   +-- The 8-Step Loop    (explore before generate, run before report)
```

An unguided LLM writes generic Playwright: wrong imports, `new LoginPage(page)`,
`.btn-primary` selectors, `waitForTimeout(2000)`, `any` types. The fix is not a
better prompt; it is an architecture the AI must work inside. Open this repo in
Claude Code (or any agent that reads `CLAUDE.md` and `.agents/skills/`) and ask
it to "write a test for the send-money flow": it will explore the live app,
route through the skills, obey the Constitution, and run the suite before
claiming success.

## Credit

The orchestration pattern and the scaffold architecture follow the workshop
**"Orchestrating AI-Native Testing with Playwright"** by
**[Ivan Davidov](https://github.com/idavidov13)**
([workshop repo](https://github.com/idavidov13/Orchestrating-AI-Native-Testing-with-Playwright), MIT).
His repo ships the disciplined scaffold and builds the orchestration layer live
in the workshop; this repo is an independent implementation that includes the
full layer (CLAUDE.md, five skills, skills-lock.json) and targets
The Testing Academy practice applications so every test runs against a public,
stable app.

Study guide for this repo: https://app.thetestingacademy.com/ai/ai-native-playwright-orchestration

## App under test

- **TTA Bank** (UI flows): https://app.thetestingacademy.com/playwright/tta-bank/
  registration, login, dashboard with a fixed starting balance, money transfer
  with a confirm dialog. Built for automation practice: every control carries
  role/label surfaces plus `data-testid`.
- **Orders API** (contract testing): https://app.thetestingacademy.com/playwright/api/orders.json

## Quickstart

```bash
npm install
npx playwright install chromium
npm test
```

`npm test` runs the `setup` project first (registers a fresh bank user through
the real UI and persists `storageState`), then the `chromium` project where
every spec starts pre-authenticated.

| Script | What it runs |
| --- | --- |
| `npm test` | everything |
| `npm run test:e2e` | `@e2e` specs |
| `npm run test:api` | `@api` contract specs |
| `npm run test:functional` | `@functional` specs |
| `npm run test:smoke` | `@smoke` subset |
| `npm run typecheck` | TypeScript, strict |

## What to look at, in order

1. **`RULES.md`**: the single normative source: the Constitution
   (5 requirements, 5 bans), skill governance, and the verification law.
   Agent entry files are thin adapters that reference it, never restate it
   (`npm run verify:governance` enforces this).
2. **`CLAUDE.md`**: the Claude adapter: the asset map, the skills index, and
   the 8-step verification loop.
3. **`.agents/skills/*/SKILL.md`**: five domain experts (selectors,
   page-objects, fixtures, api-testing, test-data), each with a trigger-rich
   description, a numbered recipe, and error handling.
4. **`skills-lock.json`**: skills pinned like dependencies, with content hashes.
5. **`fixtures/pom/test-options.ts`**: the single import point (`mergeTests`).
6. **`fixtures/pom/page-object-fixture.ts`**: dependency injection; specs never
   call `new`.
7. **`fixtures/api/schemas/`**: Zod `strictObject` contracts; the factory in
   `test-data/factories/` validates its own output with `Schema.parse()`.
8. **`tests/app/auth.setup.ts`**: auth once, reuse everywhere via
   `storageState` (adapted for a browser-storage app: registration happens
   through the real UI, then the state is persisted for every project that
   depends on it).

## The Constitution at a glance

Requirements: dependency injection, single import point, strict selector ladder
(`getByRole` > `getByLabel` > `getByPlaceholder` > `getByText` > `getByTestId`
with a comment for every drop), Zod-only typing, explore before generate.

Bans: XPath, `waitForTimeout()`, `z.object()` (use `z.strictObject()`),
guessed DOM exploration, hardcoded test data.

## The fully open-source validation layer (optional, recommended)

Close the loop with zero API keys:

```bash
npm install -g browserbash-cli
ollama pull qwen3
browserbash run "Open https://app.thetestingacademy.com/playwright/tta-bank/ and store the page heading as 'h1'" --headless
```

[BrowserBash](https://browserbash.com) (Apache-2.0) turns plain English into a
real browser run and returns a machine-readable verdict; its built-in MCP
server plugs straight into the orchestrator so step 8 of the loop becomes a
tool call:

```bash
claude mcp add browserbash -- browserbash mcp
```

More ready-made testing skills for the `.agents/skills/` folder live at
[qaskills.sh](https://qaskills.sh):

```bash
npx @qaskills/cli add playwright-e2e
```

Register anything you install in the CLAUDE.md skills index and in
`skills-lock.json`, per RULES.md skill governance.

## License

MIT. See [LICENSE](LICENSE); pattern credit to Ivan Davidov as noted there.
