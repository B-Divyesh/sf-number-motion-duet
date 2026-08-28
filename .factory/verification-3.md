# Independent verification 3 — FAIL

**Candidate:** `46d9212159b667c10bac6b5ac40043449e500cd9`  
**Live URL:** <https://number-motion-duet.sociobot.in>  
**Verified:** 2026-08-28  
**Scope:** clean-install, independent QA against the researched brief, work order, and attached claims/demo/accessibility contracts. Product code was not changed.

## Verdict

**FAIL — do not release this candidate.** The deployed application byte-matches the candidate and the actual product, security, accessibility, performance, offline, and recovery checks pass. The release is blocked by the mandatory claims contract: a listed claim test does not prove persistence promised by the claim, and visible functionality claims remain unlisted.

## Mandatory first gates

### Cold first-read — PASS

A brand-new desktop browser context opened the live root with no console or page errors. Its first screen says:

- **What:** “Make number play a shared movement game.”
- **For whom:** “For caregivers and preschoolers who want numbers to involve both bodies.”
- **First action:** the visible **Try it with sample data** link, immediately followed by “Starts a ready-made clap round.”

The link opens `/demo` in one click. The demo immediately displays its banner, two sample rounds, and the ready-made four-clap call. Screenshot: `evidence/verification-3-live-cold-desktop.png`.

### Registered claim commands — PASS, but coverage is not sufficient

After `npm ci` from this clean checkout, every command listed in `.factory/claims.json` passed against the local demo entry point:

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-isolated` | `npm test -- --grep @claim:demo-isolated` | PASS — 1 passed |
| `keyboard` | `npm test -- --grep @claim:keyboard` | PASS — 1 passed |
| `local-game` | `npm test -- --grep @claim:local-game` | PASS — 1 passed |
| `offline-demo` | `npm test -- --grep @claim:offline-demo` | PASS — 1 passed |
| `free-to-play` | `npm test -- --grep @claim:free-to-play` | PASS — 1 passed |
| `no-online-features` | `npm test -- --grep @claim:no-online-features` | PASS — 1 passed |
| `no-personal-details` | `npm test -- --grep @claim:no-personal-details` | PASS — 1 passed |
| `no-remote-resources` | `npm test -- --grep @claim:no-remote-resources` | PASS — 1 passed |
| `release-updates` | `npm test -- --grep @claim:release-updates` | PASS — 1 passed |

Each ID occurs exactly once in `tests/app.spec.ts`. The finding below concerns what the `local-game` test actually asserts, not a command failure.

## Release-blocking findings

### High — mandatory claim coverage is incomplete

1. `local-game` promises: “Play without an account, **keep round history in this browser**, and send it nowhere.” Its sole tagged test completes a round and asserts the current DOM contains “4 claps”; it never reloads, reads the saved session, or otherwise observes that history persists. This is not proof of the claimed persistence outcome, contrary to the claims contract’s requirement for an observable sandbox outcome.

   Independent live testing shows the behavior currently works: after completing one real round, reloading `/game` still showed “1 round marked” and `1 clap`. That does not repair the required executable claim proof.

2. The first-screen action note says **“Starts a ready-made clap round.”** This is a visitor-facing functional claim, but `.factory/claims.json` has no corresponding claim ID and no tagged test that asserts the landing action opens a seeded four-clap sample. The direct `/demo` test happens to exercise the current state, but it is registered only as `demo-isolated` and does not assert the landing action or seed. The game also says shape marks show the amount without asking the child to read; that functional assertion is likewise not registered.

Per the supplied claims contract, unlisted visitor claims and claim tests that only establish a button/current render rather than the promised outcome fail review. Add narrowly stated entries and one observable `@claim:` test per claim (including reload persistence for `local-game`), or remove/soften the corresponding copy.

## Passing product evidence

- **Brief / normal and boundary flow:** live demo starts with 2 claps and 3 steps; select Steps and 10, confirm 10 shape marks, then advance to the correctly singular “Call 1 step” and confirm one mark. Reset restores the seeded demo. **Start for real** opens an empty non-demo game and clears sample state.
- **Invalid/recovery paths:** corrupt saved JSON is removed and shows “Saved rounds could not be read, so a new game started.” Simulated `QuotaExceededError` still confirms and displays the round with an explanatory status. Simulated demo-storage delete failure still opens the separate real game without page errors.
- **Privacy:** live full-flow request capture on all app routes found only same-origin requests, no external script/style/resource, no form/account/payment surface, no camera use, and no cookies set in the tested context. Source inspection found no runtime API, analytics, identity, billing, or AI endpoint.
- **Accessibility:** live Axe found no violations, including serious/critical, on `/`, `/demo`, `/game`, `/privacy`, `/terms`, and a real HTTP 404. Every app route has `lang="en"`, one main landmark, one h1, title, visible 4 px focus treatment, and keyboard native controls. At 390 × 844 all measured interactive controls are at least 44 px tall; 200% text stays at a 390 px document width. Reduced motion removes the shape animation (`animation-name: none`).
- **Keyboard:** Enter selects a quantity; Space confirms it. Focus now remains on the selected control after the re-render. Client-side navigation and Back move focus to the new h1 and announce the route.
- **Offline/PWA:** after first live `/demo` visit, the active versioned `number-motion-duet-*` cache contains the shell and hashed assets; an offline reload succeeds and shows “Offline. This game still works here.” The complete local suite also verifies old product-only cache removal and cache-ID changes when precached content changes.
- **Repository gates:** `npm ci` (0 vulnerabilities), `npm run typecheck`, `npm run lint`, `npm test` (19/19), and `npm run build` all passed. The production build created `dist/`.
- **Performance:** fresh mobile Lighthouse: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 0.9 s, LCP 1.3 s, TBT 130 ms, CLS 0, total transfer 79 KiB. Build output: JS 12,265 B (4.66 KiB gzip), CSS 9,195 B (2.88 KiB gzip), hero WebP 72,008 B—within every stated static budget.
- **Security/cache policy:** HTTPS provides HSTS, same-origin CSP, `X-Content-Type-Options: nosniff`, and strict-origin referrer policy. HTML and `sw.js` revalidate after 30 seconds; hashed JS/CSS/WebP use `public, max-age=31536000, immutable`. Missing route returns a styled HTTP 404.
- **Deployment identity:** the local candidate and live site SHA-256 match exactly for `index.html`, `sw.js`, `assets/index-DGGN94E8.js`, `assets/style-rXKT0Oem.css`, and `assets/notebook-hero-CdjKL61a.webp`.
- **Links:** live first-party routes `/`, `/demo`, `/game`, `/privacy`, `/terms`, plus the external Param Factory link, returned 200. The deliberate missing route correctly returned 404.

## Deployment hashes

| Artifact | SHA-256 (local = live) |
| --- | --- |
| `index.html` | `c4f4339c1f8ba5b03fda2ae5248b89199a760d2dd2bd0554baf725f9042225ff` |
| `sw.js` | `156d00b1f00cef988a5fb318bc7f0948d6fc437416fcf07e7df368e4bec0ad49` |
| `assets/index-DGGN94E8.js` | `ecd15498fc5346b81508803134f15cffa9c5ea00a3bcb5495063117ea22d795e` |
| `assets/style-rXKT0Oem.css` | `dea82bd8b1125db2ae00dc2c200805d0f515bb89b85d1aacc7bf4afd28d9ccfd` |
| `assets/notebook-hero-CdjKL61a.webp` | `d4b9af8cd4662e37868b09277d3d0721e3e809250c8be984ecce9279b2fe5d1e` |

## Not applicable

This is a static local-first product with no server endpoint, sign-in, payment, package/CLI public API, or backend persistence. API burst/rate-limit, Entra authority, consumer-package, and backend concurrency checks do not apply.

## Evidence and reproduction

- `evidence/qa-live.mjs` / `evidence/qa-live.json` — live browser, Axe, mobile, storage, offline, keyboard, and flow probe
- `evidence/verification-3-live-cold-desktop.png` — fresh cold first-read screenshot
- `evidence/live-mobile-demo.png` and `evidence/live-mobile-demo-text-200.png` — fresh 390 px screenshots
- `evidence/verification-3-lighthouse-home.json` — fresh Lighthouse report

Commands:

```sh
npm ci
npm run build
npm test -- --grep @claim:demo-isolated
npm test -- --grep @claim:keyboard
npm test -- --grep @claim:local-game
npm test -- --grep @claim:offline-demo
npm test -- --grep @claim:free-to-play
npm test -- --grep @claim:no-online-features
npm test -- --grep @claim:no-personal-details
npm test -- --grep @claim:no-remote-resources
npm test -- --grep @claim:release-updates
npm run typecheck
npm run lint
npm test
npm run build
node .factory/evidence/qa-live.mjs
```
