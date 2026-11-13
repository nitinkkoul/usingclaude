// spec: docs/test-cases.md › TC-500, TC-503
import { test, expect } from '../../fixtures/baseTest';
import { focusStyle } from '../../utils/a11y';
import data from '../../test-data/a11yPages.json';

test.describe('Accessibility - keyboard focus (TC-500)', () => {
  test.beforeEach(async ({ checkoutPage }) => {
    await checkoutPage.goto();
    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
  });

  test('Tab moves focus through the checkout form in order', { tag: '@regression' }, async ({ page, checkoutPage }) => {
    for (const control of checkoutPage.keyboardOrder) {
      await page.keyboard.press('Tab');
      await expect(control.locator, `${control.name} should receive focus`).toBeFocused();
    }
  });

  test('focused controls show a visible focus indicator', { tag: '@regression' }, async ({ page, checkoutPage }) => {
    // Known app bug: saucedemo removes the focus outline and adds no other focus style,
    // so a keyboard user cannot see where focus is. test.fail() alerts us once it is fixed.
    test.fail();

    for (const control of checkoutPage.keyboardOrder) {
      const unfocused = await focusStyle(control.locator);
      await page.keyboard.press('Tab');
      await expect(control.locator).toBeFocused();
      expect.soft(await focusStyle(control.locator), `${control.name} should look different when focused`).not.toBe(unfocused);
    }
  });
});

test.describe('Accessibility - page structure for screen readers (TC-503)', () => {
  for (const target of data.pages) {
    test(`${target.name} page exposes header, navigation, main and footer landmarks`, { tag: '@regression' }, async ({ page, inventoryPage }) => {
      await page.goto(target.path);

      // Landmarks live in BasePage, so any logged-in page object can read them
      await expect(inventoryPage.bannerLandmark).toBeVisible();
      await expect(inventoryPage.mainLandmark).toBeVisible();
      await expect(inventoryPage.footerLandmark).toBeVisible();

      // The navigation landmark is the side menu: hidden from screen readers while closed, exposed once opened
      await expect(inventoryPage.navigationLandmark).toHaveCount(0);
      await inventoryPage.openMenu();
      await expect(inventoryPage.navigationLandmark).toBeVisible();
    });

    test(`${target.name} page has exactly one main heading`, { tag: '@regression' }, async ({ page, inventoryPage }) => {
      // Known app bug: page titles like "Products" are plain text, not headings.
      test.fail();

      await page.goto(target.path);
      await expect(inventoryPage.mainLandmark).toBeVisible();
      await expect(inventoryPage.mainHeading).toHaveCount(1);
    });
  }
});
