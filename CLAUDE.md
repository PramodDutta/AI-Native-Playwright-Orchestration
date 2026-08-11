# CLAUDE.md - The Orchestrator

You are working inside an AI-native Playwright framework. This file is the conductor,
not the musician: it never writes test code itself, it routes you to the rules and
skills that do. Read it fully before generating anything.

App under test: The Testing Academy practice apps.
- TTA Bank (UI): https://app.thetestingacademy.com/playwright/tta-bank/
- Orders API (read-only): https://app.thetestingacademy.com/playwright/api/orders.json

## The law lives in RULES.md

Read [RULES.md](RULES.md) before anything else. It is the single normative
source for this repository: the Constitution (five absolute requirements, five
hard guardrails), skill governance, and the verification law. This file is the
Claude-specific adapter; it routes and operates, it never restates or weakens
the rules.

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

- Everything in RULES.md applies verbatim; on any conflict, RULES.md wins.
- Run `npm run verify:governance` after changing CLAUDE.md, RULES.md, or any
  skill, and keep it green.
