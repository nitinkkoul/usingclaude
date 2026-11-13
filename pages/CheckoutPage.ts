import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type Customer = { firstName: string; lastName: string; postalCode: string };

/** Covers all three checkout steps: your information → overview → complete. */
export class CheckoutPage extends BasePage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly error: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.error = page.getByTestId('error');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
  }

  async goto() {
    await this.page.goto('/checkout-step-one.html');
  }

  /** Interactive controls on "Your Information", in expected keyboard (Tab) order. */
  get keyboardOrder(): { name: string; locator: Locator }[] {
    return [
      { name: 'Open Menu button', locator: this.menuButton },
      { name: 'First Name', locator: this.firstName },
      { name: 'Last Name', locator: this.lastName },
      { name: 'Postal Code', locator: this.postalCode },
      { name: 'Cancel button', locator: this.cancelButton },
      { name: 'Continue button', locator: this.continueButton },
    ];
  }

  async fillCustomer(customer: Customer) {
    await this.firstName.fill(customer.firstName);
    await this.lastName.fill(customer.lastName);
    await this.postalCode.fill(customer.postalCode);
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }

  /** "Item total: $39.98" → 39.98 */
  static money(text: string | null): number {
    return Number((text ?? '').replace(/[^0-9.]/g, ''));
  }
}
