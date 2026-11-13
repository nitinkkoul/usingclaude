/**
 * Runs the Playwright suite, then opens the coverage dashboard in the default browser.
 *
 *   npm run test:dashboard                 # whole suite
 *   npm run test:dashboard -- --grep @smoke   # any playwright test arguments
 *
 * The dashboard opens whether the tests pass or fail; the exit code is the test run's.
 * Override the link with DASHBOARD_URL.
 */
import { spawnSync, spawn } from 'node:child_process';

const DASHBOARD_URL = process.env.DASHBOARD_URL ?? 'https://claude.ai/artifact/5gUax2HFgGzdGPrqprpjaS';

const run = spawnSync('npx', ['playwright', 'test', ...process.argv.slice(2)], { stdio: 'inherit', shell: true });

const opener = process.platform === 'win32' ? ['cmd', ['/c', 'start', '""', DASHBOARD_URL]]
  : process.platform === 'darwin' ? ['open', [DASHBOARD_URL]]
  : ['xdg-open', [DASHBOARD_URL]];
spawn(opener[0], opener[1], { stdio: 'ignore', detached: true }).unref();
console.log(`\nOpened dashboard: ${DASHBOARD_URL}`);

process.exit(run.status ?? 1);
