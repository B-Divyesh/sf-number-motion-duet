# Independent verification 2 — FAIL

**Candidate:** `771f9e7712adee2f36de8bf1374b2eeb3a15d84f`  
**Live URL:** https://number-motion-duet.sociobot.in  
**Date:** 2026-08-28  
**Scope:** fresh, independent product QA against the supplied researched brief and work order. Product code was not changed.

## Verdict

**FAIL — do not release this candidate.** The core game, demo isolation, offline path, production build, deployment identity, and automated tests work. The candidate still violates mandatory acceptance requirements: several visitor claims are absent from `.factory/claims.json`; the two demo controls are below the 44 px touch minimum; browser-storage failure makes the main round action fail silently and can break **Start for real**; keyboard selection drops focus to the document; and 200% text causes substantial horizontal overflow.

## Mandatory first gates

### First-read test

**PASS.** In a cold 1440 × 900 browser, the first screen says:

- what: “Make number play a shared movement game”;
- for whom: “For caregivers and preschoolers who want numbers to involve both bodies”;
- first click: **Try it with sample data**, followed by “Starts a ready-made clap round.”

That link opens `/demo` in one click. The first demo screen already contains two realistic sample rounds and a four-clap call. Evidence: `evidence/live-cold-desktop.png` and `evidence/qa-live.json`.

### Listed claim tests

The clean checkout initially had no `node_modules`; literal pre-install invocations could not load `@playwright/test`. After the required lockfile install (`npm ci`), every exact claim command ran against the demo entry point and passed:

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-isolated` | `npm test -- --grep @claim:demo-isolated` | PASS — 1 passed |
| `keyboard` | `npm test -- --grep @claim:keyboard` | PASS — 1 passed |
| `local-game` | `npm test -- --grep @claim:local-game` | PASS — 1 passed |
| `offline-demo` | `npm test -- --grep @claim:offline-demo` | PASS — 1 passed |

The full run repeated all four successfully. The pre-install errors were dependency-bootstrap errors, not failed product assertions. Under a literal interpretation that any non-zero initial claim command is blocking, those invocations are independently blocking; the substantive findings below already make the verdict FAIL.

## Findings

### High — visitor claims are missing from the mandatory claims registry

`.factory/claims.json` contains only four entries, but the live product and README make additional claims, including:

- “Free to play.”
- “There are no videos, ads, accounts, cameras, or online scores.”
- “We do not ask for names, email addresses, photos, locations, or child details.”
- “No remote fonts, analytics, trackers, or runtime third-party scripts are used.”
- “The build hashes app assets and generates a versioned service-worker cache so installed copies receive releases safely.”

Some are true in this candidate and some have untagged test coverage, but none is listed with exactly one `@claim:<id>` test. The attached claims contract explicitly says an unlisted claim fails review. Add each relied-on claim and an observable demo-sandbox test, or remove/merge the copy.

### Medium — storage failure prevents play and contradicts the recovery copy

With `Storage.setItem` throwing `QuotaExceededError`, a fresh `/game` says neither that saving failed nor that the action was rejected. Activating **We did 1 clap** produces no confirmation, keeps `0 rounds marked`, and leaves the status empty. The code sets a save-error status and immediately clears it during re-render.

With `Storage.removeItem` throwing `SecurityError`, **Start for real** stays on `/demo` and raises the page error `Access denied`; **Reset demo** is affected by the same uncaught call. This contradicts the in-product recovery promise “You can still play this round.” Evidence: `evidence/qa-live.json` (`storageWriteFailure`, `storageDeleteFailure`).

### Medium — demo controls are below the 44 px touch-target baseline

At 390 × 844 and desktop, **Reset demo** measures `123 × 35` CSS px and **Start for real** measures `134 × 35` CSS px. Every other measured interactive target is at least 44 px high. The accessibility and design contracts require all touch targets to be at least 44 × 44 px. Evidence: `evidence/qa-live.json` and `evidence/live-mobile-demo.png`.

### Medium — keyboard actions discard focus

Keyboard activation itself works, but choosing a quantity re-renders the whole app and moves focus from the selected button to `<body>`. The next Tab returns to **Skip to the game**, forcing a keyboard-only player to traverse the page again before confirming. The shipped claim test hides this by programmatically focusing the confirmation button. Route changes correctly focus the new `<h1>` after an animation frame. Evidence: `evidence/qa-live.json` (`keyboard.focusAfterSelection`).

### Medium — 200% text does not reflow at the tested phone width

At 390 px, default text fits exactly (`scrollWidth === 390`). With text resized to 200%, document width grows to `619` px; the main game sheet, quantity grid, and round log extend off-screen and require horizontal scrolling. Evidence: `evidence/live-mobile-demo-text-200.png` and `evidence/qa-live.json`.

### Low — non-home canonical metadata is wrong

Every SPA route retains the home canonical URL. Lighthouse on `/demo` reports “Document does not have a valid `rel=canonical`” because it points to the domain root, reducing the SEO score to 92. Route titles do update correctly.

### Low — route discovery and the static 404 skeleton are incomplete

`sitemap.xml` omits the real `/game` route. The real HTTP 404 page is styled and accessible, but its header omits standard navigation and its footer omits Privacy, Terms, “Built by Param Factory,” and the version required on every route.

## Passing evidence

- **Core flow and boundaries:** from a fresh context, `/demo` shows two sample rounds; 10 steps produces 10 marks; the next call wraps to 1 step with correct singular copy; reset restores the sample; **Start for real** deletes demo state and opens an empty game. Corrupt JSON is removed with an accurate recovery message.
- **Demo/privacy boundary:** demo and real localStorage namespaces remain separate. Landing, demo, game, privacy, and terms made no cross-origin requests and no cookies or trackers were observed.
- **Repository gates:** `npm ci` reported zero vulnerabilities; `npm run lint` (TypeScript) passed; `npm test` passed all 12 tests; `npm run build` passed and produced `dist/`; `git diff --check` passed.
- **Accessibility:** axe reported zero violations of any impact on `/`, `/demo`, `/game`, `/privacy`, `/terms`, and the real 404. Each app route has `lang=en`, one `<h1>`, one `<main>`, meaningful image alt text, keyboard-operable native controls, and a 4 px visible focus ring. Reduced motion removes the stamp animation (`animation-name: none`, 0.01 ms duration). Default 390 px layout has no overflow.
- **PWA/offline:** after a first live `/demo` visit, offline reload succeeds and announces “Offline. This game still works here.” The active cache is `number-motion-duet-62e11a15bcc5` with the complete shell and hashed assets. The local update/cache-ID tests pass.
- **Headers/caching:** HTTPS responses include HSTS, a restrictive same-origin CSP, `nosniff`, and `strict-origin-when-cross-origin`. HTML and `sw.js` revalidate after 30 seconds; hashed assets use one-year immutable caching. A missing route returns a real HTTP 404.
- **Performance:** fresh mobile Lighthouse on `/` scored Performance 99, Accessibility 100, Best Practices 100, SEO 100; FCP 0.8 s, LCP 1.2 s, TBT 100 ms, CLS 0, and 79 KiB total transfer. `/demo` scored 100/100/100/92, with FCP/LCP 1.2 s, TBT 10 ms, and CLS 0. Built assets are 11.49 KB JS (4.42 KB gzip), 8.91 KB CSS (2.84 KB gzip), no fonts, and a 72.01 KB hero image—inside all budgets.
- **Deployment identity:** SHA-256 matches exactly between local `dist/` and live for `index.html`, hashed JS, hashed CSS, hero WebP, and `sw.js`. The live deployment is the candidate content.
- **Links:** `/`, `/demo`, `/game`, `/privacy`, `/terms`, `robots.txt`, `sitemap.xml`, icons, social card, and the external Sociobot link return 200. The deliberate missing route returns 404.
- **Not applicable:** this static product has no server API, payment, sign-in, package/CLI consumer surface, or concurrency/persistence backend. Rate-limit, Entra authority, and package-install checks therefore do not apply.

## Deployment hashes

| Artifact | SHA-256 (local and live) |
| --- | --- |
| `index.html` | `7aaf3fbd4a1ef5135af6a7a4d85851c08539e830830cabe2724017944bcd3bff` |
| `assets/index-CUvO2bNl.js` | `7418029f5dda86fe84be2da44e578295855049b1866163364021b31e48a31b3a` |
| `assets/style-C6wM4nEX.css` | `cff9d1a138d068c99764b26369ff577160ff9adbf34177959a6f5b77e85acfd0` |
| `assets/notebook-hero-CdjKL61a.webp` | `d4b9af8cd4662e37868b09277d3d0721e3e809250c8be984ecce9279b2fe5d1e` |
| `sw.js` | `857e342347a5de34f3cfd2dc207180582191daf4d2e75efeb0a6d25514e92bf3` |

## Evidence and reproduction

- `evidence/qa-live.mjs` — reproducible Playwright/axe live QA probe
- `evidence/qa-live.json` — structured live results
- `evidence/live-cold-desktop.png`
- `evidence/live-mobile-demo.png`
- `evidence/live-mobile-demo-text-200.png`
- `evidence/lighthouse-live-home.json`
- `evidence/lighthouse-live-demo.json`

Primary commands:

```sh
npm ci
npm test -- --grep @claim:demo-isolated
npm test -- --grep @claim:keyboard
npm test -- --grep @claim:local-game
npm test -- --grep @claim:offline-demo
npm run lint
npm test
npm run build
node .factory/evidence/qa-live.mjs
git diff --check
```
