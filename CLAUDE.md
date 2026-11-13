# Playwright Test Framework — rules for Claude

Playwright + TypeScript hybrid framework (Page Object Model + fixtures + data-driven).
UI app under test: https://www.saucedemo.com · API under test: https://jsonplaceholder.typicode.com

## Commands
- `npm test` — everything (setup → UI → API)
- `npm run test:smoke` / `npm run test:regression` — by tag
- `npm run test:ui` / `npm run test:api` — by project
- `npx playwright test tests/ui/login.spec.ts` — one file
- `npm run typecheck` — must pass before saying work is done
- `npm run report` — open last HTML report

## Structure
- `pages/` — one class per page. Locators are `readonly` fields set in the constructor; actions are `async` methods. Shared header/menu goes in `BasePage`.
- `fixtures/baseTest.ts` — every page object is registered here. UI tests import `test`/`expect` from this file, never from `@playwright/test`.
- `tests/ui/` — UI specs (start logged in via `.auth/` storage state from `tests/auth.setup.ts`).
- `tests/api/` — API specs using the `request` fixture.
- `test-data/` — JSON data. `utils/` — helpers. `config/env.ts` — URLs from env vars.

## Rules when writing tests
1. **Explore before coding**: open the real page with the Playwright MCP / playwright-cli skill and read actual locators. Never guess selectors.
2. **Locator priority**: `getByTestId` (maps to `data-test`) → `getByRole` with name → `getByLabel`/`getByText`. No XPath, no CSS chains like `div > span:nth-child(2)`.
3. **No locators in spec files** — add them to the page object.
4. **No hard waits** (`waitForTimeout`). Use web-first assertions (`await expect(locator).toBeVisible()`), which auto-wait.
5. **No hard-coded data in tests** — put it in `test-data/*.json` or generate with `utils/dataGenerator.ts`.
6. Every test gets a tag: `{ tag: '@smoke' }` for critical paths, `{ tag: '@regression' }` for the rest.
7. Tests must be independent — any test can run alone and in parallel.
8. Tests that need to be logged out use `test.use({ storageState: { cookies: [], origins: [] } })`.
9. Test names describe behaviour: `'locked out user sees an error'`, not `'test1'`.
10. After writing or changing tests: run them and `npm run typecheck`, fix failures, then report results.

## Never
- Commit `.auth/`, `.env` or real credentials.
- Weaken or delete an assertion just to make a failing test pass — find out why it fails first.
