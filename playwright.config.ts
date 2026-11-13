import { defineConfig, devices } from '@playwright/test';
import { ENV, AUTH_FILE } from './config/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    // saucedemo puts data-test="..." on its elements, so getByTestId() reads that attribute
    testIdAttribute: 'data-test',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    // 1. Logs in once and saves the session for the UI tests
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: { baseURL: ENV.uiBaseUrl },
    },

    // 2. UI tests: start already logged in (except tests that opt out)
    {
      name: 'chromium',
      testDir: './tests/ui',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: ENV.uiBaseUrl,
        storageState: AUTH_FILE,
      },
    },

    // 3. API tests: no browser needed
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: ENV.apiBaseUrl,
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      },
    },
  ],
});
