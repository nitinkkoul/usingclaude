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
- **Automation**: Automated: tests/ui/login.spec.ts › keyboard-only user can log in through labelled controls

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

### TC-003: Cart page lists exactly the products that were added
- **Module**: Cart
- **Category**: Happy Path
- **Priority**: P1 high
- **Preconditions**: User is logged in; cart is empty.
- **Test Data**: Sauce Labs Backpack, Sauce Labs Bolt T-Shirt (test-data/products.json)
- **Steps**:
  1. Add Sauce Labs Backpack and Sauce Labs Bolt T-Shirt from the inventory page.
  2. Open the cart.
- **Expected Result**: Page title is 'Your Cart' and the cart lists Sauce Labs Backpack and Sauce Labs Bolt T-Shirt, in that order.
- **Automation**: Automated: tests/ui/inventory.spec.ts › cart shows the items that were added

### TC-004: User can log out from the side menu
- **Module**: Navigation
- **Category**: Happy Path
- **Priority**: P1 high
- **Preconditions**: User is logged in and on the inventory page.
- **Test Data**: —
- **Steps**:
  1. Open the side menu.
  2. Click Logout.
- **Expected Result**: The login page is shown with the Login button visible.
- **Automation**: Automated: tests/ui/inventory.spec.ts › user can log out

### TC-005: GET /posts/1 returns a single post
- **Module**: API
- **Category**: Happy Path
- **Priority**: P1 high
- **Preconditions**: API base URL is reachable.
- **Test Data**: Post id = 1
- **Steps**:
  1. Send GET /posts/1.
- **Expected Result**: Status 200; body has id 1, userId 1 and a string title.
- **Automation**: Automated: tests/api/posts.spec.ts › GET a single post

### TC-006: POST /posts creates a post
- **Module**: API
- **Category**: Happy Path
- **Priority**: P1 high
- **Preconditions**: API base URL is reachable.
- **Test Data**: title = unique generated title, body = 'created by playwright', userId = 1
- **Steps**:
  1. Send POST /posts with the payload.
- **Expected Result**: Status 201; body echoes the payload and includes a new id.
- **Automation**: Automated: tests/api/posts.spec.ts › POST creates a post

### TC-007: PUT /posts/1 updates a post
- **Module**: API
- **Category**: Happy Path
- **Priority**: P2 medium
- **Preconditions**: API base URL is reachable.
- **Test Data**: id = 1, title = 'updated title', body = 'updated', userId = 1
- **Steps**:
  1. Send PUT /posts/1 with the payload.
- **Expected Result**: Status 200; body matches the sent payload.
- **Automation**: Automated: tests/api/posts.spec.ts › PUT updates a post

### TC-008: DELETE /posts/1 removes a post
- **Module**: API
- **Category**: Happy Path
- **Priority**: P2 medium
- **Preconditions**: API base URL is reachable.
- **Test Data**: Post id = 1
- **Steps**:
  1. Send DELETE /posts/1.
- **Expected Result**: Status 200.
- **Automation**: Automated: tests/api/posts.spec.ts › DELETE removes a post

### TC-009: Order with three items added across two visits to the cart
- **Module**: Checkout
- **Category**: Happy Path
- **Priority**: P0 critical
- **Preconditions**: Logged in as standard_user; cart is empty; on the Products page.
- **Test Data**: Products: Sauce Labs Backpack ($29.99), Sauce Labs Onesie ($7.99), Test.allTheThings() T-Shirt (Red) ($15.99). Customer: First Name Asha, Last Name Verma, Postal Code 110001
- **Steps**:
  1. Click 'Add to cart' on Sauce Labs Backpack and on Sauce Labs Onesie; the cart badge shows 2.
  2. Click the cart icon; the cart lists Sauce Labs Backpack and Sauce Labs Onesie.
  3. Click 'Continue Shopping'; the Products page opens.
  4. Click 'Add to cart' on Test.allTheThings() T-Shirt (Red); the cart badge shows 3.
  5. Click the cart icon; the cart lists all three items.
  6. Click 'Checkout'.
  7. Enter First Name, Last Name and Postal Code, then click 'Continue'.
  8. On 'Checkout: Overview', check Payment Information, Shipping Information and Price Total.
  9. Click 'Finish'.
- **Expected Result**: Cart lists Sauce Labs Backpack, Sauce Labs Onesie and Test.allTheThings() T-Shirt (Red). Overview shows Payment Information 'SauceCard #31337', Shipping Information 'Free Pony Express Delivery!', Item total: $53.97, Tax: $4.32, Total: $58.29. After Finish, 'Thank you for your order!' is shown and the cart badge is gone.
- **Automation**: Automated: tests/ui/multi-item-checkout.spec.ts › user adds items across two visits to the cart and completes the order

### TC-010: Item added, then sorted by price, can be removed from the cart leaving it empty
- **Module**: Cart
- **Category**: Happy Path
- **Priority**: P2 medium
- **Preconditions**: Logged in as standard_user; cart is empty; on the Products page.
- **Test Data**: Product = Sauce Labs Bike Light ($9.99); sort option = Price (high to low)
- **Steps**:
  1. Click 'Add to cart' on Sauce Labs Bike Light; its button changes to 'Remove' and the cart badge shows 1.
  2. In the 'Sort products' dropdown choose 'Price (high to low)'.
  3. Click the cart icon.
  4. On 'Your Cart', click 'Remove' next to Sauce Labs Bike Light.
  5. Check the cart list and the cart badge.
- **Expected Result**: After step 2 the products are ordered Sauce Labs Fleece Jacket ($49.99), Sauce Labs Backpack ($29.99), Sauce Labs Bolt T-Shirt ($15.99), Test.allTheThings() T-Shirt (Red) ($15.99), Sauce Labs Bike Light ($9.99), Sauce Labs Onesie ($7.99), and the Bike Light still shows 'Remove' with the badge at 1. After step 3 the page title is 'Your Cart' and it lists only Sauce Labs Bike Light ($9.99, QTY 1). After step 4 no items are listed and the cart badge is gone (cart icon reads 'Cart, empty'); 'Continue Shopping' and 'Checkout' are still shown.
- **Automation**: Candidate @regression

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

### TC-104: Sorting by Name (Z to A) orders products in reverse alphabetical order
- **Module**: Inventory
- **Category**: Business Rule
- **Priority**: P2 medium
- **Preconditions**: User is logged in and on the inventory page.
- **Test Data**: Sort option = Name (Z to A)
- **Steps**:
  1. Choose 'Name (Z to A)' in the sort dropdown.
  2. Read the product names top to bottom.
- **Expected Result**: Product names are in reverse alphabetical order.
- **Automation**: Automated: tests/ui/inventory.spec.ts › sorts by name Z to A

### TC-105: GET /posts?userId=2 returns only that user's posts
- **Module**: API
- **Category**: Business Rule
- **Priority**: P2 medium
- **Preconditions**: API base URL is reachable.
- **Test Data**: userId = 2
- **Steps**:
  1. Send GET /posts with query userId=2.
- **Expected Result**: Status is OK; at least one post is returned and every post has userId 2.
- **Automation**: Automated: tests/api/posts.spec.ts › GET posts filtered by user

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

### TC-202: Checkout requires a first name
- **Module**: Checkout
- **Category**: Negative
- **Priority**: P1 high
- **Preconditions**: User is logged in with items in the cart and is on 'Checkout: Your Information'.
- **Test Data**: First name = empty; last name and postal code = generated
- **Steps**:
  1. Leave First Name empty and fill the other fields.
  2. Click Continue.
- **Expected Result**: Error 'First Name is required' is shown and the user stays on the information step.
- **Automation**: Automated: tests/ui/checkout.spec.ts › first name is required

### TC-203: Checkout requires a postal code
- **Module**: Checkout
- **Category**: Negative
- **Priority**: P1 high
- **Preconditions**: User is logged in with items in the cart and is on 'Checkout: Your Information'.
- **Test Data**: Postal code = empty; first and last name = generated
- **Steps**:
  1. Leave Postal Code empty and fill the other fields.
  2. Click Continue.
- **Expected Result**: Error 'Postal Code is required' is shown and the user stays on the information step.
- **Automation**: Automated: tests/ui/checkout.spec.ts › postal code is required

### TC-204: GET for a post that does not exist returns 404
- **Module**: API
- **Category**: Negative
- **Priority**: P2 medium
- **Preconditions**: API base URL is reachable.
- **Test Data**: Post id = 999999
- **Steps**:
  1. Send GET /posts/999999.
- **Expected Result**: Status 404.
- **Automation**: Automated: tests/api/posts.spec.ts › GET unknown post returns 404

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
- **Actual Result (known bug)**: no focused control changes its look (outline, shadow, border, background, colour and underline all unchanged), so keyboard users cannot see where focus is.
- **Automation**: Partly automated: tests/ui/accessibility.spec.ts › Tab moves focus through the checkout form in order (passes) / focused controls show a visible focus indicator (test.fail, known bug). Visual clarity of the indicator stays a manual check.

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
- **Actual Result (known bug)**: logged-in pages have no headings at all; titles like 'Products' are plain text. Landmarks are present; navigation is the side menu and is exposed only while it is open.
- **Automation**: Partly automated: tests/ui/accessibility.spec.ts › <page> page exposes header, navigation, main and footer landmarks (passes) / <page> page has exactly one main heading (test.fail, known bug) for inventory, cart and checkout. Listening with a real screen reader stays a manual check.

### TC-504: Reset App State clears the cart and product states
- **Module**: Navigation
- **Category**: Functional
- **Priority**: P2 medium
- **Preconditions**: User is logged in and has at least one item in the cart.
- **Test Data**: Product = `Sauce Labs Backpack` (test-data/products.json)
- **Steps**:
  1. Add Sauce Labs Backpack to the cart from the inventory page.
  2. Open the side menu and click Reset App State.
  3. Check the cart badge, the product's button, and the cart page.
- **Expected Result**: The cart badge disappears, the cart is empty, and the product's button changes back to "Add to cart" right away.
- **Actual Result (known bug)**: The cart is emptied, but the product's "Remove" button and the cart page list are not updated until the page is reloaded.
- **Automation**: Automated: tests/ui/reset-app-state.spec.ts › reset app state empties the cart (passes) / product button returns to Add to cart after reset and cart page no longer lists the item after reset (marked test.fail for the known bug)
