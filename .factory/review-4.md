# Adversarial first-read review 4 — FAIL

**Reviewed URL:** <https://number-motion-duet.sociobot.in>
**Reviewed commit:** `ca41208e55b809479e0c0fdbba449820bb7b0686`
**Date:** 2026-08-28
**Scope:** Fresh live desktop and 390 × 844 browser contexts, a fresh-clone
claim matrix, source inspection, and every earlier review, verification, polish,
and handoff record. Product code was not changed.

## Verdict

**FAIL.** The cold explanation, one-click demo, isolation boundary, claim
matrix, privacy behavior, accessibility baseline, and product-specific visual
system all pass. One minor but real route-metadata defect remains. This work
order permits PASS only when there are zero findings.

## Cold first read

**PASS at 390 × 844 and 1440 × 900 before scrolling.** A new visitor can
answer all three required questions from the first screen:

| Question | Answer | Exact live text |
| --- | --- | --- |
| What does this do? | It practices numbers through claps and steps. | “Practice numbers with claps and steps” |
| For whom? | Caregivers and preschoolers playing together. | “For caregivers and preschoolers who want numbers to involve both bodies.” |
| What should I click first? | Open the seeded sample game. | “Try it with sample data” and “Starts a ready-made clap round.” |

At 390 px, the headline, audience sentence, action, and all facts were visible
at scroll position zero. The last fact, “Free to play.”, ended at 580 px in an
844 px viewport. Both fresh cold loads made only same-origin requests and had
no console or page errors. The ruled-paper notebook, original counting-piece
art, stamped geometry, and adult/child turn-taking are distinct from a generic
SaaS template and match `.factory/design.md`.

## Findings

### F-4-1 — The real static 404 lacks required canonical and social metadata

- **Severity:** Minor
- **Location / exact evidence:** Live `GET /not-a-real-page` returns the
  styled HTTP 404. Its `<head>` contains `<meta name="description"
  content="The requested Number Motion Duet page was not found." />`,
  `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`, and
  `<title>Page not found — Number Motion Duet</title>`
  (`public/404.html:7-11`), but contains no canonical link, Open Graph tags,
  Twitter card tags, or Apple touch-icon link.
- **Why it fails:** This is a real route served without the SPA, so its missing
  metadata cannot be repaired by client-side navigation. It misses the
  required per-route canonical/social metadata and the second required
  favicon. A shared or indexed missing-page URL can therefore describe itself
  inconsistently with the rest of the product.
- **Concrete fix:** Add a canonical URL for the 404 document, `og:type`,
  `og:title`, `og:description`, `og:url`, `og:image`, Twitter card/title/
  description tags, and `<link rel="apple-touch-icon"
  href="/apple-touch-icon.svg">` to `public/404.html`. Add a regression test
  that requests a missing route and asserts these tags in the returned static
  document.

## Copy audit

Counts use whitespace-separated words. Repeated navigation labels are counted
once. Commands and file paths are not reader-facing sentences. No item exceeds
22 words; no banned marketing adjective, unexplained jargon, inconsistent term,
metaphor heading, or non-result-naming action was found. All claim-like copy is
covered by the matching `claims.json` entry; there are no unlisted claims.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to the game | 4 | OK |
| Number Motion Duet | 3 | OK |
| Demo / Play / Privacy | 1 each | OK — navigation labels |
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
| Start a new game without sample rounds. | 7 | OK — result-naming action / `demo-isolated` |
| A shared clap or step game for preschool number play. | 10 | OK |
| Privacy / Terms / Built by Param Factory / v1.0.0 | 1 / 1 / 4 / 1 | OK — footer labels |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Number Motion Duet | 3 | OK |
| Number Motion Duet is a free, one-device movement game for caregivers and preschoolers. | 13 | OK — `free-to-play` |
| An adult calls a number. | 5 | OK |
| A child answers with claps or steps. | 7 | OK |
| Both see shape marks that show the amount. | 8 | OK — `shape-amount` |
| Try the isolated sample game at `/demo` or `/?demo=1`. | 9 | OK — `demo-isolated` / `seeded-demo` |
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
| `npm run build` is the deployment build command. | 8 | OK — developer instruction |
| It creates `dist/` with `index.html` at its root for Azure Static Web Apps. | 13 | OK — developer instruction |
| `npm test` builds the site and runs browser tests. | 9 | OK — developer instruction |
| It checks the demo, keyboard, saved rounds, offline use, routes, touch targets, and accessibility. | 14 | OK — developer instruction |
| Each release uses new file names, so installed copies can update safely. | 12 | OK — `release-updates` |
| No remote fonts, analytics, trackers, or runtime third-party scripts are used. | 11 | OK — `no-remote-resources` |
| The notebook illustration's prompt and provenance are recorded in `.factory/design.md`. | 10 | OK |
| Project notes | 2 | OK |
| Static deploy target / License / Demo details / Verifiable visitor claims labels | 3 / 1 / 2 / 3 | OK |

## Demo, claims, privacy, and missed leverage

**Demo: PASS.** In a new 390 px context, one click on the landing action opened
`/demo`. The first screen already showed the persistent “Demo — sample data,
nothing is saved to your game.” banner, realistic `3 steps` and `2 claps`
history, and the available **We did 4 claps** action. **Reset demo** restored
that seed. **Start for real** opened `/game` with no banner, no rounds, and no
demo or real localStorage key. Source confirms the separate namespaces:
`demo:number-motion-duet:session` and `number-motion-duet:session`.
`?demo=1` is also a direct sandbox entry point.

**Claims: PASS.** From a fresh clone, `npm ci` succeeded. Each of the eleven
exact commands in `.factory/claims.json` then passed individually; the full
suite passed **24/24**, and `npm run build` created `dist/index.html`.

| Claim IDs passed individually |
| --- |
| `demo-isolated`, `keyboard`, `local-game`, `seeded-demo`, `shape-amount`, `offline-demo`, `free-to-play`, `no-online-features`, `no-personal-details`, `no-remote-resources`, `release-updates` |

Live landing/demo request capture contained only
`https://number-motion-duet.sociobot.in` requests and no errors. The registered
privacy tests record same-origin requests, verify no personal-data fields or
camera use, and confirm no remote runtime resources. The brief is a simple,
local shared movement activity; it does not imply an AI step, import/export,
or sync. Adding one would be decorative rather than leverage.

## Structure, routing, and accessibility

**PASS except F-4-1.** `/`, `/demo`, `/game`, `/privacy`, `/terms`, robots,
sitemap, both icons, social card, and the external Param Factory link returned
200. A deliberate missing path returned the styled page with HTTP 404. The
five application routes have a route-specific title, one H1, one main landmark,
description, canonical URL, Open Graph/Twitter metadata, SVG favicon, Apple
touch icon, consistent header/footer, and no horizontal overflow at 390 px.
The sitemap lists all five routes. Client navigation focuses and announces the
incoming H1; Back restores the prior scroll position. The checked-in Axe test
passes on every application route and static 404; keyboard, 200% text, touch
target, reduced-motion, offline, and storage-recovery tests passed in the
fresh-clone suite.

## Earlier-finding regression check

Every earlier finding was confirmed on the live build and in the current code;
none is unfixed, half-fixed, or regressed. This includes descriptive findings
from earlier verification files as well as numbered review findings.

| Earlier finding(s) | Current confirmation |
| --- | --- |
| Demo samples entered real play; isolation test was false-positive | Fresh `/game` and Demo → Start for real were empty; current tagged test checks UI and real-only saved round. |
| Direct sample entry was absent | `/demo` and `?demo=1` open the seeded, bannered sandbox. |
| First screen was abstract; a mobile fact was out of view | The plain H1/action answer the cold-read questions; all three facts are visible at 390 px. |
| Controls missed 44 px | Current mobile target test passed; live demo controls, navigation, footer, and skip link meet it. |
| Service worker could stay stale | Built assets are hashed; `release-updates` passed. |
| Corrupt state, singular labels, and storage failures failed | Validation/reset, singular labels, in-memory fallback, and recovery feedback are present and tested. |
| Keyboard selection lost focus; 200% text overflowed | Current keyboard-focus and 390 px / 200% reflow tests passed. |
| Missing route was a 200 fallback; its H1 was metaphorical | Live missing route is HTTP 404 and both fallback H1s say “Page not found.” |
| Claims were absent, unlisted, or did not prove persistence/seed/shape behavior | Eleven entries each have one tagged observable test; all passed individually. |
| Non-home metadata/canonical, sitemap, and 404 skeleton were incomplete | SPA routes have route metadata; sitemap includes `/game`; static 404 has nav, legal links, factory footer, and version. F-4-1 identifies the remaining 404 head-metadata gap. |
| F-2-1 through F-2-5 | README instructions are short/plain; storage terms are direct; the How it works H2 is literal. |
| F-3-1 through F-3-4 | Facts fit on mobile, forward navigation shows the focused H1, 404 H1 is literal, and the untestable adult-participation line is removed. |

## What would make this perfect

Close F-4-1 by giving the static 404 the same canonical, social-card, Twitter,
and Apple-touch metadata baseline as the other routes. Re-run the missing-route
HTTP/document test, the clean-clone claim matrix, and the full suite. With that
single route defect removed, this review has no remaining finding.
