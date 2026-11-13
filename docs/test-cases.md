### TC-001: Login form exposes accessible names and keyboard flow
- **Module**: Login
- **Category**: Happy Path
- **Priority**: P1 high
- **Preconditions**: User is on the Saucedemo login page with no active session.
- **Test Data**: Username = `standard_user`, Password = `secret_sauce`
- **Steps**:
  1. Open the login page.
  2. Use keyboard Tab to move through the form controls.
  3. Focus the username field, type the valid username, and move to the password field.
  4. Type the valid password and activate the Login button with keyboard Enter.
- **Expected Result**: Each control has a clear accessible label, focus order is logical, and the user lands on the `Products` page without using a mouse.
- **Automation**: Candidate @smoke

### TC-002: Successful login shows page title and product list without relying on color alone
- **Module**: Inventory
- **Category**: Happy Path
- **Priority**: P1 high
- **Preconditions**: User is logged out.
- **Test Data**: Username = `standard_user`, Password = `secret_sauce`
- **Steps**:
  1. Log in with valid credentials.
  2. Inspect the heading and the inventory list after navigation.
  3. Confirm that the main heading and product controls are visible and semantically clear.
- **Expected Result**: The page heading reads `Products`, the inventory content is visible, and the layout does not depend on color alone to communicate state.
- **Automation**: Automated: tests/ui/login.spec.ts › valid user lands on the products page

### TC-101: Login error message is programmatically exposed and readable by assistive tech
- **Module**: Login
- **Category**: Business Rule
- **Priority**: P1 high
- **Preconditions**: User is on the login page and has not logged in.
- **Test Data**: Username = `locked_out_user`, Password = `secret_sauce`
- **Steps**:
  1. Enter the locked-out username and valid password.
  2. Submit the form.
  3. Observe the visible error alert and the focus behavior.
- **Expected Result**: Error text `Epic sadface: Sorry, this user has been locked out.` is shown in a clear error state and is announced as an error message to assistive technology.
- **Automation**: Automated: tests/ui/login.spec.ts › locked out user sees an error

### TC-102: Validation error text is clear for empty fields and appears in the right place
- **Module**: Login
- **Category**: Business Rule
- **Priority**: P1 high
- **Preconditions**: User is on the login page.
- **Test Data**: Username = `""`, Password = `secret_sauce` and Username = `standard_user`, Password = `""`
- **Steps**:
  1. Submit the login form with an empty username.
  2. Submit the login form with an empty password.
  3. Review the error text and placement.
- **Expected Result**: Error message `Epic sadface: Username is required` or `Epic sadface: Password is required` is displayed, clearly tied to the affected input field.
- **Automation**: Automated: tests/ui/login.spec.ts › shows error for empty username / empty password

### TC-103: Product controls have predictable names and action states
- **Module**: Inventory
- **Category**: Business Rule
- **Priority**: P1 high
- **Preconditions**: User is logged in and on the `Products` page.
- **Test Data**: Product names from `test-data/products.json`
- **Steps**:
  1. Inspect each product card.
  2. Check the visible name, price, and Add to cart button labels.
  3. Verify each action button has a unique and understandable accessible name.
- **Expected Result**: Each product card exposes a name, price, and control that can be announced correctly by a screen reader, without ambiguous labels.
- **Automation**: Automated: tests/ui/inventory.spec.ts › shows all 6 products

### TC-200: Invalid credentials and empty required fields display consistent, understandable messaging
- **Module**: Login
- **Category**: Negative
- **Priority**: P1 high
- **Preconditions**: User is on the login page.
- **Test Data**: Username = `locked_out_user`, Password = `secret_sauce`; Username = `bad_user`, Password = `bad_pass`
- **Steps**:
  1. Try wrong credentials.
  2. Try an empty username.
  3. Try an empty password.
  4. Compare the error messages.
- **Expected Result**: Every error uses a clear message such as `do not match any user` or `is required`, and the messaging remains usable with assistive tech.
- **Automation**: Automated: tests/ui/login.spec.ts › shows error for wrong credentials / empty username / empty password

### TC-300: Keyboard-only user can complete the purchase flow without mouse interaction
- **Module**: Checkout
- **Category**: Edge Case
- **Priority**: P1 high
- **Preconditions**: User is logged in and has products in the cart.
- **Test Data**: Customer first name = `Jane`, last name = `Doe`, postal code = `12345`
- **Steps**:
  1. Open the cart and proceed to checkout.
  2. Navigate the form using Tab and Shift+Tab only.
  3. Fill in all fields and continue to the overview page.
  4. Finish the checkout.
- **Expected Result**: Focus moves predictably through the form and action buttons, and checkout completes without keyboard traps or hidden interactive elements.
- **Automation**: Automated: tests/ui/checkout.spec.ts › user can place an order end to end

### TC-301: Sorting and cart actions remain usable when focus is managed by keyboard only
- **Module**: Inventory
- **Category**: Edge Case
- **Priority**: P1 high
- **Preconditions**: User is logged in and on the inventory page.
- **Test Data**: Product list from `test-data/products.json`
- **Steps**:
  1. Tab to the product sort dropdown.
  2. Change the sort order with keyboard input.
  3. Move to an Add to cart button and activate it with Enter.
- **Expected Result**: The sort control and action buttons respond correctly, visible focus remains obvious, and the cart badge updates consistently.
- **Automation**: Automated: tests/ui/inventory.spec.ts › sorts by price low to high / adding and removing items updates the cart badge

### TC-500: Visible focus indicator is present on all critical interactive elements
- **Module**: Navigation
- **Category**: UI State
- **Priority**: P1 high
- **Preconditions**: Any page with interactive controls is loaded.
- **Test Data**: —
- **Steps**:
  1. Use keyboard Tab across login, menu, sort, cart, and checkout controls.
  2. Observe whether each focused element shows a visible focus ring or equivalent indicator.
- **Expected Result**: Every interactive control has a strongly visible focus state so keyboard users can identify the active element.
- **Automation**: Manual only

### TC-501: Burger menu and menu links are announced as navigation items with clear labels
- **Module**: Navigation
- **Category**: UI State
- **Priority**: P1 high
- **Preconditions**: User is logged in and on any page with the sidebar menu.
- **Test Data**: Menu items = `All Items`, `Dynamic Catalog`, `About`, `Logout`, `Reset App State`
- **Steps**:
  1. Open the hamburger menu.
  2. Inspect each menu item with a screen reader or accessibility tree tool.
- **Expected Result**: Each menu item exposes a clear accessible name and is available as a navigation element, with the current item state clearly communicated.
- **Automation**: Automated: tests/ui/checkout-menu.spec.ts › all side menu items are available on checkout page / side menu shows items in the expected order

### TC-502: Cart badge and order confirmation changes are perceivable without relying only on color
- **Module**: Cart
- **Category**: UI State
- **Priority**: P1 high
- **Preconditions**: User is logged in and has at least one product in the cart.
- **Test Data**: Product = `Sauce Labs Backpack`
- **Steps**:
  1. Add an item to the cart.
  2. Observe the cart badge and order completion state.
  3. Complete the checkout flow.
- **Expected Result**: The cart count and completion state are visible, understandable, and not dependent on color alone; success states are conveyed clearly.
- **Automation**: Automated: tests/ui/inventory.spec.ts › adding and removing items updates the cart badge / tests/ui/checkout.spec.ts › user can place an order end to end

### TC-503: Page headings and landmarks support screen-reader navigation
- **Module**: Inventory
- **Category**: UI State
- **Priority**: P2 medium
- **Preconditions**: User is on login, inventory, cart, and checkout pages.
- **Test Data**: —
- **Steps**:
  1. Inspect the heading hierarchy and landmark structure on each page.
  2. Use a screen reader landmark navigation mode.
- **Expected Result**: The main heading and primary landmarks are exposed correctly, allowing a screen-reader user to jump directly to the main content and page sections.
- **Automation**: Manual only
