import { test, expect } from '../../fixtures/baseTest';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { randomCustomer } from '../../utils/dataGenerator';
import products from '../../test-data/products.json';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack.name, products.bikeLight.name);
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('user can place an order end to end', { tag: '@smoke' }, async ({ checkoutPage }) => {
    await checkoutPage.fillCustomer(randomCustomer());

    // Overview: item total must equal the sum of product prices
    const expected = products.backpack.price + products.bikeLight.price;
    expect(CheckoutPage.money(await checkoutPage.subtotal.textContent())).toBeCloseTo(expected, 2);

    // Total = item total + tax
    const tax = CheckoutPage.money(await checkoutPage.tax.textContent());
    expect(CheckoutPage.money(await checkoutPage.total.textContent())).toBeCloseTo(expected + tax, 2);

    await checkoutPage.finish();
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutPage.cartBadge).toBeHidden();
  });

  test('first name is required', { tag: '@regression' }, async ({ checkoutPage }) => {
    await checkoutPage.fillCustomer({ ...randomCustomer(), firstName: '' });
    await expect(checkoutPage.error).toContainText('First Name is required');
  });

  test('postal code is required', { tag: '@regression' }, async ({ checkoutPage }) => {
    await checkoutPage.fillCustomer({ ...randomCustomer(), postalCode: '' });
    await expect(checkoutPage.error).toContainText('Postal Code is required');
  });
});
