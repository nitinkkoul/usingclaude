// spec: docs/test-cases.md › TC-504
import { test, expect } from '../../fixtures/baseTest';
import products from '../../test-data/products.json';

test.describe('Reset App State', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack.name);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('reset app state empties the cart', { tag: '@regression' }, async ({ inventoryPage, cartPage }) => {
    await inventoryPage.resetAppState();

    await expect(inventoryPage.cartBadge).toBeHidden();
    await cartPage.goto();
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('product button returns to Add to cart after reset', { tag: '@regression' }, async ({ inventoryPage }) => {
    // Known app bug: the button keeps saying "Remove" until the page is reloaded.
    // test.fail() makes this pass while the bug exists and alerts us once it is fixed.
    test.fail();

    await inventoryPage.resetAppState();

    await expect(inventoryPage.cartButton(products.backpack.name)).toHaveText('Add to cart');
  });

  test('cart page no longer lists the item after reset', { tag: '@regression' }, async ({ inventoryPage, cartPage }) => {
    // Known app bug: the cart list is not refreshed until the page is reloaded.
    test.fail();

    await inventoryPage.openCart();
    await expect(cartPage.cartItems).toHaveCount(1);
    await cartPage.resetAppState();

    await expect(cartPage.cartItems).toHaveCount(0);
  });
});
