import { test, expect } from '../../fixtures/baseTest';
import users from '../../test-data/users.json';

// Login tests must start logged OUT, so drop the saved session
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid user lands on the products page', { tag: '@smoke' }, async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('keyboard-only user can log in through labelled controls', { tag: '@smoke' }, async ({ page, loginPage, inventoryPage }) => {
    // Each control has a clear accessible name
    await expect(loginPage.username).toHaveAccessibleName('Username');
    await expect(loginPage.password).toHaveAccessibleName('Password');
    await expect(loginPage.loginButton).toHaveAccessibleName('Login');

    // Logical focus order, typing and submitting with the keyboard only
    await page.keyboard.press('Tab');
    await expect(loginPage.username).toBeFocused();
    await page.keyboard.type(users.standard.username);

    await page.keyboard.press('Tab');
    await expect(loginPage.password).toBeFocused();
    await page.keyboard.type(users.standard.password);

    await page.keyboard.press('Tab');
    await expect(loginPage.loginButton).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('locked out user sees an error', { tag: '@regression' }, async ({ loginPage }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await expect(loginPage.error).toContainText('Sorry, this user has been locked out');
  });

  // Data-driven: one test definition, several inputs
  const badInputs = [
    { name: 'wrong credentials', user: users.invalid.username, pass: users.invalid.password, msg: 'do not match any user' },
    { name: 'empty username', user: '', pass: 'secret_sauce', msg: 'Username is required' },
    { name: 'empty password', user: 'standard_user', pass: '', msg: 'Password is required' },
  ];

  for (const input of badInputs) {
    test(`shows error for ${input.name}`, { tag: '@regression' }, async ({ loginPage }) => {
      await loginPage.login(input.user, input.pass);
      await expect(loginPage.error).toContainText(input.msg);
    });
  }
});
