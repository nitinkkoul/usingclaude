# Known Bugs

Bugs found in https://www.saucedemo.com by the automated suite. Each one has a test marked `test.fail()`: it passes while the bug exists and starts failing once the bug is fixed.

### BUG-001: Product button still says "Remove" after Reset App State
- **Status**: Open
- **Severity**: Minor
- **Priority**: P3 low
- **Module**: Navigation
- **Environment**: https://www.saucedemo.com, Chromium (Playwright Desktop Chrome), found 2026-11-13
- **Linked test case**: TC-504
- **Linked tests**: tests/ui/reset-app-state.spec.ts › product button returns to Add to cart after reset (marked test.fail())
- **Preconditions**: Logged in as `standard_user`, cart empty, on the inventory page.
- **Steps to reproduce**:
  1. Click "Add to cart" on Sauce Labs Backpack. The cart badge shows 1 and the button changes to "Remove".
  2. Open the side menu (☰) and click "Reset App State".
- **Expected result**: The cart badge disappears and the Backpack button changes back to "Add to cart".
- **Actual result**: The cart badge disappears and the cart is emptied, but the Backpack button still says "Remove". It only changes to "Add to cart" after the page is reloaded.
- **Impact**: The page shows the product as still in the cart when it isn't. Clicking "Remove" does nothing useful.
- **Workaround**: Reload the page.
- **Evidence**: `npx playwright test tests/ui/reset-app-state.spec.ts` · Video with narration: [docs/bug-videos/BUG-001.webm](bug-videos/BUG-001.webm) (subtitles: BUG-001.srt)
- **Last verified**: 2026-11-13

### BUG-002: Cart page still lists items after Reset App State
- **Status**: Open
- **Severity**: Minor
- **Priority**: P3 low
- **Module**: Cart
- **Environment**: https://www.saucedemo.com, Chromium (Playwright Desktop Chrome), found 2026-11-13
- **Linked test case**: TC-504
- **Linked tests**: tests/ui/reset-app-state.spec.ts › cart page no longer lists the item after reset (marked test.fail())
- **Preconditions**: Logged in as `standard_user`, cart empty.
- **Steps to reproduce**:
  1. Add Sauce Labs Backpack to the cart and open the cart page. It lists 1 item.
  2. Open the side menu (☰) and click "Reset App State".
- **Expected result**: The cart page shows no items.
- **Actual result**: The cart badge disappears, but the cart page still lists Sauce Labs Backpack. It disappears only after a reload.
- **Impact**: The user sees an item they no longer have and may try to check out with it.
- **Workaround**: Reload the page.
- **Evidence**: `npx playwright test tests/ui/reset-app-state.spec.ts` · Video with narration: [docs/bug-videos/BUG-002.webm](bug-videos/BUG-002.webm) (subtitles: BUG-002.srt)
- **Last verified**: 2026-11-13

### BUG-003: No visible focus indicator for keyboard users
- **Status**: Open
- **Severity**: Major
- **Priority**: P1 high
- **Module**: Accessibility
- **Environment**: https://www.saucedemo.com, Chromium (Playwright Desktop Chrome), found 2026-11-13
- **Linked test case**: TC-500
- **Linked tests**: tests/ui/accessibility.spec.ts › focused controls show a visible focus indicator (marked test.fail())
- **Preconditions**: Logged in as `standard_user`, on "Checkout: Your Information" (/checkout-step-one.html).
- **Steps to reproduce**:
  1. Press Tab repeatedly to move through the menu button, First Name, Last Name, Postal Code, Cancel and Continue.
  2. Watch each control as it receives focus.
- **Expected result**: The focused control is clearly highlighted (for example an outline or ring), as required by WCAG 2.4.7 Focus Visible.
- **Actual result**: Focus moves in the right order, but no control changes its look. Outline style is `none`, and box-shadow, border, background, text colour and underline are identical focused and unfocused. The same was seen on the login, inventory and cart pages.
- **Impact**: Keyboard-only users can't see where they are on the page, so they can't fill in the forms or complete a purchase reliably.
- **Workaround**: None.
- **Evidence**: `npx playwright test tests/ui/accessibility.spec.ts -g "focus indicator"` · Video with narration: [docs/bug-videos/BUG-003.webm](bug-videos/BUG-003.webm) (subtitles: BUG-003.srt)
- **Last verified**: 2026-11-13

### BUG-004: Logged-in pages have no headings
- **Status**: Open
- **Severity**: Major
- **Priority**: P2 medium
- **Module**: Accessibility
- **Environment**: https://www.saucedemo.com, Chromium (Playwright Desktop Chrome), found 2026-11-13
- **Linked test case**: TC-503
- **Linked tests**: tests/ui/accessibility.spec.ts › inventory / cart / checkout information page has exactly one main heading (3 tests, marked test.fail())
- **Preconditions**: Logged in as `standard_user`.
- **Steps to reproduce**:
  1. Open /inventory.html, /cart.html and /checkout-step-one.html.
  2. List the headings with a screen reader's heading navigation, or the browser accessibility tree.
- **Expected result**: Each page has one level-1 heading with its title ("Products", "Your Cart", "Checkout: Your Information").
- **Actual result**: None of the pages has any heading element. The titles are plain text. The header, main and footer landmarks are present, and the navigation landmark appears when the side menu is open.
- **Impact**: Screen-reader users can't jump to the page title or understand the page structure by heading navigation.
- **Workaround**: Navigate by landmarks instead of headings.
- **Evidence**: `npx playwright test tests/ui/accessibility.spec.ts -g "main heading"` · Video with narration: [docs/bug-videos/BUG-004.webm](bug-videos/BUG-004.webm) (subtitles: BUG-004.srt)
- **Last verified**: 2026-11-13
