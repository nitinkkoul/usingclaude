/**
 * All environment-specific values live here.
 * Override any of them from the shell, e.g.  $env:UI_BASE_URL="https://staging.myapp.com"
 */
export const ENV = {
  uiBaseUrl: process.env.UI_BASE_URL ?? 'https://www.saucedemo.com',
  apiBaseUrl: process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
};

/** Where the logged-in session is saved by tests/auth.setup.ts (git-ignored). */
export const AUTH_FILE = '.auth/standard_user.json';
