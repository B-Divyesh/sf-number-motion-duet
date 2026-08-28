# Polish 3 — zero-finding release closure

**Base candidate:** `08a27f783d0e863c7966a10085b6111238b9632a`  
**Repair commit:** `3b562bcbe7afd71225d5465c9dbbb2e686ee276c`  
**Live URL:** <https://number-motion-duet.sociobot.in>

Every concrete issue in `.factory/review-3.md`, all earlier
`.factory/review-*.md` records, and all earlier verification records was
rechecked. There are no deferred minor items.

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 | On phone widths the hero copy and three facts now come before the illustration. The compact fact list needs less vertical space. | Browser test `shows the complete first-screen action and facts on a 390px phone`; live [`polish-3-live-first-screen-mobile.png`](evidence/polish-3-live-first-screen-mobile.png); live report records all five required items between 212 px and 580 px of an 844 px viewport. |
| F-3-2 | New navigation saves the leaving scroll position, moves immediately to top, then focuses the incoming H1. Popstate restores the saved scroll position. | Browser test `forward footer navigation brings the destination heading into view`; live `qa-live.json` records `scrollY: 0`, H1 top `199.1875`, and preserved home scroll `1375`. |
| F-3-3 | Both the SPA fallback and the deployed static 404 now use the literal H1 “Page not found.” while keeping the notebook treatment and home action. | Browser test `Static Web Apps has a real styled 404 response override`; live `/not-a-real-page` returned HTTP 404 with that sole H1, zero Axe violations, and no page errors in `qa-live.json`. |
| F-3-4 | Removed “The adult stays part of the loop.” rather than keeping an untestable participation promise. | `.factory/copy-audit.md`; live root text in `qa-live.json`; [`polish-3-verify-url/screenshot-desktop.png`](evidence/polish-3-verify-url/screenshot-desktop.png). |

## Earlier review findings

| Finding | Change retained and rechecked | Evidence |
| --- | --- | --- |
| F-2-1 | README test instructions remain two short plain sentences. | `npm test` 24 passed; `.factory/copy-audit.md`. |
| F-2-2 | README describes safe installed-copy updates without cache jargon. | `@claim:release-updates`; generated `dist/sw.js`; live offline cache in `qa-live.json`. |
| F-2-3 | README says completed rounds stay in “this browser.” | `@claim:local-game`; live real-round reload in `qa-live.json`. |
| F-2-4 | README keeps sample rounds separate from real games without exposing a key. | `@claim:demo-isolated`; live `/demo` → `/game` boundary in `qa-live.json`. |
| F-2-5 | The landing H2 remains “Turn a number into claps or steps.” | Browser test `uses direct wording for the landing job and turn-taking instructions`; live root check in `qa-live.json`. |

## Earlier verifier findings

| Finding from the record | Change retained and rechecked | Evidence |
| --- | --- | --- |
| Demo samples appeared in real games | Demo and real sessions use separate namespaces; real play starts empty. | `@claim:demo-isolated`; live `realAfterDemo` and `persistedReal` in `qa-live.json`. |
| `demo-isolated` was a false-positive test | The tagged test observes both empty real UI and real-only storage after leaving demo. | Clean-clone `npm test -- --grep @claim:demo-isolated` passed. |
| Sample path was not direct or isolated | `/demo` and `?demo=1` open the seeded, bannered sample with reset and Start for real controls. | `@claim:seeded-demo`; live `demoQuery` in `qa-live.json`. |
| First-screen copy was abstract | Direct job H1, audience line, result-named action, and three facts remain on the first screen. | First-read browser test; live mobile screenshot and `polish3.firstScreen` report. |
| Header, footer, and demo controls were under 44 px | All remain at least 44 px. | `mobile navigation and footer links meet the 44px touch-target baseline`; live `mobile.tooSmall: []`. |
| Service-worker files could remain stale | Content-hashed assets and build-derived, cleaned product cache remain in place. | `@claim:release-updates`; live cache ID and hashed asset list in `qa-live.json`. |
| Corrupt storage and singular wording failed | Validation resets damaged storage; singular clap and step labels remain correct. | `recovers safely from damaged saved state and uses singular motion words`; live `corruptStorage` report. |
| Static 404 was a 200 fallback | Static Web Apps response override returns the styled 404 with standard navigation and legal footer. | Static-404 browser test; live `/not-a-real-page` HTTP 404 check. |
| Visitor claims were unregistered | Eleven listed visitor claims each have exactly one tagged observable test. | Claim-tag count check; all 11 exact commands passed from clean clone. |
| Storage write or delete failures stopped play | In-memory fallback and reset/start-real recovery messages remain usable. | Storage-failure browser tests; live `storageWriteFailure` and `storageDeleteFailure` report. |
| Keyboard selection lost focus | The selected motion or number restores focus after render. | `@claim:keyboard`; live `keyboard.focusAfterSelection`. |
| 200% phone text overflowed | The game reflows at 390 px without horizontal scrolling. | Responsive browser test; live `mobile.text200.scrollWidth: 390`. |
| Non-home titles, metadata, canonical, and focus were wrong | Routes retain route-specific metadata and announce/focus incoming H1s. | Metadata browser test; live route report and `polish3.forwardRoute`. |
| Sitemap, legal links, and 404 skeleton were incomplete | Sitemap includes `/game`; the static 404 includes navigation, Privacy, Terms, factory attribution, and version. | Static-404 browser test; live `/sitemap.xml` and 404 route checks. |
| Catalog description was absent or nonconforming | Updated to “Practice preschool numbers with shared claps and steps.” | `.factory/catalog-description.txt` is 55 characters, verb-first, and contains no marketing terms. |

## Verification and deployment evidence

- Clean clone `/tmp/number-motion-duet-clean-9CrJWy`: `npm ci` reported 0 vulnerabilities; every exact command in `.factory/claims.json` passed individually; `npm run typecheck`, `npm run lint`, `npm run build`, and `npm test` passed (24 tests).
- The production build is 13.77 kB JavaScript (5.05 kB gzip), 9.23 kB CSS (2.89 kB gzip), and 72.01 kB original WebP art.
- `swa deploy ./dist --env production --app-name sf-number-motion-duet` published the production build. Live root serves `index-Cj94H9rf.js` and `style-B_8tNubC.css`.
- Final local/live SHA-256 pairs byte-match: `index.html` `9079318e…28a85ec5`, `assets/index-Cj94H9rf.js` `2c0081da…c66c5b48`, `assets/style-B_8tNubC.css` `b4d63137…49a3a470`, and `sw.js` `3d471f86…916f12703`.
- `/opt/fleet/lib/verify-url.sh` passed against the live root. Its desktop/mobile screenshots and report are in [`evidence/polish-3-verify-url`](evidence/polish-3-verify-url).
- The live Playwright + Axe audit in [`evidence/qa-live.json`](evidence/qa-live.json) has zero Axe violations on `/`, `/demo`, `/game`, `/privacy`, `/terms`, and the HTTP 404; it also proves demo isolation, direct `?demo=1`, keyboard flow, storage recovery, 390 px/200% layout, reduced motion, no external requests, and offline reload.
- Live Lighthouse mobile scores are Performance 100, Accessibility 100, Best Practices 100, and SEO 100; FCP 0.8 s, LCP 1.2 s, CLS 0, TBT 0 ms. See [`evidence/polish-3-lighthouse-home.json`](evidence/polish-3-lighthouse-home.json).
