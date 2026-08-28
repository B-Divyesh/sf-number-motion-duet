# Adversarial first-read review 3 — FAIL

**Reviewed URL:** <https://number-motion-duet.sociobot.in>  
**Reviewed commit:** `08a27f783d0e863c7966a10085b6111238b9632a`  
**Date:** 2026-08-28  
**Scope:** Fresh live browser contexts at 390 × 844 and 1440 × 900, clean-clone claim commands, live accessibility/network/offline checks, source inspection, and all prior review/polish/handoff records. Product code was not changed.

## Verdict

**FAIL.** The core job is clear, the one-click sample game is usable and isolated, every registered claim test passes, and the notebook visual identity is distinctive. Four minor findings remain. This work order requires zero findings for a pass.

## Cold first read

**PASS at both widths.** Before scrolling, a fresh visitor can answer all three questions:

| Question | Answer from the first view | Exact live text |
| --- | --- | --- |
| What does it do? | It practices numbers through claps and steps. | “Practice numbers with claps and steps” |
| Who is it for? | Caregivers and preschoolers. | “For caregivers and preschoolers who want numbers to involve both bodies.” |
| What should I do first? | Open the sample game. | “Try it with sample data” / “Starts a ready-made clap round.” |

The primary action was visible at 390 px (245.7 × 48 CSS px) and desktop. Both cold loads made only same-origin requests and produced no console or page errors. The warm ruled-paper field, serif notebook type, original counting-piece art, stamp geometry, and adult/child turn-taking are product-specific rather than a generic SaaS surface.

## Findings

### F-3-1 — The 390 px first screen omits one of its required plain facts

- **Severity:** Minor
- **Location / exact quote:** Live landing at 390 × 844. “Free to play.” is below the viewport; only “Play without an account.” and “Use touch or keyboard.” are visible beneath the primary action.
- **Why it fails:** The required first-screen shape includes all three plain facts: privacy, input, and price. A phone visitor cannot see the price fact without scrolling, despite the desktop view fitting all three.
- **Concrete fix:** Reduce or rearrange the mobile hero so all three fact lines are visible with the headline, audience sentence, and sample action. For example, place the compact fact list directly under the audience sentence and move the large illustration below it.

### F-3-2 — A forward route change can focus a heading above the viewport

- **Severity:** Minor
- **Location / exact quote:** Live mobile route sequence: scroll home to its footer, activate the footer “Privacy” link, then inspect the new route. `/privacy` retains `scrollY = 263` and focuses “Your game stays on this device”, whose top is `-64 px` above the viewport.
- **Why it fails:** The route does receive H1 focus, but a keyboard or screen-magnifier visitor cannot see the focused destination. A new link navigation should begin at its incoming page heading; Back correctly restores the prior home scroll position.
- **Concrete fix:** On `pushState` navigation, scroll to the top before focusing the new H1. Preserve the existing browser-restored scroll on `popstate`. Add a Playwright regression test that opens Privacy from the visible footer link and verifies the Privacy H1 is within the viewport.

### F-3-3 — The real 404 H1 is a metaphor rather than a clear route heading

- **Severity:** Minor
- **Location / exact quote:** Live `/not-a-real-page` and `public/404.html:16` — “That page has wandered off.”
- **Why it fails:** In a screen-reader heading list, this does not state that the page is missing. The nearby non-heading eyebrow says “Page not found”, but the one required H1 should carry the plain result itself.
- **Concrete fix:** Change the H1 to “Page not found.” Keep the notebook styling and “Go to the home page” action.

### F-3-4 — The landing makes an unlisted, untestable participation promise

- **Severity:** Minor
- **Location / exact quote:** Landing privacy note — “The adult stays part of the loop.”
- **Why it fails:** This is a visitor-facing promise about how the activity is used, but it has no `claims.json` entry or observable test. The adult labels in the interface do not prove that an adult remains involved.
- **Concrete fix:** Remove this sentence, or replace it with a concrete, observable instruction such as “The adult chooses the motion and number.” If retaining a participation promise, register it and add a test for the observable behavior it means.

## Copy audit

Word counts use whitespace-separated words. Every landing and README sentence, heading, label, action, and footer line is listed. No item exceeds 22 words; there are no banned marketing adjectives. `F-3-4` is the sole claim-coverage flag in this copy.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| A shared table game | 4 | OK |
| Practice numbers with claps and steps | 6 | OK |
| For caregivers and preschoolers who want numbers to involve both bodies. | 11 | OK |
| Try it with sample data | 5 | OK — result-naming action |
| Starts a ready-made clap round. | 5 | OK — `seeded-demo` |
| Play without an account. | 4 | OK — `local-game` |
| Use touch or keyboard. | 4 | OK — `keyboard` |
| Free to play. | 3 | OK — `free-to-play` |
| Take turns | 2 | OK |
| Turn a number into claps or steps | 7 | OK |
| Choose the motion | 3 | OK |
| The adult picks claps or steps before the round. | 9 | OK — instruction |
| Call the number | 3 | OK |
| The adult taps a number and says it aloud. | 9 | OK — instruction |
| Make the marks | 3 | OK |
| The child moves. | 3 | OK — instruction |
| Both see one shape for each motion. | 7 | OK — `shape-amount` |
| A game, not a drill app | 6 | OK |
| There are no videos, ads, accounts, cameras, or online scores. | 10 | OK — `no-online-features` |
| The adult stays part of the loop. | 7 | F-3-4 |
| Start a new game without sample rounds. | 7 | OK — `demo-isolated` |
| A shared clap or step game for preschool number play. | 10 | OK |
| Privacy | 1 | OK |
| Terms | 1 | OK |
| Built by Param Factory | 4 | OK |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Number Motion Duet | 3 | OK |
| Number Motion Duet is a free, one-device movement game for caregivers and preschoolers. | 13 | OK — `free-to-play` |
| An adult calls a number. | 5 | OK |
| A child answers with claps or steps. | 7 | OK |
| Both see shape marks that show the amount. | 8 | OK — `shape-amount` |
| Try the isolated sample game at `/demo` or `/?demo=1`. | 9 | OK |
| Who it is for | 5 | OK |
| Caregivers who want early number play to be physical and cooperative. | 11 | OK |
| Use it | 2 | OK |
| Pick claps or steps. | 4 | OK |
| Tap a number and say it aloud. | 7 | OK |
| Move together, then tap the completion button. | 7 | OK |
| Completed rounds stay in this browser. | 6 | OK — `local-game` |
| Sample rounds stay separate from real games. | 7 | OK — `demo-isolated` |
| See Privacy and Terms. | 4 | OK |
| Develop and verify | 3 | OK |
| `npm run build` is the deployment build command. | 8 | OK |
| It creates `dist/` with `index.html` at its root for Azure Static Web Apps. | 13 | OK |
| `npm test` builds the site and runs browser tests. | 8 | OK |
| It checks the demo, keyboard, saved rounds, offline use, routes, touch targets, and accessibility. | 14 | OK |
| Each release uses new file names, so installed copies can update safely. | 12 | OK — `release-updates` |
| No remote fonts, analytics, trackers, or runtime third-party scripts are used. | 11 | OK — `no-remote-resources` |
| The notebook illustration's prompt and provenance are recorded in `.factory/design.md`. | 10 | OK |
| Project notes | 2 | OK |
| Static deploy target: `dist/`. | 4 | OK |
| License: MIT, in `LICENSE`. | 4 | OK |
| Demo details: `.factory/demo.md`. | 3 | OK |
| Verifiable visitor claims: `.factory/claims.json`. | 4 | OK |

## Demo, privacy, and claims

**Demo: PASS.** From a clean 390 px landing context, one click opened `/demo`. The first demo view showed the persistent “Demo — sample data, nothing is saved to your game.” banner, `3 steps` and `2 claps` sample rounds, motion and number controls, and the ready-made four-clap task. Completing it created only the `demo:number-motion-duet:session` key. **Reset demo** restored the seeded view; **Start for real** opened empty `/game`, without the banner or either storage key. Direct `/?demo=1` is implemented as the same sandbox path.

**Sandbox/privacy: PASS.** A live request log over landing → demo → complete → reset → real showed only `https://number-motion-duet.sociobot.in` requests and no errors. Live `/demo` reloaded while offline after its first visit, preserving the banner and two samples and showing “Offline. This game still works here.” Source inspection confirms disjoint `demo:` and real localStorage keys and no runtime API, analytics, AI, payment, account, camera, score, or remote asset path.

**Registered claims: PASS.** In a fresh clone at `/tmp/number-motion-duet-review3-p0CkvJ`, `npm ci` completed with 0 vulnerabilities. Every exact command listed in `.factory/claims.json` passed:

| Claim ID | Result |
| --- | --- |
| `demo-isolated` | PASS |
| `keyboard` | PASS |
| `local-game` | PASS |
| `seeded-demo` | PASS |
| `shape-amount` | PASS |
| `offline-demo` | PASS |
| `free-to-play` | PASS |
| `no-online-features` | PASS |
| `no-personal-details` | PASS |
| `no-remote-resources` | PASS |
| `release-updates` | PASS |

The clean clone then passed `npm test` (**22 passed**) and `npm run build`, which created `dist/index.html`.

## Structure and accessibility

- `/`, `/demo`, `/game`, `/privacy`, `/terms`, assets, `robots.txt`, and `sitemap.xml` returned HTTP 200; a deliberate missing path returned the styled HTTP 404. All discovered first-party links resolved; the Param Factory link is an explicit external link.
- Dynamic routes have route-specific titles, descriptions, canonicals, Open Graph/Twitter values, one H1, main landmark, favicon, and apple-touch icon. The static 404 has its own title, description, favicon, standard skeleton, home action, and `noindex` directive.
- Client navigation and Back set focus on the incoming H1 and update the live announcement. F-3-2 is the remaining forward-navigation scroll/focus gap.
- Live Axe scans reported no violations on `/`, `/demo`, `/game`, `/privacy`, `/terms`, or the HTTP 404. Touch controls are at least 44 px, focus styling is visible, and reduced motion disables the stamp animation.
- The product brief implies a small shared local game, not AI assistance, accounts, sync, or export. No obviously implied high-leverage feature is missing, and no decorative or keyed AI feature is present.

## Earlier findings rechecked

Every concrete earlier finding was confirmed live and in code, rather than accepted from its marked status:

| Earlier finding | Recheck result |
| --- | --- |
| F-2-1 README test sentence too long | Fixed: now two sentences, 8 and 14 words. |
| F-2-2 service-worker jargon | Fixed: now “Each release uses new file names…”. |
| F-2-3 “browser storage” jargon | Fixed: now “this browser”. |
| F-2-4 exposed `demo:` key in README | Fixed: README uses “Sample rounds stay separate…”. |
| F-2-5 abstract turn-taking H2 | Fixed: “Turn a number into claps or steps”. |
| Demo samples appeared in real games | Fixed: live real game was empty after Start for real; claim passes. |
| Demo query URL was not isolated | Fixed: `/?demo=1` enters the seeded bannered sandbox. |
| First-screen wording was abstract | Fixed: current H1, audience line, and action are direct. |
| Controls were under 44 px | Fixed: live mobile controls meet the target. |
| Service worker could remain stale | Fixed: content-hashed cache claim passes. |
| Corrupt state / singular wording | Fixed: validation/recovery and `1 clap`/`1 step` remain in source/tests. |
| Static 404 was only a fallback | Fixed: live missing path returns styled HTTP 404. |
| Visitor claims were unregistered | Fixed for the earlier set: all 11 registered commands pass; F-3-4 is newly found copy. |
| Storage failures blocked play | Fixed: in-memory/error recovery tests remain in the full suite. |
| Keyboard selection lost focus | Fixed: keyboard claim passes and restores selected-control focus. |
| 200% phone text overflowed | Fixed: responsive/reduced-motion coverage remains in the suite. |
| Non-home route metadata was wrong | Fixed: live Privacy navigation updates title, canonical, and focus. |
| Sitemap / 404 skeleton were incomplete | Fixed: sitemap includes `/game`; 404 has nav, legal footer, and factory attribution. |
| Catalog description was nonconforming | Fixed: `.factory/catalog-description.txt` remains verb-first and within 120 characters. |

## What would make this perfect

Show all three first-screen facts on a 390 px phone, bring a newly opened route heading into view without disturbing Back restoration, make the 404 H1 literal, and remove or test the adult-participation promise. Re-run the clean-clone claim matrix and live mobile audit after those changes.
