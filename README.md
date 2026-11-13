# Playwright + TypeScript Test Framework

Hybrid framework: **Page Object Model + custom fixtures + data-driven tests + UI & API testing + tags + CI**.
Demo targets: [saucedemo.com](https://www.saucedemo.com) (UI) and [jsonplaceholder](https://jsonplaceholder.typicode.com) (API).

## Setup
```bash
npm install
npx playwright install chromium
```

## Run
| Command | What it runs |
|---|---|
| `npm test` | All tests |
| `npm run test:smoke` | Only `@smoke` tests |
| `npm run test:regression` | Only `@regression` tests |
| `npm run test:ui` / `npm run test:api` | UI only / API only |
| `npm run test:headed` | UI tests with the browser visible |
| `npm run test:debug` | Playwright UI mode (step through tests) |
| `npm run report` | Open the HTML report |

Point at another environment: `$env:UI_BASE_URL="https://staging.example.com"; npm test`

## Structure
```
config/env.ts          URLs from environment variables
pages/                 Page Objects (BasePage, Login, Inventory, Cart, Checkout)
fixtures/baseTest.ts   Injects page objects into tests
test-data/             JSON test data
utils/                 Data generators / helpers
tests/auth.setup.ts    Logs in once, saves session to .auth/
tests/ui/              UI specs (start logged in)
tests/api/             API specs (request fixture, no browser)
CLAUDE.md              Rules Claude follows when writing tests here
.claude/skills/        /add-test and playwright-cli skills
```

## How it works
1. The `setup` project logs in once and saves cookies to `.auth/standard_user.json`.
2. The `chromium` project reuses that session, so UI tests skip the login screen. Login tests opt out with an empty `storageState`.
3. The `api` project calls the REST API directly with Playwright's `request` fixture.
4. On failure, Playwright keeps a screenshot, video and trace (`npx playwright show-trace <file>`).

## Adding tests with Claude
In Claude Code, inside this folder:
```
/add-test product details page
```
Claude opens the page, lists scenarios, writes the page object + spec, runs them and fixes failures, following `CLAUDE.md`.
