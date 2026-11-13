/** Small helpers to create unique test data without extra libraries. */

const FIRST_NAMES = ['Aarav', 'Diya', 'Kabir', 'Meera', 'Rohan', 'Sara'];
const LAST_NAMES = ['Sharma', 'Verma', 'Kapoor', 'Iyer', 'Khan', 'Singh'];

const pick = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

export function randomCustomer() {
  return {
    firstName: pick(FIRST_NAMES),
    lastName: pick(LAST_NAMES),
    postalCode: String(100000 + Math.floor(Math.random() * 899999)),
  };
}

export function uniqueTitle(prefix = 'test') {
  return `${prefix}-${Date.now()}`;
}
