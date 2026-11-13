import { test, expect } from '../../fixtures/baseTest';

test.describe('Checkout page - side menu', () => {
  test.beforeEach(async ({ cartPage, checkoutPage }) => {
    await cartPage.goto();
    await cartPage.checkout();
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
  });

  test('all side menu items are available on checkout page', { tag: '@regression' }, async ({ checkoutPage }) => {
    await checkoutPage.openMenu();

    await expect(checkoutPage.allItemsLink).toBeVisible();
    await expect(checkoutPage.dynamicCatalogLink).toBeVisible();
    await expect(checkoutPage.aboutLink).toBeVisible();
    await expect(checkoutPage.logoutLink).toBeVisible();
    await expect(checkoutPage.resetAppStateLink).toBeVisible();
  });

  test('side menu shows items in the expected order', { tag: '@regression' }, async ({ checkoutPage }) => {
    await checkoutPage.openMenu();

    await expect(checkoutPage.menuItems).toHaveText([
      'All Items',
      'Dynamic Catalog',
      'About',
      'Logout',
      'Reset App State',
    ]);
  });
});
