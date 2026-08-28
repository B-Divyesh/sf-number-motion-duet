# Polish 1 — cumulative finding closure

**Base candidate:** `ca10fa5145f0e994f15e648bfafdbe6490965776`  
**Work order:** `number-motion-duet-polish-1`

The requested review object `da702d83f92946a09335fd0ef3ded5518b713f33`
is not present in the supplied Git object database after `git fetch origin`.
This closure maps every concrete finding in the earlier verifier records that are
present in this checkout (`.factory/verification.md`, `verification-2.md`,
`verification-3.md`, and `verification-4.md`) and the additional controller
requirements in this work order.

| Finding | Change made | Evidence |
| --- | --- | --- |
| Demo rounds appeared in a real game; isolation test was a false positive | Real and demo storage use separate namespaces; real play starts empty; the demo banner offers reset and a separate real game. | `@claim:demo-isolated`; `.factory/evidence/verification-4-live-cold-desktop.png`; live `/demo` and `/game` check after deployment. |
| Sample try-out was not directly testable by query URL | `?demo=1` is a first-class demo route and the seeded-demo claim now tests it as well as the landing action. | `@claim:seeded-demo`; live `/?demo=1` check after deployment. |
| First screen used abstract wording | Rewrote the H1 to “Practice numbers with claps and steps”; it says the job in six words and keeps the caregiver/preschooler context and one-click demo action. | `tests/app.spec.ts` first-read flow; screenshot/live root check after deployment. |
| Demo/header/footer controls were too small for touch | All navigation, footer, skip, and demo controls have at least 44 px targets. | `mobile navigation and footer links meet the 44px touch-target baseline`; `.factory/evidence/verification-4-live-cold-mobile.png`; live 390 px check after deployment. |
| Service-worker updates could stay stale | Production assets are content-hashed and the generated service worker derives and cleans a product-only cache ID. | `@claim:release-updates`; `production service worker gets a new cache ID when a precached shell file changes`. |
| Corrupt storage and singular motion wording failed | Stored state is validated/reset with recovery feedback; `1 clap` and `1 step` are singular. | `recovers safely from damaged saved state and uses singular motion words`; live `/game` storage-recovery check after deployment. |
| Static 404 was not a true full page | Static Web Apps uses a 404 response override with a styled page, header navigation, legal links, Param Factory footer, and version. | `Static Web Apps has a real styled 404 response override`; live missing-route check after deployment. |
| Visitor claims were unregistered or did not prove outcomes | `.factory/claims.json` has 11 claim IDs, each with one exact tagged Playwright command. Isolation, seed, persistence, shape count, offline, privacy, payment, and release behavior all assert observable outcomes. | Every command in `.factory/claims.json`, run individually from the clean clone; `npm test`. |
| Storage write/delete errors stopped play or hid feedback | In-memory fallback keeps the current round visible; reset and start-real recover without throwing and explain what happened. | `storage write failures keep the completed round visible and explain recovery`; `storage delete failures never block demo reset or starting a separate real game`. |
| Keyboard selection discarded focus | Rendering restores focus to the selected motion/quantity control. | `@claim:keyboard`; live keyboard check after deployment. |
| 200% text overflowed on a phone | Game and header layouts stack/reflow without horizontal overflow at 390 px and 200% text. | `fits a 390px phone at default and 200% text size without console errors`; `.factory/evidence/live-mobile-demo-text-200.png`. |
| Non-home canonical metadata was incorrect | Canonical URLs are route-aware. This polish also makes route descriptions, Open Graph title/description/URL, and Twitter title/description update with client navigation. | `updates titles, descriptions, social metadata, and canonicals for real app URLs`; live `/demo`, `/privacy`, and `/terms` checks after deployment. |
| Sitemap missed `/game`; static 404 skeleton lacked legal/footer links | Sitemap lists `/game`; the static 404 includes the standard product navigation and footer. | `Static Web Apps has a real styled 404 response override`; live `/sitemap.xml` and missing-route checks after deployment. |
| Catalog description was absent or not in the required form | Added the verb-first 47-character description: “Practice numbers together with claps and steps.” | `.factory/catalog-description.txt`; file-length check. |

## Local evidence before deployment

`npm ci` completed with 0 vulnerabilities. `npm run typecheck`, `npm run lint`,
and `npm run build` passed. `npm test` passed 21/21. Every exact claim command
in `.factory/claims.json` was then run separately and passed.

## Deployed cold recheck

The static deployment completed as `db7bb30b-4029-49b9-a359-be16770c238b` and
the live site byte-matches the local production build. The current live evidence
is `.factory/evidence/qa-live.json` and the cold root screenshots are
`.factory/evidence/polish-1-verify-url/screenshot-desktop.png` and
`.factory/evidence/polish-1-verify-url/screenshot-mobile.png`.

Cold checks at <https://number-motion-duet.sociobot.in> confirmed the revised
first screen, the one-click `/demo` route, direct `?demo=1` banner/reset path,
all legal links, dynamic Privacy metadata/focus, sitemap routes, and an HTTP
404 for a missing URL. The live Playwright Axe scan has no violations; the
standalone Axe CLI was attempted but cannot discover a Chrome binary in this
container, so the checked-in Playwright Axe integration is the repeatable CLI
alternative.
