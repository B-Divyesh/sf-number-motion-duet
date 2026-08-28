# Number Motion Duet verification handoff

## Result — FAIL

Independent verification of candidate
`46d9212159b667c10bac6b5ac40043449e500cd9` at
<https://number-motion-duet.sociobot.in> **FAILS release**. See
`.factory/verification-3.md` for complete evidence.

The deployed product is otherwise healthy and exactly matches the candidate.
The release blocker is claims-contract coverage: the sole `local-game` claim
test does not reload or otherwise prove the persistence it promises, and the
visible “Starts a ready-made clap round” behavior has no claims entry/test.
Product code was not changed during verification.

### Repairs

1. Added five missing visitor claims to `.factory/claims.json`. The registry
   now has nine claims and each has exactly one matching `@claim:` Playwright
   test. The README no longer makes the untestable generated-art originality
   claim.
2. Made browser storage failures recoverable. Failed writes retain an isolated
   in-memory session for the current visit, show a status message, and still
   mark the round. Failed demo reset/delete operations no longer throw or block
   **Start for real**; the real game remains separate and the player is told
   what happened.
3. Raised the two demo controls to at least 44 by 44 CSS px.
4. Restored keyboard focus to the selected motion or number after the app
   re-renders, so keyboard play continues from the selected control.
5. Fixed 390 px / 200% text reflow by allowing the compact header to wrap,
   using shrinkable quantity tracks, wrapping game-header content, and fixing
   the mobile shell width expression. No content exceeds the viewport.
6. Set the canonical link to the current SPA route, added `/game` to the
   sitemap, and gave the static 404 the standard navigation and footer.

## Verification

All commands were run from a clean lockfile install on 2026-08-28:

```sh
npm ci
npm run lint
npm test
npm run build
git diff --check
```

- `npm ci`: passed; 0 vulnerabilities.
- `npm run lint`: passed (`tsc --noEmit`).
- `npm test`: passed, **19/19** Playwright tests.
- `npm run build`: passed and created `dist/index.html`.
- `git diff --check`: passed.
- Every exact registered claim command passed:
  `demo-isolated`, `keyboard`, `local-game`, `offline-demo`, `free-to-play`,
  `no-online-features`, `no-personal-details`, `no-remote-resources`, and
  `release-updates`.
- Browser coverage includes desktop, 390 × 844 mobile, 200% text size, keyboard
  Enter/Space activation and post-selection focus, browser-storage write/delete
  failures, demo reset/exit, offline reload, and service-worker cache updates.
- Playwright Axe found **zero serious or critical violations** on `/`, `/demo`,
  `/game`, `/privacy`, `/terms`, and `/404.html`. The test also checks semantic
  route output, visible focus behavior, 44 px mobile targets, and no console
  errors in the mobile flow.
- Privacy regressions record the whole demo flow and assert same-origin runtime
  requests only; no form, account, payment, remote script, stylesheet, media,
  score, or camera surface is present.
- Static response policy is retained in `dist/staticwebapp.config.json`: the
  same-origin CSP, `nosniff`, strict referrer policy, immutable hashed assets,
  explicit SPA route rewrites, and a real 404 response override.
- Fresh live mobile Lighthouse: **99 performance, 100 accessibility, 100 best
  practices, 100 SEO**. FCP 0.9 s, LCP 1.3 s, TBT 130 ms, CLS 0.
- Build output is within the static budget: JS 12.27 KB (4.66 KB gzip), CSS
  9.20 KB (2.88 KB gzip), and hero WebP 72.01 KB.

This static product has no server API, sign-in authority, paid tier, package,
or CLI surface; backend rate-limit, live identity-provider, and consumer-package
checks do not apply.

## Run locally

```sh
npm ci
npm run dev
npm test
npm run build
```

Open `/demo` for the isolated sample. The production deployment target remains
the static `dist/` directory for Azure Static Web Apps.

## Deployment

Deployed `dist/` to Azure Static Web Apps on 2026-08-28:

- URL: `https://number-motion-duet.sociobot.in`
- Azure deployment ID: `45415cd4-14c7-4d77-9651-7bf48aa835e7`
- The live `/`, `/demo`, `/game`, `/privacy`, and `/terms` return 200; a
  deliberate missing URL returns 404.
- Local and live SHA-256 values match exactly for `index.html`, the hashed JS,
  hashed CSS, hero WebP, and `sw.js`. The deployed JS is
  `assets/index-DGGN94E8.js`; CSS is `assets/style-rXKT0Oem.css`.
- Live root headers include HSTS, `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and the configured
  same-origin CSP. The hashed JS is served with one-year immutable caching.
- A live 390 px browser audit found no console errors or serious/critical Axe
  violations across all app routes and the HTTP 404; each app route has one
  main landmark and one h1. The live `/demo` canonical is `/demo`, both demo
  controls are 44 px high, number five retains focus after Enter, and 200% text
  remains at a 390 px document width with no off-screen content.

## Known gaps / required next step

Before release, add a `local-game` tagged assertion that verifies a completed
round persists after reload, then register and test the ready-made sample-round
claim (or remove that action note). Review the remaining shape-amount copy
under the same claims rule. If browser storage is disabled or full, a current
visit remains playable in memory but cannot survive a reload; the UI correctly
announces this limit.
