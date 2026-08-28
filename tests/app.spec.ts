import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const execFileAsync = promisify(execFile);

test('@claim:demo-isolated Demo sample rounds stay separate from a real game', async ({ page }) => {
  await page.goto('/game');
  await expect(page.getByText('0 rounds marked')).toBeVisible();
  await expect(page.getByText('Completed rounds will appear here.')).toBeVisible();
  await expect(page.locator('.round-log li')).toHaveCount(0);

  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved to your game.')).toBeVisible();
  await page.getByRole('button', { name: 'We did 4 claps' }).click();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toContain('demo:number-motion-duet:session');
  expect(keys).not.toContain('number-motion-duet:session');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/game$/);
  await expect(page.getByText('0 rounds marked')).toBeVisible();
  await expect(page.getByText('Completed rounds will appear here.')).toBeVisible();
  await expect(page.locator('.round-log li')).toHaveCount(0);
  const result = await page.evaluate(() => ({ demo: localStorage.getItem('demo:number-motion-duet:session'), real: localStorage.getItem('number-motion-duet:session') }));
  expect(result.demo).toBeNull();
  expect(result.real).toBeNull();
  await page.getByRole('button', { name: 'We did 1 clap' }).click();
  await expect(page.getByText('1 round marked')).toBeVisible();
  await expect(page.locator('.round-log li')).toHaveText(['1 clap']);
  const realRounds = await page.evaluate(() => JSON.parse(localStorage.getItem('number-motion-duet:session') ?? '{}').rounds);
  expect(realRounds).toEqual([{ count: 1, motion: 'claps' }]);
});

test('@claim:keyboard Use touch or keyboard', async ({ page }) => {
  await page.goto('/demo');
  const five = page.getByRole('button', { name: '5', exact: true });
  await five.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'We did 5 claps' })).toBeVisible();
  await expect(five).toBeFocused();
  const done = page.getByRole('button', { name: 'We did 5 claps' });
  await done.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('img', { name: '5 shape marks' })).toBeVisible();
});

test('@claim:local-game Play without an account, keep round history in this browser, and send it nowhere', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/game');
  await page.getByRole('button', { name: '4', exact: true }).click();
  await page.getByRole('button', { name: 'We did 4 claps' }).click();
  await expect(page.getByText('1 round marked')).toBeVisible();
  await expect(page.locator('.round-log li')).toHaveText(['4 claps']);
  await page.reload();
  await expect(page.getByText('1 round marked')).toBeVisible();
  await expect(page.locator('.round-log li')).toHaveText(['4 claps']);
  const savedRounds = await page.evaluate(() => JSON.parse(localStorage.getItem('number-motion-duet:session') ?? '{}').rounds);
  expect(savedRounds).toEqual([{ count: 4, motion: 'claps' }]);
  await expect(page.locator('input[type="email"], input[type="password"], form')).toHaveCount(0);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
});

test('@claim:seeded-demo The first-screen sample action opens a ready-made four-clap round', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved to your game.')).toBeVisible();
  await expect(page.getByText('2 rounds marked')).toBeVisible();
  await expect(page.getByRole('button', { name: 'We did 4 claps' })).toBeVisible();
  await expect(page.locator('.round-log li')).toHaveText(['3 steps', '2 claps']);
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Number Motion Duet');
  await expect(page.getByText('Demo — sample data, nothing is saved to your game.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'We did 4 claps' })).toBeVisible();
});

test('uses direct wording for the landing job and turn-taking instructions', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Practice numbers with claps and steps' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: 'Turn a number into claps or steps' })).toBeVisible();
});

test('shows the complete first-screen action and facts on a 390px phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Practice numbers with claps and steps' })).toBeInViewport();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeInViewport();
  for (const fact of ['Play without an account.', 'Use touch or keyboard.', 'Free to play.']) {
    await expect(page.getByText(fact, { exact: true })).toBeInViewport();
  }
});

test('@claim:shape-amount One shape mark appears for each completed motion', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: '7', exact: true }).click();
  await page.getByRole('button', { name: 'We did 7 claps' }).click();
  const marks = page.getByRole('img', { name: '7 shape marks' });
  await expect(marks).toBeVisible();
  await expect(marks.locator('.shape')).toHaveCount(7);
  await expect(marks.locator('.shape')).toHaveText(['1', '2', '3', '4', '5', '6', '7']);
});

test('@claim:offline-demo Demo works offline after its first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Call a number. Move together.' })).toBeVisible();
  const cached = await page.evaluate(async () => {
    const names = await caches.keys();
    const entries = await Promise.all(names.map(async (name) => { const cache = await caches.open(name); const keys = await cache.keys(); return { name, urls: keys.map((key) => new URL(key.url).pathname) }; }));
    return entries;
  });
  expect(cached.flatMap((cache) => cache.urls)).toContainEqual(expect.stringMatching(/^\/assets\/index-[a-zA-Z0-9_-]+\.js$/));
  await context.setOffline(true);
  await page.goto('/demo');
  await page.waitForTimeout(500);
  expect(await page.locator('#app').innerHTML()).toContain('Call a number');
  await expect(page.getByRole('heading', { name: 'Call a number. Move together.' })).toBeVisible();
  await expect(page.getByText('Offline. This game still works here.')).toBeVisible();
});

test('has no serious or critical accessibility violations on every route', async ({ page }) => {
  for (const path of ['/', '/demo', '/game', '/privacy', '/terms', '/404.html']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
    expect(serious, path).toEqual([]);
  }
});

test('routes, title, and reset control work', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'We did 4 claps' }).click();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('Today’s marks')).toBeVisible();
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page).toHaveTitle('Privacy — Number Motion Duet');
  await expect(page.getByRole('heading', { name: 'Your game stays on this device' })).toBeVisible();
});

test('forward footer navigation brings the destination heading into view', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const footerPrivacy = page.locator('footer').getByRole('link', { name: 'Privacy' });
  await footerPrivacy.scrollIntoViewIfNeeded();
  const homeScroll = await page.evaluate(() => window.scrollY);
  expect(homeScroll).toBeGreaterThan(0);
  await footerPrivacy.click();
  const heading = page.getByRole('heading', { level: 1, name: 'Your game stays on this device' });
  await expect(heading).toBeFocused();
  const destination = await page.evaluate(() => {
    const box = document.querySelector('h1')!.getBoundingClientRect();
    return { scrollY: window.scrollY, top: box.top, bottom: box.bottom, viewport: window.innerHeight };
  });
  expect(destination.scrollY).toBeLessThanOrEqual(1);
  expect(destination.top).toBeGreaterThanOrEqual(0);
  expect(destination.bottom).toBeLessThanOrEqual(destination.viewport);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await page.waitForFunction((expectedScroll) => Math.abs(window.scrollY - expectedScroll) <= 1, homeScroll);
});

test('fits a 390px phone at default and 200% text size without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.getByRole('button', { name: 'We did 4 claps' })).toBeVisible();
  const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  expect(dimensions.width).toBeLessThanOrEqual(dimensions.viewport);
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const zoomedDimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  expect(zoomedDimensions.width).toBeLessThanOrEqual(zoomedDimensions.viewport);
  expect(errors).toEqual([]);
});

test('recovers safely from damaged saved state and uses singular motion words', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('number-motion-duet:session', JSON.stringify({ motion: 'x', count: 0, rounds: [], confirmed: false })));
  await page.goto('/game');
  await expect(page.getByText('Saved rounds could not be read, so a new game started.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'We did 1 clap' })).toBeVisible();
  await expect(page.getByText('0 rounds marked')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('number-motion-duet:session'))).toBeNull();
});

test('mobile navigation and footer links meet the 44px touch-target baseline', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  const targets = page.locator('.wordmark, .nav a, .site-footer a, .text-button');
  const boxes = await targets.evaluateAll((links) => links.map((link) => {
    const box = link.getBoundingClientRect();
    return { label: link.textContent?.trim(), width: box.width, height: box.height };
  }));
  expect(boxes.length).toBeGreaterThan(0);
  for (const target of boxes) {
    expect(target.width, `${target.label} touch target width`).toBeGreaterThanOrEqual(44);
    expect(target.height, `${target.label} touch target height`).toBeGreaterThanOrEqual(44);
  }
  await page.getByText('Today’s marks').scrollIntoViewIfNeeded();
  const skip = await page.locator('.skip').boundingBox();
  expect(skip?.height).toBeGreaterThanOrEqual(44);
});

test('storage write failures keep the completed round visible and explain recovery', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (storageKey: string, value: string) {
      if (storageKey.endsWith(':session')) throw new DOMException('Storage full', 'QuotaExceededError');
      return original.call(this, storageKey, value);
    };
  });
  await page.goto('/game');
  await page.getByRole('button', { name: 'We did 1 clap' }).click();
  await expect(page.getByText('1 round marked')).toBeVisible();
  await expect(page.getByText('Your browser could not save the game. You can still play this round.')).toBeVisible();
  await expect(page.locator('.round-log li')).toHaveText(['1 clap']);
  expect(errors).toEqual([]);
});

test('storage delete failures never block demo reset or starting a separate real game', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem('demo:number-motion-duet:session', JSON.stringify({ motion: 'steps', count: 7, rounds: [{ count: 7, motion: 'steps' }], confirmed: false }));
    const original = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function (storageKey: string) {
      if (storageKey === 'demo:number-motion-duet:session') throw new DOMException('Access denied', 'SecurityError');
      return original.call(this, storageKey);
    };
  });
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('2 rounds marked')).toBeVisible();
  await expect(page.getByText('Your browser could not reset the saved demo. A fresh sample is ready for this visit.')).toBeVisible();
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/game$/);
  await expect(page.getByText('0 rounds marked')).toBeVisible();
  await expect(page.getByText('Your browser could not clear the saved demo. Your real game is still separate.')).toBeVisible();
  expect(errors).toEqual([]);
});

test('@claim:free-to-play Free to play', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByRole('button', { name: /pay|buy|subscribe/i })).toHaveCount(0);
  await expect(page.locator('form, input[type="payment"], iframe')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'We did 4 claps' })).toBeEnabled();
});

test('@claim:no-online-features Uses no videos, ads, accounts, cameras, or online scores', async ({ page }) => {
  const requests: string[] = [];
  await page.addInitScript(() => {
    let cameraCalls = 0;
    const mediaDevices = navigator.mediaDevices;
    if (mediaDevices) Object.defineProperty(mediaDevices, 'getUserMedia', { configurable: true, value: () => { cameraCalls += 1; return Promise.reject(new Error('Camera is unavailable')); } });
    Object.defineProperty(window, '__cameraCalls', { configurable: true, get: () => cameraCalls });
  });
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'We did 4 claps' }).click();
  await expect(page.locator('video, audio, iframe, [data-ad], [data-score], input[type="email"]')).toHaveCount(0);
  expect(await page.evaluate(() => (window as Window & { __cameraCalls?: number }).__cameraCalls)).toBe(0);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
});

test('@claim:no-personal-details Does not ask for names, email addresses, photos, locations, or child details', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByText('We do not ask for names, email addresses, photos, locations, or child details.')).toBeVisible();
  await expect(page.locator('form, input, textarea, select, [contenteditable="true"]')).toHaveCount(0);
});

test('@claim:no-remote-resources Uses no remote fonts, analytics, trackers, or runtime third-party scripts', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'We did 4 claps' }).click();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
  expect(await page.locator('script[src^="http"], link[rel="stylesheet"][href^="http"]').count()).toBe(0);
});

test('updates titles, descriptions, social metadata, and canonicals for real app URLs', async ({ page }) => {
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Number Motion Duet');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'http://127.0.0.1:4173/demo');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Try a ready-made clap and step game with sample rounds that stay separate from your game.');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'http://127.0.0.1:4173/demo');
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'http://127.0.0.1:4173/privacy');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Read how Number Motion Duet keeps completed rounds in this browser and does not ask for child details.');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Privacy — Number Motion Duet');
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', 'Read how Number Motion Duet keeps completed rounds in this browser and does not ask for child details.');
});

test('@claim:release-updates Installed copies receive releases safely', async () => {
  const worker = await readFile('dist/sw.js', 'utf8');
  expect(worker).toMatch(/const CACHE = 'number-motion-duet-[a-f0-9]{12}'/);
  expect(worker).toMatch(/\/assets\/index-[a-zA-Z0-9_-]+\.js/);
  expect(worker).toMatch(/\/assets\/[a-zA-Z0-9_-]+-[a-zA-Z0-9_-]+\.css/);
  expect(worker).toMatch(/\/assets\/notebook-hero-[a-zA-Z0-9_-]+\.webp/);
  expect(worker).toContain("name.startsWith('number-motion-duet-') && name !== CACHE");
  expect(worker).toContain('caches.delete(name)');
  const currentCache = worker.match(/const CACHE = '([^']+)'/)![1];
  const events = new Map<string, (event: { waitUntil: (promise: Promise<void>) => void }) => void>();
  const deleted: string[] = [];
  let activation: Promise<void> | undefined;
  runInNewContext(worker, {
    self: {
      addEventListener: (name: string, handler: (event: { waitUntil: (promise: Promise<void>) => void }) => void) => events.set(name, handler),
      clients: { claim: async () => undefined },
      location: { origin: 'http://127.0.0.1:4173' }
    },
    caches: {
      keys: async () => ['number-motion-duet-old-release', currentCache, 'unrelated-cache'],
      delete: async (name: string) => { deleted.push(name); return true; }
    },
    URL
  });
  events.get('activate')!({ waitUntil: (promise) => { activation = promise; } });
  await activation;
  expect(deleted).toEqual(['number-motion-duet-old-release']);
});

test('production service worker gets a new cache ID when a precached shell file changes', async () => {
  const temporaryDist = await mkdtemp(join(tmpdir(), 'number-motion-duet-sw-'));
  try {
    await cp('dist', temporaryDist, { recursive: true });
    const buildWorker = () => execFileAsync(process.execPath, ['scripts/build-sw.mjs'], {
      env: { ...process.env, SW_DIST_DIR: temporaryDist }
    });
    await buildWorker();
    const first = await readFile(join(temporaryDist, 'sw.js'), 'utf8');
    const firstCache = first.match(/const CACHE = '([^']+)'/)![1];
    await writeFile(join(temporaryDist, 'index.html'), `${await readFile(join(temporaryDist, 'index.html'), 'utf8')}<!-- changed shell -->`);
    await buildWorker();
    const second = await readFile(join(temporaryDist, 'sw.js'), 'utf8');
    const secondCache = second.match(/const CACHE = '([^']+)'/)![1];
    expect(secondCache).not.toBe(firstCache);
  } finally {
    await rm(temporaryDist, { recursive: true, force: true });
  }
});

test('Static Web Apps has a real styled 404 response override', async () => {
  const config = JSON.parse(await readFile('public/staticwebapp.config.json', 'utf8'));
  expect(config.navigationFallback).toBeUndefined();
  expect(config.responseOverrides?.['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  const page404 = await readFile('public/404.html', 'utf8');
  expect(page404).toContain('<main id="main"');
  expect(page404).toContain('<h1>Page not found.</h1>');
  expect(page404).toContain('aria-label="Main navigation"');
  expect(page404).toContain('Built by Param Factory');
  expect(page404).toContain('href="/terms"');
  const sitemap = await readFile('public/sitemap.xml', 'utf8');
  expect(sitemap).toContain('https://number-motion-duet.sociobot.in/game');
});
