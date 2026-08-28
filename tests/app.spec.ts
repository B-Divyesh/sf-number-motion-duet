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
  const done = page.getByRole('button', { name: 'We did 5 claps' });
  await done.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('img', { name: '5 shape marks' })).toBeVisible();
});

test('@claim:local-game Play without an account and keep round history in this browser', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'We did 4 claps' }).click();
  await expect(page.getByText('4 claps', { exact: true }).first()).toBeVisible();
  await expect(page.locator('input[type="email"], input[type="password"], form')).toHaveCount(0);
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBeTruthy();
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

test('has no serious or critical accessibility violations', async ({ page }) => {
  await page.goto('/demo');
  const results = await new AxeBuilder({ page: page as never }).analyze();
  const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
  expect(serious).toEqual([]);
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

test('fits a 390px phone and loads without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.getByRole('button', { name: 'We did 4 claps' })).toBeVisible();
  const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: window.innerWidth }));
  expect(dimensions.width).toBeLessThanOrEqual(dimensions.viewport);
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
  await page.goto('/game');
  const targets = page.locator('.wordmark, .nav a, .site-footer a');
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

test('production service worker updates an old controlled client cache to the current release', async () => {
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
  expect(page404).toContain('<h1>That page has wandered off.</h1>');
});
