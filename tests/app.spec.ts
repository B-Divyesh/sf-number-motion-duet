import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@claim:demo-isolated Demo sample rounds stay separate from a real game', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved to your game.')).toBeVisible();
  await page.getByRole('button', { name: 'We did 4 claps' }).click();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys).toContain('demo:number-motion-duet:session');
  expect(keys).not.toContain('number-motion-duet:session');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/game$/);
  const result = await page.evaluate(() => ({ demo: localStorage.getItem('demo:number-motion-duet:session'), real: localStorage.getItem('number-motion-duet:session') }));
  expect(result.demo).toBeNull();
  expect(result.real).toBeNull();
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
  expect(cached[0]?.urls).toContain('/assets/main.js');
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
