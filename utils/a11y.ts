import { Locator } from '@playwright/test';

/**
 * Snapshot of the computed styles that usually show keyboard focus.
 * Compare the value before and after an element receives focus: if nothing
 * changed, the user has no visible focus indicator.
 */
export async function focusStyle(locator: Locator): Promise<string> {
  return locator.evaluate((el) => {
    const c = getComputedStyle(el);
    return [
      `outline:${c.outlineStyle} ${c.outlineWidth} ${c.outlineColor}`,
      `shadow:${c.boxShadow}`,
      `border:${c.borderColor} ${c.borderWidth}`,
      `bg:${c.backgroundColor}`,
      `color:${c.color}`,
      `underline:${c.textDecorationLine}`,
    ].join(' | ');
  });
}
