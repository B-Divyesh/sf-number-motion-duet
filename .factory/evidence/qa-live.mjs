import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { writeFile } from 'node:fs/promises';

const base = 'https://number-motion-duet.sociobot.in';
const browser = await chromium.launch({ headless: true });
const report = { generatedAt: new Date().toISOString(), base };
function assert(condition, message) { if (!condition) throw new Error(message); }

async function observe(page) {
  const consoleErrors = [];
  const pageErrors = [];
  const requests = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('request', (request) => requests.push({ url: request.url(), method: request.method(), type: request.resourceType() }));
  return { consoleErrors, pageErrors, requests };
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const routeResults = [];
  for (const route of ['/', '/demo', '/game', '/privacy', '/terms', '/not-a-real-page']) {
    const page = await context.newPage();
    const observed = await observe(page);
    const response = await page.goto(base + route, { waitUntil: 'networkidle' });
    const axe = await new AxeBuilder({ page }).analyze();
    const result = {
      route,
      status: response?.status(),
      title: await page.title(),
      lang: await page.locator('html').getAttribute('lang'),
      h1: await page.locator('h1').allTextContents(),
      mainCount: await page.locator('main').count(),
      seriousCritical: axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
      allAxeViolations: axe.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })),
      externalRequests: observed.requests.filter((r) => new URL(r.url).origin !== base),
      consoleErrors: observed.consoleErrors,
      pageErrors: observed.pageErrors
    };
    assert(result.status === (route === '/not-a-real-page' ? 404 : 200), `${route} returned ${result.status}`);
    assert(result.h1.length === 1 && result.mainCount === 1, `${route} does not have one h1 and one main`);
    assert(result.seriousCritical.length === 0, `${route} has serious Axe findings`);
    const unexpectedConsoleErrors = route === '/not-a-real-page'
      ? result.consoleErrors.filter((message) => !message.includes('Failed to load resource'))
      : result.consoleErrors;
    assert(unexpectedConsoleErrors.length === 0 && result.pageErrors.length === 0, `${route} has browser errors`);
    if (route === '/not-a-real-page') {
      result.metadata = {
        canonical: await page.locator('link[rel="canonical"]').getAttribute('href'),
        ogType: await page.locator('meta[property="og:type"]').getAttribute('content'),
        ogTitle: await page.locator('meta[property="og:title"]').getAttribute('content'),
        ogDescription: await page.locator('meta[property="og:description"]').getAttribute('content'),
        ogUrl: await page.locator('meta[property="og:url"]').getAttribute('content'),
        ogImage: await page.locator('meta[property="og:image"]').getAttribute('content'),
        twitterCard: await page.locator('meta[name="twitter:card"]').getAttribute('content'),
        twitterTitle: await page.locator('meta[name="twitter:title"]').getAttribute('content'),
        twitterDescription: await page.locator('meta[name="twitter:description"]').getAttribute('content'),
        appleTouchIcon: await page.locator('link[rel="apple-touch-icon"]').getAttribute('href')
      };
      assert(result.h1[0] === 'Page not found.', '404 heading is not literal');
      assert(result.metadata.canonical === 'https://number-motion-duet.sociobot.in/404.html', '404 canonical is missing or wrong');
      assert(result.metadata.ogType === 'website', '404 Open Graph type is missing');
      assert(result.metadata.ogTitle === 'Page not found — Number Motion Duet', '404 Open Graph title is missing');
      assert(result.metadata.ogDescription === 'The requested Number Motion Duet page was not found.', '404 Open Graph description is missing');
      assert(result.metadata.ogUrl === 'https://number-motion-duet.sociobot.in/404.html', '404 Open Graph URL is missing');
      assert(result.metadata.ogImage === 'https://number-motion-duet.sociobot.in/assets/social-card.svg', '404 Open Graph image is missing');
      assert(result.metadata.twitterCard === 'summary_large_image', '404 Twitter card is missing');
      assert(result.metadata.twitterTitle === 'Page not found — Number Motion Duet', '404 Twitter title is missing');
      assert(result.metadata.twitterDescription === 'The requested Number Motion Duet page was not found.', '404 Twitter description is missing');
      assert(result.metadata.appleTouchIcon === '/apple-touch-icon.svg', '404 Apple touch icon is missing');
      result.screenshot = '.factory/evidence/polish-4-live-404.png';
      await page.screenshot({ path: result.screenshot, fullPage: true });
    }
    routeResults.push(result);
    await page.close();
  }
  report.routes = routeResults;
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  const observed = await observe(page);
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '.factory/evidence/polish-4-live-first-screen-mobile.png' });
  const firstScreen = await page.evaluate(() => {
    const labels = ['Practice numbers with claps and steps', 'Try it with sample data', 'Play without an account.', 'Use touch or keyboard.', 'Free to play.'];
    const elements = labels.map((label) => [...document.querySelectorAll('h1, a, li')].find((element) => element.textContent?.trim() === label));
    return elements.map((element, index) => {
      const box = element?.getBoundingClientRect();
      return { label: labels[index], visible: Boolean(box && box.top >= 0 && box.bottom <= window.innerHeight), top: box?.top, bottom: box?.bottom };
    });
  });
  assert(firstScreen.every((item) => item.visible), 'A required first-screen item is outside the 390px viewport');
  const footerPrivacy = page.locator('footer').getByRole('link', { name: 'Privacy' });
  await footerPrivacy.scrollIntoViewIfNeeded();
  const homeScroll = await page.evaluate(() => window.scrollY);
  assert(homeScroll > 0, 'Footer navigation did not start below the fold');
  await footerPrivacy.click();
  await page.waitForURL(base + '/privacy');
  await page.waitForFunction(() => document.activeElement?.textContent?.trim() === 'Your game stays on this device');
  const forwardRoute = await page.evaluate(() => {
    const box = document.querySelector('h1')?.getBoundingClientRect();
    return { scrollY: window.scrollY, top: box?.top, bottom: box?.bottom, viewport: window.innerHeight };
  });
  assert((forwardRoute.scrollY ?? Infinity) <= 1 && (forwardRoute.top ?? -1) >= 0 && (forwardRoute.bottom ?? Infinity) <= forwardRoute.viewport, 'Forward route focus is not visible at the destination');
  await page.goBack();
  await page.waitForURL(base + '/');
  await page.waitForFunction((expected) => Math.abs(window.scrollY - expected) <= 1, homeScroll);
  assert(observed.consoleErrors.length === 0 && observed.pageErrors.length === 0, 'Mobile first-read flow has browser errors');
  report.polish4 = { firstScreen, forwardRoute, homeScroll, screenshot: '.factory/evidence/polish-4-live-first-screen-mobile.png', consoleErrors: observed.consoleErrors, pageErrors: observed.pageErrors };
  await context.close();
}

{
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();
  const observed = await observe(page);
  await page.goto(base + '/?demo=1', { waitUntil: 'networkidle' });
  const beforeReset = {
    url: page.url(),
    title: await page.title(),
    banner: await page.getByText('Demo — sample data, nothing is saved to your game.').isVisible(),
    reset: await page.getByRole('button', { name: 'Reset demo' }).isVisible(),
    startReal: await page.getByRole('button', { name: 'Start for real' }).isVisible(),
    rounds: await page.locator('.round-log li').allTextContents(),
    action: await page.getByRole('button', { name: 'We did 4 claps' }).isVisible()
  };
  assert(beforeReset.url === `${base}/?demo=1` && beforeReset.title === 'Demo — Number Motion Duet' && beforeReset.banner && beforeReset.reset && beforeReset.startReal && beforeReset.action && beforeReset.rounds.join('|') === '3 steps|2 claps', 'Direct demo query did not open the isolated sample game');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  assert((await page.locator('.round-log li').allTextContents()).join('|') === '3 steps|2 claps', 'Reset demo did not restore the sample');
  assert(observed.consoleErrors.length === 0 && observed.pageErrors.length === 0, 'Direct demo query has browser errors');
  report.demoQuery = { ...beforeReset, consoleErrors: observed.consoleErrors, pageErrors: observed.pageErrors };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  const observed = await observe(page);
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const firstScreen = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent?.trim(),
    visibleText: document.body.innerText,
    actions: [...document.querySelectorAll('a,button')].filter((element) => {
      const box = element.getBoundingClientRect();
      return box.top < innerHeight && box.bottom > 0 && getComputedStyle(element).visibility !== 'hidden';
    }).map((element) => ({ text: element.textContent?.trim(), href: element.href || null }))
  }));
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.waitForURL(base + '/demo');
  const initialDemo = {
    banner: await page.getByText('Demo — sample data, nothing is saved to your game.').isVisible(),
    roundCount: await page.locator('.round-log li').count(),
    log: await page.locator('.round-log li').allTextContents(),
    storage: await page.evaluate(() => ({ demo: localStorage.getItem('demo:number-motion-duet:session'), real: localStorage.getItem('number-motion-duet:session') }))
  };
  await page.getByRole('button', { name: 'Steps' }).click();
  await page.getByRole('button', { name: '10', exact: true }).click();
  await page.getByRole('button', { name: 'We did 10 steps' }).click();
  const boundaryTen = {
    marks: await page.locator('.shape-strip .shape').count(),
    confirmation: await page.getByText('✓ 10 steps marked with shapes.').isVisible(),
    roundCount: await page.locator('.round-log li').count()
  };
  await page.getByRole('button', { name: 'Call another number' }).click();
  const wrappedAfterTen = await page.getByText('Call 1 step').isVisible();
  await page.getByRole('button', { name: 'We did 1 step' }).click();
  const boundaryOne = {
    marks: await page.locator('.shape-strip .shape').count(),
    singularConfirmation: await page.getByText('✓ 1 step marked with shapes.').isVisible()
  };
  await page.getByRole('button', { name: 'Reset demo' }).click();
  const reset = {
    calledFourClaps: await page.getByText('Call 4 claps').isVisible(),
    log: await page.locator('.round-log li').allTextContents()
  };
  await page.getByRole('button', { name: 'Start for real' }).click();
  const realAfterDemo = {
    url: page.url(),
    bannerCount: await page.getByText('Demo — sample data, nothing is saved to your game.').count(),
    roundCountText: await page.locator('.round-count').textContent(),
    empty: await page.getByText('Completed rounds will appear here.').isVisible(),
    storage: await page.evaluate(() => ({ demo: localStorage.getItem('demo:number-motion-duet:session'), real: localStorage.getItem('number-motion-duet:session') }))
  };
  await page.getByRole('button', { name: 'We did 1 clap' }).click();
  await page.reload({ waitUntil: 'networkidle' });
  const persistedReal = {
    roundCountText: await page.locator('.round-count').textContent(),
    log: await page.locator('.round-log li').allTextContents(),
    storage: await page.evaluate(() => JSON.parse(localStorage.getItem('number-motion-duet:session') ?? '{}').rounds)
  };
  report.flow = { firstScreen, initialDemo, boundaryTen, wrappedAfterTen, boundaryOne, reset, realAfterDemo, persistedReal, externalRequests: observed.requests.filter((r) => new URL(r.url).origin !== base), consoleErrors: observed.consoleErrors, pageErrors: observed.pageErrors };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem('number-motion-duet:session', '{broken'));
  await page.goto(base + '/game');
  report.corruptStorage = {
    message: await page.locator('.status').textContent(),
    empty: await page.getByText('Completed rounds will appear here.').isVisible(),
    roundCount: await page.locator('.round-log li').count(),
    storedValue: await page.evaluate(() => localStorage.getItem('number-motion-duet:session'))
  };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.goto(base + '/demo');
  const sequence = [];
  for (let index = 0; index < 20; index += 1) {
    await page.keyboard.press('Tab');
    sequence.push(await page.evaluate(() => {
      const element = document.activeElement;
      const style = element ? getComputedStyle(element) : null;
      const box = element?.getBoundingClientRect();
      return { tag: element?.tagName, text: element?.textContent?.trim(), ariaLabel: element?.getAttribute('aria-label'), outline: style?.outline, box: box ? [Math.round(box.width), Math.round(box.height)] : null };
    }));
  }
  await page.getByRole('button', { name: '5', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.activeElement?.textContent?.trim() === '5');
  const focusAfterSelection = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim().slice(0, 80) }));
  await page.getByRole('button', { name: 'We did 5 claps' }).focus();
  await page.keyboard.press('Space');
  const keyboardResult = await page.getByText('✓ 5 claps marked with shapes.').isVisible();
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await page.waitForTimeout(150);
  const routeFocus = await page.evaluate(() => ({ url: location.href, tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim(), tabindex: document.activeElement?.getAttribute('tabindex') }));
  await page.goBack();
  await page.waitForURL(base + '/demo');
  await page.waitForTimeout(150);
  const backFocus = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim() }));
  report.keyboard = { sequence, focusAfterSelection, keyboardResult, routeFocus, backFocus };
  await context.close();
}

{
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.addInitScript(() => {
    Storage.prototype.setItem = function setItem() { throw new DOMException('Quota exceeded', 'QuotaExceededError'); };
  });
  await page.goto(base + '/game');
  await page.getByRole('button', { name: 'We did 1 clap' }).click();
  report.storageWriteFailure = {
    status: await page.locator('.status').textContent(),
    confirmationCount: await page.getByText('✓ 1 clap marked with shapes.').count(),
    roundCount: await page.locator('.round-count').textContent()
  };
  await context.close();
}

{
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.addInitScript(() => {
    Storage.prototype.removeItem = function removeItem() { throw new DOMException('Access denied', 'SecurityError'); };
  });
  await page.goto(base + '/demo');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.waitForTimeout(100);
  report.storageDeleteFailure = { url: page.url(), pageErrors };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  const observed = await observe(page);
  await page.goto(base + '/demo', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '.factory/evidence/live-mobile-demo.png', fullPage: true });
  const measurements = await page.evaluate(() => ({
    viewport: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    touchTargets: [...document.querySelectorAll('a,button')].filter((element) => {
      const style = getComputedStyle(element); const box = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
    }).map((element) => { const box = element.getBoundingClientRect(); return { text: element.textContent?.trim(), width: Math.round(box.width), height: Math.round(box.height) }; }),
    bodyFontSize: getComputedStyle(document.body).fontSize
  }));
  const axe = await new AxeBuilder({ page }).analyze();
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const text200 = await page.evaluate(() => ({ viewport: innerWidth, scrollWidth: document.documentElement.scrollWidth, h1Visible: Boolean(document.querySelector('h1')?.getClientRects().length), confirmVisible: Boolean(document.querySelector('[data-action="confirm"]')?.getClientRects().length) }));
  await page.screenshot({ path: '.factory/evidence/live-mobile-demo-text-200.png', fullPage: true });
  report.mobile = { measurements, tooSmall: measurements.touchTargets.filter((target) => target.width < 44 || target.height < 44), text200, seriousCritical: axe.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? '')).map((v) => v.id), consoleErrors: observed.consoleErrors, pageErrors: observed.pageErrors };
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  const page = await context.newPage();
  await page.goto(base + '/demo');
  await page.getByRole('button', { name: 'We did 4 claps' }).click();
  report.reducedMotion = await page.evaluate(() => {
    const mark = document.querySelector('.shape');
    const markStyle = mark ? getComputedStyle(mark) : null;
    return { matches: matchMedia('(prefers-reduced-motion: reduce)').matches, animationName: markStyle?.animationName, animationDuration: markStyle?.animationDuration, transitionDuration: markStyle?.transitionDuration };
  });
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const observed = await observe(page);
  await page.goto(base + '/demo', { waitUntil: 'networkidle' });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'networkidle' });
  const cachesBefore = await page.evaluate(async () => Promise.all((await caches.keys()).map(async (name) => ({ name, paths: (await (await caches.open(name)).keys()).map((request) => new URL(request.url).pathname) }))));
  await context.setOffline(true);
  await page.goto(base + '/demo', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  report.offline = {
    heading: await page.getByRole('heading', { name: 'Call a number. Move together.' }).isVisible(),
    status: await page.getByText('Offline. This game still works here.').isVisible(),
    cachesBefore,
    consoleErrors: observed.consoleErrors,
    pageErrors: observed.pageErrors
  };
  await context.close();
}

await browser.close();
await writeFile('.factory/evidence/qa-live.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
