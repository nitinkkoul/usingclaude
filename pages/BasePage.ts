import { Locator, Page } from '@playwright/test';

/** Things every logged-in page shares: header, cart icon, side menu. */
export abstract class BasePage {
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly menuItems: Locator;
  readonly allItemsLink: Locator;
  readonly dynamicCatalogLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(protected readonly page: Page) {
    this.title = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    // Side menu (same menu on every logged-in page).
    // Note: saucedemo exposes these as role=button, except "About" which is a real link.
    const menu = page.getByRole('navigation');
    this.menuItems = menu.locator('a');
    this.allItemsLink = menu.getByRole('button', { name: 'All Items' });
    this.dynamicCatalogLink = menu.getByRole('button', { name: 'Dynamic Catalog' });
    this.aboutLink = menu.getByRole('link', { name: 'About' });
    this.logoutLink = menu.getByRole('button', { name: 'Logout' });
    this.resetAppStateLink = menu.getByRole('button', { name: 'Reset App State' });
  }

  async openMenu() {
    await this.menuButton.click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
