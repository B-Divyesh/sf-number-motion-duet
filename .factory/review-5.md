# Adversarial first-read review 5 — PASS

**Reviewed URL:** <https://number-motion-duet.sociobot.in>  
**Reviewed commit:** `14723112567b42fbe13561e496536b2be4e2bb2d`  
**Date:** 2026-08-28  
**Scope:** fresh live browser contexts at 390 × 844 and 1440 × 900, a clean-clone claim run, live sandbox/privacy/routing/accessibility checks, and source/history inspection. Product code was not changed.

## Verdict

**PASS.** There are zero findings. The first screen is clear on a phone, the sample game is one click and genuinely isolated, all registered claims pass from a clean clone, and no earlier finding is unfixed, partial, or regressed.

## Cold first read

**PASS at 390 px and desktop before scrolling.** A first-time visitor can answer all three questions from the first screen.

| Question | Answer from the first screen | Exact live evidence |
| --- | --- | --- |
| What does this do? | It practises numbers through claps and steps. | H1: “Practice numbers with claps and steps” |
| Who is it for? | Caregivers and preschoolers playing together. | “For caregivers and preschoolers who want numbers to involve both bodies.” |
| What should I click first? | Open a ready-made sample round. | “Try it with sample data” and “Starts a ready-made clap round.” |

At 390 px, the headline begins at 212 px, the action is 245.7 × 48 px, and the three facts end at 580 px of an 844 px viewport. All are visible without scrolling: “Play without an account.”, “Use touch or keyboard.”, and “Free to play.” Desktop likewise shows the complete first-screen decision. Fresh cold loads made only same-origin requests and produced no application console or page errors.

The visual system is distinct and product-specific: an original warm-paper notebook illustration, graphite/navy type, stamped counting shapes, and an adult/child turn-taking layout. It follows the documented handwritten-lab-notebook thesis rather than a generic SaaS-card treatment.

## Copy audit

Word counts use whitespace-separated visible words; list numerals and code blocks are not prose words. Every item is at or below 22 words. No banned marketing term, jargon used in visitor copy, inconsistent term, opaque heading, or non-result-naming button was found. Controls such as “Demo” and “Play” are route names; the action controls name their outcome.

### Landing page

| Copy | Words | Check |
| --- | ---: | --- |
| Skip to the game | 4 | Pass — skip action |
| Number Motion Duet | 3 | Pass — wordmark |
| Demo | 1 | Pass — route link |
| Play | 1 | Pass — route link |
| Privacy | 1 | Pass — route link |
| A shared table game | 4 | Pass — activity label |
| Practice numbers with claps and steps | 6 | Pass — plain job headline |
| For caregivers and preschoolers who want numbers to involve both bodies. | 11 | Pass — audience and situation |
| Try it with sample data | 5 | Pass — result-naming action |
| Starts a ready-made clap round. | 5 | Pass — immediate result |
| Play without an account. | 4 | Pass — `local-game` |
| Use touch or keyboard. | 4 | Pass — `keyboard` |
| Free to play. | 3 | Pass — `free-to-play` |
| Take turns | 2 | Pass — section label |
| Turn a number into claps or steps | 7 | Pass — literal section heading |
| Choose the motion | 3 | Pass — step heading |
| The adult picks claps or steps before the round. | 9 | Pass — instruction |
| Call the number | 3 | Pass — step heading |
| The adult taps a number and says it aloud. | 9 | Pass — instruction |
| Make the marks | 3 | Pass — step heading |
| The child moves. | 3 | Pass — instruction |
| Both see one shape for each motion. | 7 | Pass — `shape-amount` |
| A game, not a drill app | 6 | Pass — states the product boundary |
| There are no videos, ads, accounts, cameras, or online scores. | 10 | Pass — `no-online-features` |
| Start a new game without sample rounds. | 7 | Pass — `demo-isolated` action |
| A shared clap or step game for preschool number play. | 10 | Pass — footer description |
| Privacy | 1 | Pass — legal link |
| Terms | 1 | Pass — legal link |
| Built by Param Factory | 4 | Pass — external attribution |
| (external site) | 2 | Pass — screen-reader disclosure |
| v1.0.0 | 1 | Pass — version |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Number Motion Duet | 3 | Pass — document title |
| Number Motion Duet is a free, one-device movement game for caregivers and preschoolers. | 13 | Pass — `free-to-play`; clear description |
| An adult calls a number. | 5 | Pass — use instruction |
| A child answers with claps or steps. | 7 | Pass — use instruction |
| Both see shape marks that show the amount. | 8 | Pass — `shape-amount` |
| Try the isolated sample game at `/demo` or `/?demo=1`. | 9 | Pass — `seeded-demo` / `demo-isolated` |
| Who it is for | 5 | Pass — literal heading |
| Caregivers who want early number play to be physical and cooperative. | 11 | Pass — audience |
| Use it | 2 | Pass — literal heading |
| Pick claps or steps. | 4 | Pass — instruction |
| Tap a number and say it aloud. | 7 | Pass — instruction |
| Move together, then tap the completion button. | 7 | Pass — instruction |
| Completed rounds stay in this browser. | 6 | Pass — `local-game` |
| Sample rounds stay separate from real games. | 7 | Pass — `demo-isolated` |
| See Privacy and Terms. | 4 | Pass — links |
| Develop and verify | 3 | Pass — literal heading |
| `npm run build` is the deployment build command. | 8 | Pass — developer instruction |
| It creates `dist/` with `index.html` at its root for Azure Static Web Apps. | 13 | Pass — deploy output |
| `npm test` builds the site and runs browser tests. | 9 | Pass — developer instruction |
| It checks the demo, keyboard, saved rounds, offline use, routes, touch targets, and accessibility. | 14 | Pass — developer instruction |
| Each release uses new file names, so installed copies can update safely. | 12 | Pass — `release-updates` |
| No remote fonts, analytics, trackers, or runtime third-party scripts are used. | 11 | Pass — `no-remote-resources` |
| The notebook illustration's prompt and provenance are recorded in `.factory/design.md`. | 10 | Pass — documentation pointer |
| Project notes | 2 | Pass — literal heading |
| Static deploy target: `dist/`. | 4 | Pass — developer note |
| License: MIT, in LICENSE. | 4 | Pass — developer note |
| Demo details: `.factory/demo.md`. | 3 | Pass — developer note |
| Verifiable visitor claims: `.factory/claims.json`. | 4 | Pass — developer note |

The only terminology used for each recurring concept is consistent: adult, child, motion, claps/steps, shape marks, round, and demo. All visitor-facing claim-like statements above map to a claim entry where they promise observable behaviour. No unlisted claim was found.

## Demo, isolation, and privacy

**PASS.** From a clean 390 px context, one click on **Try it with sample data** opened `/demo`. The first screen already showed the product in use: the persistent “Demo — sample data, nothing is saved to your game.” banner, sample history of `3 steps` and `2 claps`, and an enabled **We did 4 claps** action. **Reset demo** restored that same seed. **Start for real** opened `/game` with no banner, zero rounds, the “Completed rounds will appear here.” empty state, and neither demo nor real storage created.

Direct `/?demo=1` uses the same sandbox. In a separate boundary check, a saved real `1 clap` remained unchanged while demo added a four-clap sample round; on leaving demo, the demo key was removed and the real round remained. Source and the passing claim test confirm separate localStorage namespaces: `demo:number-motion-duet:session` and `number-motion-duet:session`.

After the first visit, a fresh live `/demo` context had an active service worker and `number-motion-duet-d08e80af5d9a` cache. Setting the context offline and reloading kept the banner and game visible with “Offline. This game still works here.” Request logs for cold landing, demo interaction, real play, and offline reload contained only `https://number-motion-duet.sociobot.in`; there are no provider keys, remote fonts, analytics, trackers, or third-party scripts.

The brief is a deliberately local shared movement game. It does not imply AI, import/export, or sync. Adding any of those would be decorative rather than a missing expected capability; no AI feature or embedded provider key exists.

## Claims

**PASS.** In a new clone at `/tmp/number-motion-duet-review-5-alPayM` on the reviewed commit, `npm ci` completed with 0 vulnerabilities. Every exact command in `.factory/claims.json` was run separately and passed.

| Claim ID | Result |
| --- | --- |
| `demo-isolated` | Pass |
| `keyboard` | Pass |
| `local-game` | Pass |
| `seeded-demo` | Pass |
| `shape-amount` | Pass |
| `offline-demo` | Pass |
| `free-to-play` | Pass |
| `no-online-features` | Pass |
| `no-personal-details` | Pass |
| `no-remote-resources` | Pass |
| `release-updates` | Pass |

`npm test` then passed **24/24**. `npm run typecheck` and `npm run build` passed; build output includes `dist/`, 13.77 kB JavaScript (5.05 kB gzip), 9.23 kB CSS (2.89 kB gzip), and the 72.01 kB local WebP illustration.

## Structure, routes, links, and accessibility

**PASS.** Direct live requests to `/`, `/demo`, `/game`, `/privacy`, and `/terms` returned 200; a missing route returned the designed static 404 with HTTP 404. Each product route has the required route-specific title, one H1, one main landmark, language, description, canonical, Open Graph/Twitter data, favicon, shared header/footer, Privacy and Terms links, and the original social card. `robots.txt` and `sitemap.xml` are present; the sitemap includes each product route.

Every discovered internal link (including skip links) returned 200, the intentional missing-route skip link returned 404, and the Param Factory external link returned 200. SPA footer navigation to Privacy reset scroll to zero, focused the visible H1 at 199 px, and announced “Privacy loaded”; browser Back returned home, restored its 1375 px scroll position, and focused the home H1.

Fresh Axe scans on all six routes found zero serious or critical violations. Keyboard flow, touch targets, 390 px layout, 200% text reflow, reduced motion, and app-route console/page errors are covered by the passing suite. The direct 404 navigation naturally reports its HTTP 404 in browser network diagnostics; it has no application script error and renders the designed recovery page.

## Earlier-finding regression check

Every prior review, polish record, verification, and handoff was read. Each finding was confirmed against both the live product and current source/tests.

| Earlier finding | Current confirmation |
| --- | --- |
| Verification: demo samples appeared in real play | Fixed: fresh `/game` is empty; Demo → Start for real is empty; real and demo keys remain separate. |
| Verification: `demo-isolated` test was a false positive | Fixed: the tagged test asserts live empty state, storage keys, and a subsequent real-only round. |
| Verification: controls below 44 px | Fixed: mobile header, footer, demo, and skip controls are covered by the target-size test. |
| Verification: stale service-worker cache | Fixed: hashed assets and build-derived cache ID pass `release-updates`; live offline reload works. |
| Verification: damaged state and singular wording | Fixed: state validation/recovery and `1 clap`/`1 step` test pass. |
| Verification: 404 was a 200 SPA fallback | Fixed: missing live route is a styled HTTP 404. |
| Verification 2: claims registry incomplete | Fixed: 11 claims, each with a tagged observable test, all pass separately. |
| Verification 2: storage failure blocked play | Fixed: in-memory recovery and status feedback remain covered by the suite. |
| Verification 2: demo controls lacked touch targets | Fixed: controls meet the tested 44 px baseline. |
| Verification 2: keyboard selection lost focus | Fixed: the keyboard claim passes and focus returns to the selected control. |
| Verification 2: 200% text overflowed | Fixed: 390 px responsive/reflow test passes. |
| Verification 2: non-home canonical metadata was wrong | Fixed: live route navigation updates canonical, title, description, and social metadata. |
| Verification 2: sitemap/static 404 skeleton incomplete | Fixed: `/game` is listed; static 404 has navigation, legal links, attribution, and version. |
| Verification 3: mandatory claim coverage incomplete | Fixed: current 11-claim registry covers all visitor promises and tests observable outcomes. |
| F-2-1 | Fixed: README test explanation is two short, useful sentences. |
| F-2-2 | Fixed: README gives the installed-copy outcome without service-worker jargon. |
| F-2-3 | Fixed: README says “this browser,” not “browser storage.” |
| F-2-4 | Fixed: README explains separation without exposing a storage-key detail. |
| F-2-5 | Fixed: the literal H2 is “Turn a number into claps or steps.” |
| F-3-1 | Fixed: all three first-screen facts are visible at 390 px. |
| F-3-2 | Fixed: forward navigation scrolls to top before focusing the visible new H1; Back restores scroll. |
| F-3-3 | Fixed: both 404 paths use the literal H1 “Page not found.” |
| F-3-4 | Fixed: the untestable adult-participation promise is absent. |
| F-4-1 | Fixed: the static 404 includes canonical, Open Graph, Twitter, and Apple touch-icon metadata. |

## What would make this perfect

Nothing remains from this review scope. Maintain the current one-click isolated demo, plain copy, claim-to-test mapping, and route checks when future changes are made.
