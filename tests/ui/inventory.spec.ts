import { test, expect } from '../../fixtures/baseTest';
import products from '../../test-data/products.json';

test.describe('Products & cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('shows all 6 products', { tag: '@smoke' }, async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('sorts by price low to high', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts by name Z to A', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');

    const names = await inventoryPage.itemNames.allTextContents();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('adding and removing items updates the cart badge', { tag: '@smoke' }, async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack.name, products.bikeLight.name);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    await inventoryPage.removeFromCart(products.backpack.name);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('cart shows the items that were added', { tag: '@regression' }, async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack.name, products.boltTShirt.name);
    await inventoryPage.openCart();

    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.itemNames).toHaveText([products.backpack.name, products.boltTShirt.name]);
  });

  test('user can log out', { tag: '@regression' }, async ({ inventoryPage, loginPage }) => {
    await inventoryPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
