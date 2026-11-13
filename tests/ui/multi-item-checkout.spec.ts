import { test, expect } from '../../fixtures/baseTest';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { randomCustomer } from '../../utils/dataGenerator';
import products from '../../test-data/products.json';
import checkout from '../../test-data/checkout.json';

test.describe('Multi-item checkout', () => {
  test(
    'user adds items across two visits to the cart and completes the order',
    { tag: '@smoke' },
    async ({ inventoryPage, cartPage, checkoutPage }) => {
      const { backpack, onesie, redTShirt } = products;

      await inventoryPage.goto();
      await inventoryPage.addToCart(backpack.name, onesie.name);
      await expect(inventoryPage.cartBadge).toHaveText('2');

      // Visit the cart, then go back to keep shopping
      await inventoryPage.openCart();
      await expect(cartPage.itemNames).toHaveText([backpack.name, onesie.name]);
      await cartPage.continueShoppingButton.click();
      await expect(inventoryPage.title).toHaveText('Products');

      await inventoryPage.addToCart(redTShirt.name);
      await expect(inventoryPage.cartBadge).toHaveText('3');

      // All three items are in the cart
      await inventoryPage.openCart();
      await expect(cartPage.itemNames).toHaveText([backpack.name, onesie.name, redTShirt.name]);

      await cartPage.checkout();
      await checkoutPage.fillCustomer(randomCustomer());

      // Overview: payment and shipping information
      await expect(checkoutPage.paymentInfo).toHaveText(checkout.paymentInfo);
      await expect(checkoutPage.shippingInfo).toHaveText(checkout.shippingInfo);

      // Price total: item total = sum of prices ($53.97), tax = 8% ($4.32), total = item total + tax ($58.29)
      const itemTotal = backpack.price + onesie.price + redTShirt.price;
      const tax = Math.round(itemTotal * checkout.taxRate * 100) / 100;
      expect(CheckoutPage.money(await checkoutPage.subtotal.textContent())).toBeCloseTo(itemTotal, 2);
      expect(CheckoutPage.money(await checkoutPage.tax.textContent())).toBeCloseTo(tax, 2);
      expect(CheckoutPage.money(await checkoutPage.total.textContent())).toBeCloseTo(itemTotal + tax, 2);

      await checkoutPage.finish();
      await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
      await expect(checkoutPage.cartBadge).toBeHidden();
    },
  );
});
