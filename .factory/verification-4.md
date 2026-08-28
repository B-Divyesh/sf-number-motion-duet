# Independent verification 4 — PASS

**Candidate:** `ca10fa5145f0e994f15e648bfafdbe6490965776`  
**Live URL:** <https://number-motion-duet.sociobot.in>  
**Verified:** 2026-08-28  
**Scope:** fresh independent product QA against the researched brief, work order,
and attached acceptance contracts. Product code was not changed.

## Verdict

**PASS — release this candidate.** The live product byte-matches the requested
candidate. The mandatory first-read and one-click demo gates pass, all 11 exact
claim commands pass, the complete clean-install suite and production build pass,
and no release-blocking, high, medium, or low product defect was found.

## Mandatory gates

### Cold first-read — PASS

A new browser context opened the live root at both 1440 × 900 and 390 × 844.
Without prior state, the first screen says:

- **What:** “Make number play a shared movement game.”
- **For whom:** “For caregivers and preschoolers who want numbers to involve
  both bodies.”
- **First click:** **Try it with sample data**, followed by “Starts a ready-made
  clap round.”

The action is visible at both sizes. One click opens `/demo`, where the persistent
“Demo — sample data, nothing is saved to your game” banner, two realistic sample
rounds (`3 steps`, `2 claps`), and ready-made four-clap action are already visible.
There were no console or page errors. Evidence:
`evidence/verification-4-live-cold-desktop.png` and
`evidence/verification-4-live-cold-mobile.png`.

### Registered claim commands — PASS

`.factory/claims.json` exists. Every listed command was run individually before
the general suite, using the product's Playwright demo entry point. Each passed
with one matching test:

| Claim | Exact command | Result |
| --- | --- | --- |
| `demo-isolated` | `npm test -- --grep @claim:demo-isolated` | PASS — 1 passed |
| `keyboard` | `npm test -- --grep @claim:keyboard` | PASS — 1 passed |
| `local-game` | `npm test -- --grep @claim:local-game` | PASS — 1 passed |
| `seeded-demo` | `npm test -- --grep @claim:seeded-demo` | PASS — 1 passed |
| `shape-amount` | `npm test -- --grep @claim:shape-amount` | PASS — 1 passed |
| `offline-demo` | `npm test -- --grep @claim:offline-demo` | PASS — 1 passed |
| `free-to-play` | `npm test -- --grep @claim:free-to-play` | PASS — 1 passed |
| `no-online-features` | `npm test -- --grep @claim:no-online-features` | PASS — 1 passed |
| `no-personal-details` | `npm test -- --grep @claim:no-personal-details` | PASS — 1 passed |
| `no-remote-resources` | `npm test -- --grep @claim:no-remote-resources` | PASS — 1 passed |
| `release-updates` | `npm test -- --grep @claim:release-updates` | PASS — 1 passed |

Landing-page and README claims are represented in the registry. The tests assert
observable outcomes including demo/real storage separation, persistence through
reload, one mark per motion, the seeded landing action, offline reload, request
origins, and versioned service-worker cache cleanup.

## Findings by severity

- **Release-blocking:** none.
- **High:** none.
- **Medium:** none.
- **Low:** none.

## Product and recovery evidence

- **Smallest useful flow:** the adult can select claps or steps and a quantity
  from 1 through 10, confirm the movement, see the same number of labelled shape
  marks, and start the next round. A fresh live ten-round session completed
  quantities 1–10, reported `10 rounds marked`, and retained all ten records in
  the real-game storage namespace.
- **Boundaries:** live quantity 10 produced exactly ten marks; the next call
  wrapped to the correctly singular `1 step` and produced one mark.
- **Demo boundary:** reset restored the two seed rounds and four-clap call.
  **Start for real** removed demo state and opened an empty real game. A completed
  real round remained after reload without importing sample rounds.
- **Invalid/recovery paths:** malformed saved JSON was removed and announced
  accurately. Simulated `QuotaExceededError` kept the completed round visible in
  memory and explained that it could not be saved. Simulated demo-storage delete
  failure still opened a separate empty real game without page errors.
- **No free-form invalid input exists:** all child/caregiver inputs are bounded
  native buttons. Corrupt and unavailable browser storage are the applicable
  invalid-state paths and passed.

## Accessibility and responsive evidence

- Live Axe scans found **zero violations of any impact** on `/`, `/demo`,
  `/game`, `/privacy`, and `/terms`; serious/critical count is zero. The local
  suite also scans the static 404.
- Every app route has `lang="en"`, a route-specific title, one `<h1>`, one main
  landmark, meaningful image alternative text, and no unlabeled button. The
  factory `verify-url.sh` check passed with no browser errors.
- Keyboard-only Tab traversal reaches the skip link, header, demo controls,
  motion buttons, quantities, and completion action. Every focused control has
  a 4 px visible outline. Enter selected quantity 5 and retained focus; Space
  completed it. Route and Back navigation focused the new H1 and announced it.
- At 390 × 844, document width remained 390 px and every measured interactive
  target was at least 44 × 44 CSS px. At 200% text, width still remained 390 px
  and the heading and primary game action remained available.
- With `prefers-reduced-motion: reduce`, the mark animation was `none` and
  transition/animation durations were effectively zero. No flashing or looping
  animation exists.

## Privacy, network, and policy evidence

- The complete landing/demo/game/privacy/terms flow made no cross-origin runtime
  request and set no product cookie. Source inspection found no analytics,
  tracker, remote font/script, API, AI, identity, payment, score, camera, or
  child-data collection path.
- Demo state uses only `demo:number-motion-duet:session`; real state uses only
  `number-motion-duet:session`. The live behavior and claim tests prove the
  namespaces remain separate.
- HTTPS responses include HSTS, `nosniff`, strict-origin referrer policy, and a
  restrictive same-origin CSP with `frame-ancestors 'none'`. No CSP or browser
  console error was observed.
- HTML, the service worker, and 404 revalidate after 30 seconds. Hashed assets
  use `public, max-age=31536000, immutable`.
- This is a browser-only static product with no server API or product-unlock
  call, sign-in, payment, package/CLI surface, or backend persistence. API burst
  rate limiting, Entra authority, package-consumer, and backend concurrency
  checks do not apply.

## PWA, performance, and deployment evidence

- After the first live `/demo` visit, the active cache
  `number-motion-duet-43e7f7a06169` contained the complete shell and hashed
  assets. Offline reload succeeded and displayed “Offline. This game still
  works here.” The service-worker claim test also executes activation against
  an old product cache and proves that unrelated caches remain untouched; a
  separate test proves precache changes create a new cache ID.
- Fresh mobile Lighthouse: Performance **99**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP **0.8 s**, LCP **1.3 s**, TBT **140 ms**,
  CLS **0**, total transfer **79 KiB**. Evidence:
  `evidence/verification-4-lighthouse-home.json`.
- Production output: JavaScript **12,251 B** (**4.65 KiB gzip**), CSS **9,195 B**
  (**2.88 KiB gzip**), hero WebP **72,008 B**, and no webfont. All stated budgets
  pass.
- `/`, `/demo`, `/game`, `/privacy`, `/terms`, `robots.txt`, `sitemap.xml`, and
  every crawled link returned 200. A deliberate missing route returned the
  styled page with HTTP 404.

## Deployment identity

Local production artifacts and the live response matched byte for byte:

| Artifact | SHA-256 (local = live) |
| --- | --- |
| `index.html` | `7101a615049d768316295ffa525cdd3d285571489b7cc87d5b31ed1721c6f467` |
| `sw.js` | `6b61e53568290460d3b879f64ad602e4c2195ee541a3e0f17409b9a9473be9c3` |
| `assets/index-BNUziDtJ.js` | `fbc37d38d1b896785c2c7c964bbec30470037f9f0cef505951a2d8818cb0111e` |
| `assets/style-rXKT0Oem.css` | `dea82bd8b1125db2ae00dc2c200805d0f515bb89b85d1aacc7bf4afd28d9ccfd` |
| `assets/notebook-hero-CdjKL61a.webp` | `d4b9af8cd4662e37868b09277d3d0721e3e809250c8be984ecce9279b2fe5d1e` |
| `404.html` | `c207b11625d938e969fdcf10f2236917d4de4b1ebaa3b6014e3142758b121447` |
| `robots.txt` | `16ceb5ee3e0dc13aa9adf31a3ebbe45a1d965b8c2b9f72eaf84e5911e140ed95` |
| `sitemap.xml` | `b67dfcc0740ef26d3f2a8bda5441954f160d2b30501354539118867934166fb7` |

## Repository gates and reproduction

- `npm ci`: PASS, 25 packages audited, 0 vulnerabilities.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS.
- `npm test`: PASS, **21/21**.
- `npm run build`: PASS; `dist/index.html` exists.
- `git diff --check`: PASS.

Primary commands:

```sh
npm ci
# Each test command from .factory/claims.json, individually
npm run typecheck
npm run lint
npm test
npm run build
node .factory/evidence/qa-live.mjs
VERIFY_NODE_MODULES="$PWD/node_modules" /opt/fleet/lib/verify-url.sh \
  https://number-motion-duet.sociobot.in .factory/evidence/verification-4-verify-url
CHROME_PATH=/opt/pw-browsers/chromium-1208/chrome-linux64/chrome \
  npx --yes lighthouse@12.8.2 https://number-motion-duet.sociobot.in/
```

Structured live evidence is in `evidence/qa-live.json`. Fresh verifier screenshots
and the factory URL-verifier output are under `evidence/verification-4-*`.
