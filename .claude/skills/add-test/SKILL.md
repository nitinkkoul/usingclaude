---
name: add-test
description: Add new Playwright tests for a page or feature following this framework's POM + fixtures rules
argument-hint: [feature or page, e.g. "product details page"]
---

# Add tests for: $ARGUMENTS

Follow `CLAUDE.md` exactly. Steps:

1. **Explore** — open the page in a real browser (Playwright MCP or the `playwright-cli` skill). List the elements, their `data-test` / role / label, and what the user can do there.
2. **Scenarios first** — write a short list of test cases covering: happy path, business rules, negative / validation, edge cases. Show the list before coding.
3. **Page object** — create or extend the class in `pages/` (extend `BasePage` if the page has the header). Register a new page object in `fixtures/baseTest.ts`.
4. **Data** — put inputs in `test-data/*.json` or use `utils/dataGenerator.ts`.
5. **Spec** — write `tests/ui/<feature>.spec.ts` (or `tests/api/`), import from `fixtures/baseTest`, tag every test `@smoke` or `@regression`.
6. **Verify** — run `npx playwright test <file>` and `npm run typecheck`. Fix real causes of failures, then report pass/fail counts.
