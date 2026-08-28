# Polish 4 — complete finding closure

**Base review:** `a2f7a1325bed7a740e7d8cda94765c2c7d06c131`  
**Repair commit:** `cb91b2f` (`fix static 404 metadata coverage`)  
**Live URL:** <https://number-motion-duet.sociobot.in>

This record closes every numbered finding in the review history and every
earlier descriptive verifier finding. No item is deferred as minor.

## Numbered review findings

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Kept the README test explanation as two short plain sentences. | `.factory/copy-audit.md`; clean-clone `npm test` (24 passed). |
| F-2-2 | Kept the visitor outcome for updates: new file names let installed copies update safely. | `@claim:release-updates`; generated `dist/sw.js`; live offline probe in `.factory/evidence/qa-live.json`. |
| F-2-3 | Kept “Completed rounds stay in this browser.” | `@claim:local-game` reload assertion; live `flow.persistedReal` in `qa-live.json`. |
| F-2-4 | Kept the README explanation free of storage-key jargon while documenting isolation in `.factory/demo.md`. | `@claim:demo-isolated`; live `demoQuery` and `flow.realAfterDemo`. |
| F-2-5 | Kept the literal heading “Turn a number into claps or steps.” | Browser test `uses direct wording for the landing job and turn-taking instructions`; live mobile screenshot `.factory/evidence/polish-4-live-first-screen-mobile.png`. |
| F-3-1 | Kept all three facts above the illustration on a 390 px first screen. | Browser test `shows the complete first-screen action and facts on a 390px phone`; live `.factory/evidence/polish-4-live-first-screen-mobile.png`; `qa-live.json` records every fact visible. |
| F-3-2 | Kept forward navigation at top before focusing the incoming H1; Back restores saved scroll. | Browser test `forward footer navigation brings the destination heading into view`; live `qa-live.json` `polish4.forwardRoute` has `scrollY: 0`. |
| F-3-3 | Kept the literal 404 H1 “Page not found.” in both static and SPA paths. | Browser test `Static Web Apps serves a styled 404 with complete route metadata`; live `.factory/evidence/polish-4-live-404.png`; HTTP 404 in `qa-live.json`. |
| F-3-4 | Kept the untestable adult-participation promise removed. | `.factory/copy-audit.md`; live root text captured in `qa-live.json`. |
| F-4-1 | Added the static 404’s canonical URL, Open Graph type/title/description/URL/image, Twitter card/title/description, and Apple touch icon. The regression now requests a real missing URL through the Static Web Apps emulator. | Browser test `Static Web Apps serves a styled 404 with complete route metadata`; live `GET /not-a-real-page` returned HTTP 404 and all fields in `qa-live.json.routes[5].metadata`; `.factory/evidence/polish-4-live-404.png`. |

## Earlier verifier findings recorded without F-IDs

| Earlier finding | Change retained and rechecked | Evidence |
| --- | --- | --- |
| Demo samples mixed with real play; isolation test was false-positive | Separate `demo:` and real namespaces; Start for real removes sample state and opens an empty game. | `@claim:demo-isolated`; live `/demo` → `/game` `flow.realAfterDemo`. |
| No direct isolated sample path | `/demo` and `?demo=1` open a seeded bannered sample with Reset demo and Start for real. | `@claim:seeded-demo`; live `demoQuery` in `qa-live.json`. |
| First screen was abstract | The direct job H1, audience sentence, visible sample action, and three facts remain. | Browser first-screen test; `.factory/evidence/polish-4-live-first-screen-mobile.png`. |
| Touch controls were under 44 px | Header, banner, game, footer, and skip controls meet the 44 px minimum. | Browser test `mobile navigation and footer links meet the 44px touch-target baseline`; live `mobile.tooSmall: []`. |
| Service worker could remain stale | Content-hashed assets and a build-derived product cache replace only old product caches. | `@claim:release-updates`; live cache record in `qa-live.json.offline`. |
| Corrupt state, singular wording, and storage failures failed | Validation resets bad state; singular labels and in-memory recovery feedback remain usable. | Browser recovery tests; live `corruptStorage`, `storageWriteFailure`, and `storageDeleteFailure`. |
| Missing route was a 200 fallback or incomplete shell | Azure response override serves a styled HTTP 404 with navigation, legal links, factory footer, version, and complete metadata. | Static-404 browser test; live 404 URL check and `.factory/evidence/polish-4-live-404.png`. |
| Claims were absent, unlisted, or did not prove outcomes | `claims.json` lists eleven claims; each has exactly one observable tagged Playwright test. | Every listed command passed individually from `/tmp/number-motion-duet-polish4-D7lJVb`; full suite 24/24. |
| Keyboard focus, 200% mobile text, or route focus failed | Selection restores focus, 390 px / 200% text does not overflow, and route H1 focus stays visible. | `@claim:keyboard`; responsive and forward-navigation tests; live `keyboard`, `mobile`, and `polish4` reports. |
| Non-home metadata/canonicals, sitemap, legal links, or catalog description were incomplete | App routes update metadata; sitemap includes `/game`; legal links work; catalog copy is verb-first and 58 characters. | Metadata browser test; static-404 test; `wc -m .factory/catalog-description.txt`; live route probe. |

## Verification and deployment

- Fresh clone `/tmp/number-motion-duet-polish4-D7lJVb`: `npm ci` reported 0 vulnerabilities; all 11 exact commands in `.factory/claims.json` passed individually; `npm run typecheck`, `npm run lint`, `npm test` (**24/24**), `npm run build`, and `git diff --check` passed.
- Production build: JavaScript **13.77 kB** (**5.05 kB gzip**), CSS **9.23 kB** (**2.89 kB gzip**), original WebP art **72.01 kB**.
- Deployed with `swa deploy ./dist --env production --app-name sf-number-motion-duet`. Azure reported production deployment at <https://thankful-grass-04fd20a10.7.azurestaticapps.net>.
- Cold live Playwright/Axe probe: zero serious/critical or other Axe violations on `/`, `/demo`, `/game`, `/privacy`, `/terms`, and the HTTP 404; no external requests, console errors, or page errors on app routes. See `.factory/evidence/qa-live.json`.
- `/opt/fleet/lib/verify-url.sh` passed on the live root. Output and screenshots: `.factory/evidence/polish-4-verify-url/`.
- Live mobile Lighthouse: Performance **98**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP **0.9 s**, LCP **1.3 s**, TBT **180 ms**, CLS **0**, transfer **79 KiB**. See `.factory/evidence/polish-4-lighthouse-home.json`.
- Local/live SHA-256 pairs match: `index.html` `9079318efc573113850dd9d31a6f8081d89abfa20e61e993545fabaa28a85ec5`; `404.html` `f78498c5ba31f19ac884f420048167aa5427d64ced8681da3ca722d6c18e7468`.
