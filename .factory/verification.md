# Independent verification — FAIL

**Candidate:** `f34f2f58e9dcc58de9391c0ee742dfdee02fd19c` (`build cooperative number motion game`)  
**Live URL:** https://number-motion-duet.sociobot.in  
**Date:** 2026-08-28  
**Verifier scope:** independent, read-only product QA. Product source was not changed.

## Verdict

**FAIL — do not release this candidate.** The demo sandbox is not isolated in the observable product experience: a fresh real game, and a game reached with **Start for real**, show the two demo rounds as if they were real history. On the first confirmation those samples are then saved into the real-game storage namespace. This directly contradicts the user-facing demo promise and the `demo-isolated` claim.

The listed claim test passes only because it checks that the demo storage key is deleted; it never verifies that the real UI is empty. That is not an observable assertion of “Demo sample rounds stay separate from a real game,” as required by the claims contract.

## Required claim runs first

`.factory/claims.json` exists and contains four claims. From the clean checkout, after `npm ci`, I ran each exact command against the product's Playwright demo entry point.

| Claim | Exact command | Result | Evidence |
| --- | --- | --- | --- |
| `demo-isolated` | `npm test -- --grep @claim:demo-isolated` | PASS | 1 Playwright test passed (709 ms) |
| `keyboard` | `npm test -- --grep @claim:keyboard` | PASS | 1 Playwright test passed (545 ms) |
| `local-game` | `npm test -- --grep @claim:local-game` | PASS | 1 Playwright test passed (559 ms) |
| `offline-demo` | `npm test -- --grep @claim:offline-demo` | **FAIL, then PASS on rerun** | Initial exact run failed at `tests/app.spec.ts:41` with `page.goto: net::ERR_CONNECTION_REFUSED` for `http://127.0.0.1:4173/demo`; a subsequent standalone rerun passed (1.1 s). |

The initial failing claim invocation is itself release-blocking under the work order. The later full suite passed, so this appears to be an unreliable local web-server startup/reuse condition rather than evidence that the live offline flow is broken. It still means the required claim gate did not pass cleanly on first execution.

## Reproduced functional failure

Fresh browser contexts were used on the live deployment.

1. Open `https://number-motion-duet.sociobot.in/game` with no local storage. The page has no demo banner yet **Today’s marks** contains `3 steps` and `2 claps` (`roundCount: 2`).
2. Open `/demo`, complete a sample round, choose **Start for real**. `/game` again has no banner and still displays those same two rounds (`roundCount: 2`).
3. Source confirmation: `readSession()` returns `sampleSession()` for both demo and real games whenever no saved value exists. Confirming a real round pushes into that sample array and writes it to `number-motion-duet:session`.

Expected: a real game starts with zero completed rounds and the empty-state message; no sample round may enter real storage.

## Findings

### High — demo samples appear and persist in real games

**Affected:** `/game`, and Demo → **Start for real**.  
**Evidence:** fresh real game and post-demo real game both exposed two sample rounds, despite `localStorage` containing no `number-motion-duet:session` before confirmation. See reproduction above; live deployed `main.js` hashes identically to the candidate build.  
**Impact:** caregiver can mistake sample activity for their own history; the stated demo boundary is false; a subsequent real confirmation persists demo samples in the real namespace.  
**Fix:** make the non-demo empty session `{ motion: 'claps', count: 1 (or another intentional initial count), rounds: [], confirmed: false }`; reserve `sampleSession()` strictly for demo mode; extend the claim test to assert zero real rounds/empty state after leaving demo and after a direct fresh `/game` visit.

### High — the `demo-isolated` claim test does not prove its claim

**Affected:** `.factory/claims.json`, `tests/app.spec.ts`.  
**Evidence:** `@claim:demo-isolated` passes while the live UI disproves the claim. Its final assertion checks only that both storage keys are null.  
**Impact:** the required sandbox claim gate produces a false positive for the product’s core privacy/isolation promise.  
**Fix:** assert the real game's observable round log is empty and no demo rounds are persisted after real play.

### Medium — mobile navigation and footer links miss the 44 px touch-target baseline

**Affected:** 390 × 844 live `/game`.  
**Evidence:** measured link boxes: header Demo `40 × 16`, Play `32 × 16`, Privacy `49 × 16`; footer Privacy `52 × 16`, Terms `42 × 16`, and Built by Param Factory `162 × 16`. The wordmark is `198 × 28`; skip link is `165 × 39`.  
**Impact:** links are unnecessarily difficult to activate for touch users.  
**Fix:** give header/footer/wordmark/skip links at least 44 px minimum block size and adequate padding without reducing adjacent spacing.

### Medium — offline service-worker updates can be held stale indefinitely

**Affected:** `public/sw.js`, asset caching policy.  
**Evidence:** the service worker cache name is fixed at `number-motion-duet-v1`; it precaches fixed URLs such as `/assets/main.js` and `/assets/main.css`. The deployment applies `Cache-Control: public, max-age=31536000, immutable` to these same non-hashed filenames.  
**Impact:** a later release can retain old JS/CSS and its old shell for existing visitors, despite the claimed offline support.  
**Fix:** hash asset filenames and version/clear the service-worker cache per build, then test an old controlled client updating to a new service worker.

### Low — corrupted stored state is accepted without validation, and singular copy is wrong

**Affected:** persisted local session recovery and the value `1`.  
**Evidence:** an injected saved value `{ "motion": "x", "count": 0, "rounds": [], "confirmed": false }` renders `Call 0 steps`, has no selected number, and permits `We did 0 steps`. A malformed JSON value recovers but reports “could not save,” which is not what happened. A valid boundary value renders `Call 1 claps` and `✓ 1 claps marked with shapes.`  
**Impact:** a damaged browser state can make the game nonsensical; wording is poor in a preschool-facing activity.  
**Fix:** validate/clamp deserialized sessions and reset invalid state with an accurate recovery message; singularize `clap` and `step`.

### Low — configured 404 is a client-side 200 fallback, not a real 404 response

**Affected:** `/not-a-real-route`, `staticwebapp.config.json`.  
**Evidence:** a non-existent route returns HTTP 200 and `index.html`; configuration has no `responseOverrides["404"]` entry. The client does render a useful styled not-found screen after JavaScript loads.  
**Fix:** add the Static Web Apps 404 response override/route described by the product contract while retaining the designed fallback UI.

## Checks that passed

- **First-read cold live page:** The first screen plainly says it is a “shared clap or step game” for “caregivers and preschoolers,” and has a visible one-click **Try it with sample data** link with the explanation “Starts a ready-made clap round.” It passes the first-read and demo-entry requirements.
- **Live/candidate identity:** SHA-256 values match for `index.html`, `assets/main.js`, `assets/main.css`, and `sw.js`. The live deployment is this candidate’s build, not an earlier deployment.
- **Repository validation:** `npm test` passed all 7 tests; `npx tsc --noEmit` passed; `npm run build` passed and produced `dist/`. No lint script exists. Build artifacts: JS 4,098 B gzip, CSS 2,802 B gzip, hero WebP 72,008 B, all inside the stated budgets.
- **Normal and boundary play:** live demo selected/confirmed 1 and 10 claps correctly, producing 1 and 10 shape marks. Demo reset, motion change, and real-route navigation work.
- **Keyboard and focus:** Tab order reaches skip link, navigation, demo controls, motion controls, and all quantity buttons; Enter on a tabbed-to `5` changes the confirm button to **We did 5 claps**. Focus styling is present. No keyboard trap observed.
- **Mobile and reduced motion:** 390 px live `/game` had `scrollWidth === innerWidth === 390`; reduced-motion mode applied; only the touch-target issue above failed.
- **Accessibility:** the shipped Playwright axe integration passed locally; a fresh live axe scan of `/game` returned zero serious or critical findings. Semantic title/lang/main/h1, skip link, landmarks, alt text, focus styling, and route titles were present. No `verify-url.sh` exists in this repository, so equivalent checks were performed manually and via Playwright.
- **Privacy/network:** no account or sign-in; no API endpoints; no third-party requests during landing/demo/game flow; no analytics observed. The static product has no server-side endpoint, so rate-limit/sign-in checks are not applicable. The real-game data bug above is a demo-boundary issue, not an outbound data transfer.
- **Offline current release:** after first live demo visit and service-worker readiness, offline reload of `/demo` displayed the game heading and **Offline. This game still works here.** Cache contained the shell, JS, CSS, hero, icons, and `/demo`.
- **Console/errors:** no console errors or page errors observed in cold landing, demo, game, offline, desktop, or 390 px checks.
- **Headers and links:** HTTPS pages returned HSTS, CSP restricted to `'self'`, `X-Content-Type-Options: nosniff`, and strict-origin referrer policy. Static JS/CSS/image assets have one-year immutable cache headers; shell and service worker use 30-second revalidation. `/`, `/demo`, `/game`, `/privacy`, `/terms`, and the external factory footer destination returned 200.

## Commands used

```sh
npm ci
npm test -- --grep @claim:demo-isolated
npm test -- --grep @claim:keyboard
npm test -- --grep @claim:local-game
npm test -- --grep @claim:offline-demo
npm test
npx tsc --noEmit
npm run build
```

Live browser checks used Playwright 1.58.2 and `@axe-core/playwright` 4.11.0 in fresh contexts. HTTP and deployment identity checks used `curl` and SHA-256 comparisons of the live files against `dist/`.
