import { test as setup, expect } from '../fixtures/baseTest';
import { AUTH_FILE } from '../config/env';
import users from '../test-data/users.json';

/** Runs once before the UI tests: log in and save cookies so tests skip the login screen. */
setup('log in as standard user', async ({ loginPage, page }) => {
  await loginPage.goto();
  await loginPage.login(users.standard.username, users.standard.password);
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: AUTH_FILE });
});
