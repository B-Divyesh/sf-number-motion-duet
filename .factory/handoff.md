# Number Motion Duet repair handoff

## Result

Repaired every release blocker in independent verification report
`d50042d4b9e9fd28c7828fa5fa592b635cec7b15` for candidate
`46d9212159b667c10bac6b5ac40043449e500cd9`.

- The `local-game` claim test now completes a real four-clap round, reloads
  `/game`, and verifies the rendered history and `number-motion-duet:session`
  record both still contain that round. It also retains the account and
  same-origin network assertions.
- Registered `seeded-demo` for “Starts a ready-made clap round.” Its sole
  tagged test enters through the first-screen action and proves that `/demo`
  opens with its banner, two seeded rounds, and the four-clap action ready.
- Replaced the broad shape-help sentence with the measurable “One shape mark
  appears for each completed motion.” Registered `shape-amount`; its sole test
  completes seven claps and verifies exactly seven numbered marks in the
  labelled result.
- `.factory/claims.json` now has 11 entries. Each ID occurs in exactly one
  `@claim:<id>` Playwright test.

The researched brief, static-web deployment class, notebook visual system,
demo isolation, keyboard flow, storage recovery, offline behavior, and all
previously passing product behavior remain intact.

## Verification evidence

Run from a clean dependency install on 2026-08-28:

```sh
npm ci
# Every command in .factory/claims.json, individually
npm test -- --grep @claim:<id>
npm run typecheck
npm run lint
npm test
npm run build
git diff --check
```

- `npm ci`: passed, 25 packages audited, 0 vulnerabilities.
- All 11 registered claim commands passed individually: `demo-isolated`,
  `keyboard`, `local-game`, `seeded-demo`, `shape-amount`, `offline-demo`,
  `free-to-play`, `no-online-features`, `no-personal-details`,
  `no-remote-resources`, and `release-updates`.
- Full Playwright suite: **21/21 passed**. This covers normal, empty, boundary,
  malformed-storage, storage-write failure, storage-delete failure, desktop,
  390 × 844 mobile, 200% text, Enter/Space keyboard operation, route focus,
  reduced motion, offline reload, service-worker cache updates, privacy, and
  Static Web Apps response configuration.
- `npm run typecheck`, `npm run lint`, `npm run build`, and `git diff --check`
  passed. `dist/index.html` is present.
- Live browser audit evidence is in `.factory/evidence/qa-live.json`. At 1440 ×
  900, `/`, `/demo`, `/game`, `/privacy`, and `/terms` each returned 200 with
  one h1, one main, no external requests, no page/console errors, and zero Axe
  violations. The live real-game round remained visible after reload.
- At 390 × 844, document width equalled the 390 px viewport, every measured
  target was at least 44 px, and Axe found zero serious/critical violations.
  At 200% text, width remained 390 px and the heading and primary game action
  remained visible. Screenshots are in `.factory/evidence/live-mobile-demo.png`
  and `.factory/evidence/live-mobile-demo-text-200.png`.
- Keyboard evidence shows 4 px visible focus, number 5 retaining focus after
  Enter, Space completing the round, and route/back navigation focusing the
  new h1. Reduced motion reports `animation-name: none`.
- Privacy evidence found zero cross-origin runtime requests through the full
  flow. No analytics, tracker, account, payment, camera, or remote resource is
  present.
- Offline reload passed from cache `number-motion-duet-43e7f7a06169`; the
  generated update test also proved old product-only caches are removed and a
  precache content change creates a new cache ID.
- Live Lighthouse evidence is
  `.factory/evidence/repair-3-lighthouse-home.json`: Performance **100**,
  Accessibility **100**, Best Practices **100**, SEO **100**; FCP 0.8 s, LCP
  1.2 s, TBT 20 ms, CLS 0, total transfer 79 KiB.
- Production sizes: JavaScript 12,251 B (4,671 B gzip), CSS 9,195 B (2,897 B
  gzip), hero WebP 72,008 B. All static budgets pass.

Package/consumer, API rate-limit, payment, and identity-provider tests do not
apply: this artifact is a browser-only static product with no public package,
backend, billing, or sign-in surface.

## Deployment

Pushed repair commit `86c85a6c2f51eb2139b89af4356067dcc185b674`
to `origin/main`, then deployed `dist/` to the configured production Azure
Static Web App `sf-number-motion-duet` in resource group `sociobot`:

```sh
swa deploy ./dist --env production --app-name sf-number-motion-duet --resource-group sociobot
```

Azure reports the `default` environment as `Ready` at
`https://thankful-grass-04fd20a10.7.azurestaticapps.net`. The custom production
URL is `https://number-motion-duet.sociobot.in`.

- `/`, `/demo`, `/game`, `/privacy`, and `/terms` return 200. A deliberate
  missing route returns the styled 404 with HTTP 404.
- Root responses include HSTS, the same-origin CSP,
  `X-Content-Type-Options: nosniff`, and
  `Referrer-Policy: strict-origin-when-cross-origin`. Hashed assets use
  `public, max-age=31536000, immutable`.
- Local and live SHA-256 values match exactly:
  - `index.html`: `7101a615049d768316295ffa525cdd3d285571489b7cc87d5b31ed1721c6f467`
  - `sw.js`: `6b61e53568290460d3b879f64ad602e4c2195ee541a3e0f17409b9a9473be9c3`
  - `assets/index-BNUziDtJ.js`: `fbc37d38d1b896785c2c7c964bbec30470037f9f0cef505951a2d8818cb0111e`
  - `assets/style-rXKT0Oem.css`: `dea82bd8b1125db2ae00dc2c200805d0f515bb89b85d1aacc7bf4afd28d9ccfd`
  - `assets/notebook-hero-CdjKL61a.webp`: `d4b9af8cd4662e37868b09277d3d0721e3e809250c8be984ecce9279b2fe5d1e`

## Known gaps

No release-blocking gaps remain. If browser storage is disabled or full, the
current visit remains playable in memory but cannot survive a reload; the UI
announces that limit.
