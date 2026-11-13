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

  // TC-010
  test('cart keeps item after sorting and empties after Remove', { tag: '@regression' }, async ({ inventoryPage, cartPage }) => {
    const { bikeLight } = products;

    // 1. Add Sauce Labs Bike Light
    await inventoryPage.addToCart(bikeLight.name);
    await expect(inventoryPage.cartButton(bikeLight.name)).toHaveText('Remove');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // 2. Sort by Price (high to low): products reorder, the cart is unchanged
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
    await expect(inventoryPage.cartButton(bikeLight.name)).toHaveText('Remove');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // 3. Open the cart: only the Bike Light is listed
    await inventoryPage.openCart();
    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.itemNames).toHaveText([bikeLight.name]);

    // 4. Remove it from the cart page: cart is empty and the badge is gone
    await cartPage.removeItem(bikeLight.name);
    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(cartPage.cartBadge).toBeHidden();
  });

  // TC-106
  test('added item stays in cart after Z to A sort', { tag: '@regression' }, async ({ inventoryPage }) => {
    const { backpack, redTShirt } = products;

    // 1. Add Sauce Labs Backpack
    await inventoryPage.addToCart(backpack.name);
    await expect(inventoryPage.cartButton(backpack.name)).toHaveText('Remove');
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // 2. Sort by Name (Z to A)
    await inventoryPage.sortBy('za');

    // 3. Red T-Shirt is first, Backpack is last; the cart is unchanged
    await expect(inventoryPage.itemNames.first()).toHaveText(redTShirt.name);
    await expect(inventoryPage.itemNames.last()).toHaveText(backpack.name);
    await expect(inventoryPage.cartButton(backpack.name)).toHaveText('Remove');
    await expect(inventoryPage.cartBadge).toHaveText('1');
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
