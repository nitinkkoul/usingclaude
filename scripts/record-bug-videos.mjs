/**
 * Records a narrated screencast for each bug in docs/bugs.md.
 *
 *   npm run bug-videos            # all bugs
 *   npm run bug-videos BUG-003    # one bug
 *
 * Output in docs/bug-videos/:
 *   BUG-xxx.webm            screencast with on-screen captions and spoken narration
 *                           (narration: Windows text-to-speech; merged with ffmpeg if found on
 *                           PATH or in FFMPEG_PATH, otherwise recorded together in Chromium)
 *   BUG-xxx.srt             subtitles (VLC and most players load them automatically)
 *
 * This is a recording script, not a test: it pauses on purpose so each caption can be read and heard.
 * If a bug no longer reproduces, the script stops with an error for that bug.
 */
import { chromium } from '@playwright/test';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const OUT = path.join(ROOT, 'docs', 'bug-videos');
const BASE_URL = process.env.UI_BASE_URL ?? 'https://www.saucedemo.com';
const users = JSON.parse(fs.readFileSync(path.join(ROOT, 'test-data', 'users.json'), 'utf8'));
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'test-data', 'products.json'), 'utf8'));
const VOICE = process.env.BUG_VIDEO_VOICE ?? 'Microsoft Zira Desktop';
const SAMPLE_RATE = 16000; // all narration clips are 16 kHz, 16-bit, mono
const VIEWPORT = { width: 1280, height: 720 };

// ---------- helpers used by the scenarios ----------
const tid = (page, id) => page.locator(`[data-test="${id}"]`);
const menu = (page) => page.getByRole('navigation');

async function login(page) {
  await page.goto(BASE_URL);
  await tid(page, 'username').fill(users.standard.username);
  await tid(page, 'password').fill(users.standard.password);
  await tid(page, 'login-button').click();
  await tid(page, 'inventory-list').waitFor();
}

async function resetAppState(page) {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await menu(page).getByRole('button', { name: 'Reset App State' }).click();
  await page.getByRole('button', { name: 'Close Menu' }).click();
}

function check(condition, message) {
  if (!condition) throw new Error(`Bug did not reproduce: ${message}`);
}

const backpackButton = (page) =>
  tid(page, 'inventory-item').filter({ hasText: products.backpack.name }).getByRole('button', { name: /Add to cart|Remove/ });

// ---------- one scenario per bug; say() shows a caption and speaks it ----------
const BUGS = {
  'BUG-001': {
    title: 'Product button still says "Remove" after Reset App State',
    async run(page, say) {
      await say('Bug 001. After Reset App State, the product button still says Remove.');
      await login(page);
      await say('Step 1. Add the Sauce Labs Backpack to the cart.');
      await backpackButton(page).click();
      await tid(page, 'shopping-cart-badge').waitFor();
      await say('The cart badge shows 1, and the button now says Remove.');
      await say('Step 2. Open the menu and click Reset App State.');
      await resetAppState(page);
      check((await tid(page, 'shopping-cart-badge').count()) === 0, 'cart badge still visible after reset');
      check((await backpackButton(page).textContent()) === 'Remove', 'button already says Add to cart');
      await say('Expected: the button changes back to Add to cart. Actual: the cart badge is gone, but the button still says Remove.');
      await say('Only after reloading the page does the button show Add to cart.');
      await page.reload();
      await backpackButton(page).waitFor();
      check((await backpackButton(page).textContent()) === 'Add to cart', 'button not reset even after reload');
      await say('Workaround: reload the page.');
    },
  },

  'BUG-002': {
    title: 'Cart page still lists items after Reset App State',
    async run(page, say) {
      await say('Bug 002. After Reset App State, the cart page still lists the item.');
      await login(page);
      await say('Step 1. Add the Sauce Labs Backpack and open the cart.');
      await backpackButton(page).click();
      await tid(page, 'shopping-cart-link').click();
      await tid(page, 'inventory-item').first().waitFor();
      await say('The cart lists one item.');
      await say('Step 2. Open the menu and click Reset App State.');
      await resetAppState(page);
      check((await tid(page, 'inventory-item').count()) === 1, 'cart list already empty after reset');
      await say('Expected: the cart is empty. Actual: the badge is gone, but the Backpack is still listed.');
      await page.reload();
      await tid(page, 'cart-list').waitFor();
      check((await tid(page, 'inventory-item').count()) === 0, 'item still listed after reload');
      await say('After a reload, the item disappears. Workaround: reload the page.');
    },
  },

  'BUG-003': {
    title: 'No visible focus indicator for keyboard users',
    async run(page, say) {
      await say('Bug 003. Keyboard users cannot see which control has focus.');
      await login(page);
      await page.goto(`${BASE_URL}/checkout-step-one.html`);
      await tid(page, 'firstName').waitFor();
      await say('We are on the checkout information form. We will press Tab to move through the controls.');
      const controls = [
        ['react-burger-menu-btn', 'the menu button', true],
        ['firstName', 'First Name'],
        ['lastName', 'Last Name'],
        ['postalCode', 'Postal Code'],
        ['cancel', 'Cancel'],
        ['continue', 'Continue'],
      ];
      for (const [id, name, byId] of controls) {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => document.activeElement?.getAttribute('data-test') || document.activeElement?.id);
        check(focused === id, `expected focus on ${id}, got ${focused}`);
        const outline = await (byId ? page.locator(`#${id}`) : tid(page, id)).evaluate((el) => getComputedStyle(el).outlineStyle);
        check(outline === 'none', `${id} now shows an outline`);
        await say(`Focus is now on ${name}. Nothing on screen shows it.`);
      }
      await say('Expected: a visible outline or highlight on the focused control. Actual: the focus outline is removed and nothing replaces it.');
    },
  },

  'BUG-004': {
    title: 'Logged-in pages have no headings',
    async run(page, say) {
      await say('Bug 004. Logged-in pages have no headings for screen-reader users.');
      await login(page);
      const pages = [
        ['/inventory.html', 'Products', 'inventory-list'],
        ['/cart.html', 'Your Cart', 'cart-list'],
        ['/checkout-step-one.html', 'Checkout: Your Information', 'firstName'],
      ];
      for (const [p, title, ready] of pages) {
        await page.goto(`${BASE_URL}${p}`);
        await tid(page, ready).waitFor();
        const count = await page.getByRole('heading').count();
        check(count === 0, `${p} now has ${count} heading(s)`);
        await say(`The title "${title}" looks like a heading, but it is plain text. Headings on this page: none.`);
      }
      await say('Expected: each page has one main heading with its title. Actual: no headings at all, so screen-reader users cannot jump to the title.');
    },
  },
};

// ---------- text-to-speech (Windows System.Speech), all clips in one PowerShell call ----------
function synthesize(lines, dir) {
  const jobs = lines.map((text, i) => ({ text, file: path.join(dir, `clip-${i}.wav`) }));
  const jobFile = path.join(dir, 'jobs.json');
  fs.writeFileSync(jobFile, JSON.stringify(jobs), 'utf8');
  const ps = `
    Add-Type -AssemblyName System.Speech
    $jobs = Get-Content -Raw -Encoding UTF8 '${jobFile}' | ConvertFrom-Json
    $fmt = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(${SAMPLE_RATE}, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
    foreach ($j in $jobs) {
      $s = New-Object System.Speech.Synthesis.SpeechSynthesizer
      try { $s.SelectVoice('${VOICE}') } catch {}
      $s.SetOutputToWaveFile($j.file, $fmt)
      $s.Speak($j.text)
      $s.Dispose()
    }`;
  execFileSync('powershell', ['-NoProfile', '-NonInteractive', '-Command', ps], { stdio: 'inherit' });
  return jobs.map((j) => readPcm(j.file));
}

function readPcm(file) {
  const buf = fs.readFileSync(file);
  let off = 12;
  while (off < buf.length) {
    const id = buf.toString('ascii', off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    if (id === 'data') return buf.subarray(off + 8, off + 8 + size);
    off += 8 + size + (size % 2);
  }
  throw new Error(`No audio data in ${file}`);
}

function writeWav(file, pcm) {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8);
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SAMPLE_RATE, 24); h.writeUInt32LE(SAMPLE_RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
  h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, pcm]));
}

const srtTime = (ms) => {
  const t = Math.max(0, Math.round(ms));
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(t / 3600000))}:${p(Math.floor(t / 60000) % 60)}:${p(Math.floor(t / 1000) % 60)},${p(t % 1000, 3)}`;
};

function findFfmpeg() {
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) return process.env.FFMPEG_PATH;
  const r = spawnSync(process.platform === 'win32' ? 'where' : 'which', ['ffmpeg'], { encoding: 'utf8' });
  return r.status === 0 ? r.stdout.split(/\r?\n/)[0].trim() : null;
}

// ---------- record one bug ----------
async function record(browser, id, bug) {
  // Dry pass collects the caption lines so all narration can be generated up front.
  const lines = [];
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `${id}-`));
  {
    const ctx = await browser.newContext({ viewport: VIEWPORT });
    const page = await ctx.newPage();
    await bug.run(page, async (text) => { lines.push(text); });
    await ctx.close();
  }
  const clips = synthesize(lines, tmp);

  // Real pass: record video, show each caption for as long as its narration lasts.
  const ctx = await browser.newContext({ viewport: VIEWPORT, recordVideo: { dir: tmp, size: VIEWPORT } });
  const page = await ctx.newPage();
  const t0 = Date.now();
  const cues = [];
  let i = 0;
  await bug.run(page, async (text) => {
    const clip = clips[i++];
    const ms = (clip.length / 2 / SAMPLE_RATE) * 1000;
    await page.evaluate(([bugId, caption]) => {
      let box = document.getElementById('__bug_caption');
      if (!box) {
        box = document.createElement('div');
        box.id = '__bug_caption';
        box.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);max-width:88%;z-index:2147483647;' +
          'background:rgba(15,15,20,.88);color:#fff;font:600 22px/1.35 Segoe UI,Arial,sans-serif;padding:14px 22px;border-radius:10px;' +
          'box-shadow:0 6px 24px rgba(0,0,0,.35);pointer-events:none;text-align:center';
        const tag = document.createElement('div');
        tag.id = '__bug_tag';
        tag.style.cssText = 'position:fixed;top:12px;right:12px;z-index:2147483647;background:#c62828;color:#fff;' +
          'font:700 15px Segoe UI,Arial,sans-serif;padding:6px 12px;border-radius:6px;pointer-events:none';
        document.body.append(box, tag);
      }
      document.getElementById('__bug_tag').textContent = bugId;
      box.textContent = caption;
    }, [id, text]);
    cues.push({ start: Date.now() - t0, ms, text, pcm: clip });
    await page.waitForTimeout(ms + 500);
  });
  await page.waitForTimeout(800);
  const totalMs = Date.now() - t0;
  const video = page.video();
  await ctx.close();

  fs.mkdirSync(OUT, { recursive: true });
  const webm = path.join(OUT, `${id}.webm`);
  await video.saveAs(webm);

  // Narration track: each clip placed at the moment its caption appeared.
  const track = Buffer.alloc(Math.ceil((totalMs / 1000) * SAMPLE_RATE) * 2);
  for (const c of cues) {
    const at = Math.floor((c.start / 1000) * SAMPLE_RATE) * 2;
    c.pcm.copy(track, at, 0, Math.min(c.pcm.length, track.length - at));
  }
  const wav = path.join(OUT, `${id}-narration.wav`);
  writeWav(wav, track);

  const srt = cues.map((c, n) => `${n + 1}\n${srtTime(c.start)} --> ${srtTime(c.start + c.ms + 500)}\n${c.text}\n`).join('\n');
  fs.writeFileSync(path.join(OUT, `${id}.srt`), srt, 'utf8');

  const ffmpeg = findFfmpeg();
  let how;
  if (ffmpeg) {
    const merged = path.join(tmp, 'merged.webm');
    const r = spawnSync(ffmpeg, ['-y', '-loglevel', 'error', '-i', webm, '-i', wav,
      '-c:v', 'copy', '-c:a', 'libopus', '-shortest', merged], { stdio: 'inherit' });
    if (r.status !== 0) throw new Error('ffmpeg merge failed');
    fs.copyFileSync(merged, webm);
    how = 'merged with ffmpeg';
  } else {
    await mergeInBrowser(browser, webm, wav, tmp);
    how = 'merged in the browser';
  }
  fs.rmSync(wav, { force: true });
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`${id}: ${path.relative(ROOT, webm)} with narration (${(totalMs / 1000).toFixed(0)}s, ${how})`);
}

/**
 * No ffmpeg: play the silent video and the narration together in Chromium and record
 * both into one WebM (VP8 + Opus) with MediaRecorder. Takes as long as the video.
 */
async function mergeInBrowser(browser, webm, wav, tmp) {
  // Serve both files from one made-up http origin so captureStream() allows capturing them.
  const files = {
    '/merge.html': ['text/html', Buffer.from('<video id="v" src="v.webm" muted playsinline></video><audio id="a" src="a.wav"></audio>')],
    '/v.webm': ['video/webm', fs.readFileSync(webm)],
    '/a.wav': ['audio/wav', fs.readFileSync(wav)],
  };
  const ctx = await browser.newContext();
  await ctx.route('http://bug-video.local/**', (route) => {
    const f = files[new URL(route.request().url()).pathname];
    return f ? route.fulfill({ status: 200, contentType: f[0], body: f[1] }) : route.fulfill({ status: 404 });
  });
  const page = await ctx.newPage();
  await page.goto('http://bug-video.local/merge.html');
  const b64 = await page.evaluate(async () => {
    const v = document.getElementById('v');
    const a = document.getElementById('a');
    const ready = (el) => new Promise((ok, bad) => {
      if (el.readyState >= 3) return ok();
      el.oncanplaythrough = () => ok();
      el.onerror = () => bad(new Error(`cannot load ${el.src}`));
    });
    await Promise.all([ready(v), ready(a)]);
    const stream = new MediaStream([...v.captureStream().getVideoTracks(), ...a.captureStream().getAudioTracks()]);
    const rec = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus', videoBitsPerSecond: 2_500_000 });
    const chunks = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const done = new Promise((ok) => (rec.onstop = ok));
    rec.start(1000);
    await Promise.all([v.play(), a.play()]);
    await new Promise((ok) => (v.onended = ok));
    rec.stop();
    await done;
    const buf = new Uint8Array(await new Blob(chunks, { type: 'video/webm' }).arrayBuffer());
    let s = '';
    for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return btoa(s);
  });
  await ctx.close();
  fs.writeFileSync(webm, Buffer.from(b64, 'base64'));
}

// ---------- main ----------
const wanted = process.argv.slice(2).map((a) => a.toUpperCase());
const ids = Object.keys(BUGS).filter((id) => !wanted.length || wanted.includes(id));
const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
let failed = 0;
for (const id of ids) {
  try { await record(browser, id, BUGS[id]); }
  catch (e) { failed++; console.error(`${id}: ${e.message}`); }
}
await browser.close();
process.exit(failed ? 1 : 0);
