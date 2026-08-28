# Polish 2 — zero-finding closure

**Base candidate:** `c0b73cdf3e50fdd53e7cd8bf5255c1b948b6b660`  
**Repair commit:** `627a39f1b283b1d97b62f6948fe54c0063017f26`  
**Live URL:** <https://number-motion-duet.sociobot.in>

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Replaced the 31-word test sentence with two plain sentences. The longest is 14 words. | `npm test` 22/22; `.factory/copy-audit.md`; [live README](https://github.com/B-Divyesh/sf-number-motion-duet/blob/main/README.md). |
| F-2-2 | Replaced service-worker implementation jargon with “Each release uses new file names, so installed copies can update safely.” | `npm test -- --grep @claim:release-updates`; `.factory/evidence/lighthouse-polish-2-home.json`; live release uses the new `index-ZUKjn4_B.js` asset. |
| F-2-3 | Replaced “browser storage” with “Completed rounds stay in this browser.” | `npm test -- --grep @claim:local-game`; `.factory/evidence/qa-live.json`; [live /game](https://number-motion-duet.sociobot.in/game) persisted one real round locally. |
| F-2-4 | Replaced the storage-key detail with “Sample rounds stay separate from real games.” The key remains only in verifier documentation. | `npm test -- --grep @claim:demo-isolated`; `.factory/evidence/qa-live.json`; [live /?demo=1](https://number-motion-duet.sociobot.in/?demo=1) reset and Start for real paths passed. |
| F-2-5 | Replaced the abstract H2 with “Turn a number into claps or steps,” and added a direct browser regression test. | `uses direct wording for the landing job and turn-taking instructions`; `.factory/evidence/polish-2-cold-home-desktop.png`; [live home](https://number-motion-duet.sociobot.in/) cold check passed. |

## Earlier findings retained by the review record

The earlier records use descriptive labels rather than `F-*` IDs. Each remains
closed and was rechecked on the deployed site.

| Earlier finding | Change retained | Evidence |
| --- | --- | --- |
| Demo samples appeared in real games | Separate demo and real namespaces; Start for real discards the demo. | `@claim:demo-isolated`; `.factory/evidence/qa-live.json`; [live /demo](https://number-motion-duet.sociobot.in/demo) → [live /game](https://number-motion-duet.sociobot.in/game). |
| Demo query path was not isolated | `?demo=1` enters the same seeded sandbox with banner and reset controls. | `@claim:seeded-demo`; `.factory/evidence/polish-2-cold-home-mobile.png`; [live /?demo=1](https://number-motion-duet.sociobot.in/?demo=1). |
| First screen was abstract | The H1, audience sentence, and result-named sample action remain direct. | `uses direct wording for the landing job and turn-taking instructions`; `.factory/evidence/polish-2-cold-home-mobile.png`; [live home](https://number-motion-duet.sociobot.in/). |
| Controls were under 44 px | Header, banner, game, and footer targets remain at least 44 px. | `mobile navigation and footer links meet the 44px touch-target baseline`; `.factory/evidence/qa-live.json`; [live /demo](https://number-motion-duet.sociobot.in/demo). |
| Service worker could remain stale | Hashed assets and product-only cache replacement remain in place. | `@claim:release-updates`; `.factory/evidence/qa-live.json`; [live /demo](https://number-motion-duet.sociobot.in/demo) offline reload passed. |
| Corrupt state and singular wording failed | Validation resets bad state and singular labels remain correct. | `recovers safely from damaged saved state and uses singular motion words`; `.factory/evidence/qa-live.json`; [live /game](https://number-motion-duet.sociobot.in/game). |
| Static 404 was a fallback | Static Web Apps returns a styled, legal-linked HTTP 404. | `Static Web Apps has a real styled 404 response override`; `.factory/evidence/polish-2-cold-home-desktop.png`; [live missing page](https://number-motion-duet.sociobot.in/not-a-real-page) returned 404. |
| Claims were unregistered | All 11 entries remain in `.factory/claims.json`, each with one exact test. | Every `@claim:*` command in the clean clone; `.factory/evidence/qa-live.json`; [live home](https://number-motion-duet.sociobot.in/). |
| Storage failures blocked play | In-memory recovery and explanatory feedback remain usable. | Storage write/delete recovery tests in `npm test`; `.factory/evidence/qa-live.json`; [live /game](https://number-motion-duet.sociobot.in/game). |
| Keyboard selection lost focus | Selection restores focus; route changes focus the incoming H1. | `@claim:keyboard`; `.factory/evidence/qa-live.json`; [live /demo](https://number-motion-duet.sociobot.in/demo). |
| 200% text overflowed on mobile | 390 px at 200% text remains within the viewport. | `fits a 390px phone at default and 200% text size without console errors`; `.factory/evidence/qa-live.json`; [live /demo](https://number-motion-duet.sociobot.in/demo). |
| Non-home metadata was wrong | Route-aware titles, descriptions, social tags, canonicals, and focus behavior remain active. | `updates titles, descriptions, social metadata, and canonicals for real app URLs`; `.factory/evidence/qa-live.json`; [live /privacy](https://number-motion-duet.sociobot.in/privacy). |
| Sitemap and static 404 skeleton were incomplete | `/game` remains in the sitemap; 404 has navigation, legal links, and factory footer. | `Static Web Apps has a real styled 404 response override`; `.factory/evidence/qa-live.json`; [live sitemap](https://number-motion-duet.sociobot.in/sitemap.xml). |
| Catalog description was nonconforming | `catalog-description.txt` remains verb-first and 47 characters. | `wc -m .factory/catalog-description.txt`; `.factory/evidence/polish-2-cold-home-desktop.png`; [live home](https://number-motion-duet.sociobot.in/). |

## Final deployment check

`swa deploy ./dist --env production` deployed the built `dist/` directory to
`sf-number-motion-duet`. A fresh live audit ran after deployment: all five app
routes were 200 with zero Axe violations, zero external requests, and zero
console/page errors. The demo flow, storage boundary, offline reload, keyboard
flow, responsive layout, reduced motion, and true 404 all passed. Mobile
Lighthouse scored 100 performance, 100 accessibility, 100 best practices, and
100 SEO.
