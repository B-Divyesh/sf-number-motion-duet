# Adversarial first-read review 2 — FAIL

**Reviewed URL:** <https://number-motion-duet.sociobot.in>

**Reviewed commit:** `c0b73cdf3e50fdd53e7cd8bf5255c1b948b6b660`

**Date:** 2026-08-28
**Scope:** cold live desktop and 390 px mobile checks, a clean-clone claims run,
source/metadata inspection, and the complete prior-review history. Product code
was not changed.

## Verdict

**FAIL.** The real game is clear, tryable, isolated, and technically solid.
However, this work order permits `PASS` only with zero findings. Five minor
plain-words findings remain in the landing/README copy audit. They are specific
and inexpensive to fix, but they are still findings.

## Cold first read

**PASS on desktop and 390 × 844 mobile before scrolling.** In a fresh browser
context, I could answer all three required questions from the first view:

| Question | Cold-read answer | Live evidence |
| --- | --- | --- |
| What does it do? | It practises numbers by doing claps and steps. | H1: “Practice numbers with claps and steps” |
| For whom? | Caregivers and preschoolers playing together. | “For caregivers and preschoolers who want numbers to involve both bodies.” |
| What should I click first? | **Try it with sample data**. | The visible primary action says this and notes “Starts a ready-made clap round.” |

The mobile action measured 245.7 × 48 CSS px and was visible without scrolling.
The desktop and mobile pages made only same-origin requests and had no console or
page errors. The notebook/table identity is distinct from a generic SaaS layout:
warm ruled paper, an original notebook-and-counting-pieces illustration, serif
display type, stamped geometry, and turn-taking content all match
`.factory/design.md`.

## Findings

### F-2-1 — README test instruction is 31 words and compresses too many technical ideas

- **Severity:** Minor
- **Location / exact quote:** `README.md:32-35` — “`npm test` builds the site, serves it locally, and runs Playwright checks for the demo sandbox, keyboard play, local storage separation, offline reload and update behavior, routes, touch targets, and accessibility.”
- **Why it fails:** This exceeds the 22-word hard cap and asks a first-time reader to parse implementation jargon and nine checks in one sentence.
- **Concrete fix:** Replace it with: “`npm test` builds the site and runs browser tests. It checks the demo, keyboard, saved rounds, offline use, routes, touch targets, and accessibility.”

### F-2-2 — README exposes service-worker-cache jargon instead of the visitor outcome

- **Severity:** Minor
- **Location / exact quote:** `README.md:35-36` — “The build hashes app assets and generates a versioned service-worker cache so installed copies receive releases safely.”
- **Why it fails:** “Hashes app assets” and “versioned service-worker cache” are implementation terms. The reader needs the update outcome, not the mechanism.
- **Concrete fix:** Replace it with: “Each release uses new file names, so installed copies can update safely.” Keep the registered `release-updates` test.

### F-2-3 — README calls saved rounds “browser storage”

- **Severity:** Minor
- **Location / exact quote:** `README.md:19` — “The game stores completed rounds in browser storage only.”
- **Why it fails:** “Browser storage” is a developer term. The landing already uses the more direct “this browser.”
- **Concrete fix:** Replace it with: “Completed rounds stay in this browser.” The registered `local-game` claim still proves the statement.

### F-2-4 — README leaks a storage-key implementation detail into the product explanation

- **Severity:** Minor
- **Location / exact quote:** `README.md:19-20` — “Demo rounds use a separate `demo:` storage key.”
- **Why it fails:** A caregiver cannot use a storage-key prefix. It obscures the useful promise: sample play does not mix with their game.
- **Concrete fix:** Replace it with: “Sample rounds stay separate from real games.” Keep the exact key only in `.factory/demo.md`, where it is useful to a verifier.

### F-2-5 — Landing heading is abstract when read out of context

- **Severity:** Minor
- **Location / exact quote:** landing “How it works” H2 — “Make one number a whole-body idea”
- **Why it fails:** “Whole-body idea” is a metaphor rather than an instruction. In a screen-reader headings list it does not state what this section teaches or does.
- **Concrete fix:** Replace it with: “Turn a number into claps or steps.”

## Copy audit

Word counts split visible copy on whitespace. Labels, headings, actions, and
footer copy are included so that no landing or README sentence is skipped.
`F-2-1` through `F-2-5` are the only flags. No landing sentence exceeds 22
words; no marketing adjective or inconsistent product term was found.

### Landing page

| # | Copy | Words | Result |
| --- | --- | ---: | --- |
| 1 | A shared table game | 4 | OK |
| 2 | Practice numbers with claps and steps | 6 | OK |
| 3 | For caregivers and preschoolers who want numbers to involve both bodies. | 11 | OK |
| 4 | Try it with sample data | 5 | OK — result-naming action |
| 5 | Starts a ready-made clap round. | 5 | OK |
| 6 | Play without an account. | 4 | OK |
| 7 | Use touch or keyboard. | 4 | OK |
| 8 | Free to play. | 3 | OK |
| 9 | Take turns | 2 | OK |
| 10 | Make one number a whole-body idea | 6 | F-2-5 |
| 11 | Choose the motion | 3 | OK |
| 12 | The adult picks claps or steps before the round. | 9 | OK |
| 13 | Call the number | 3 | OK |
| 14 | The adult taps a number and says it aloud. | 9 | OK |
| 15 | Make the marks | 3 | OK |
| 16 | The child moves. | 3 | OK |
| 17 | Both see one shape for each motion. | 7 | OK |
| 18 | A game, not a drill app | 6 | OK |
| 19 | There are no videos, ads, accounts, cameras, or online scores. | 10 | OK — registered claim |
| 20 | The adult stays part of the loop. | 7 | OK |
| 21 | Start a new game without sample rounds. | 7 | OK — result-naming action |
| 22 | A shared clap or step game for preschool number play. | 10 | OK |
| 23 | Privacy | 1 | OK |
| 24 | Terms | 1 | OK |
| 25 | Built by Param Factory | 4 | OK |

### README

| # | Copy | Words | Result |
| --- | --- | ---: | --- |
| 1 | Number Motion Duet is a free, one-device movement game for caregivers and preschoolers. | 13 | OK |
| 2 | An adult calls a number. | 5 | OK |
| 3 | A child answers with claps or steps. | 7 | OK |
| 4 | Both see shape marks that show the amount. | 8 | OK |
| 5 | Try the isolated sample game at `/demo` or `/?demo=1`. | 9 | OK |
| 6 | Caregivers who want early number play to be physical and cooperative. | 11 | OK |
| 7 | Pick claps or steps. | 4 | OK |
| 8 | Tap a number and say it aloud. | 7 | OK |
| 9 | Move together, then tap the completion button. | 7 | OK |
| 10 | The game stores completed rounds in browser storage only. | 9 | F-2-3 |
| 11 | Demo rounds use a separate `demo:` storage key. | 8 | F-2-4 |
| 12 | See Privacy and Terms. | 4 | OK |
| 13 | `npm run build` is the deployment build command. | 8 | OK |
| 14 | It creates `dist/` with `index.html` at its root for Azure Static Web Apps. | 13 | OK |
| 15 | `npm test` builds the site, serves it locally, and runs Playwright checks for the demo sandbox, keyboard play, local storage separation, offline reload and update behavior, routes, touch targets, and accessibility. | 31 | F-2-1 |
| 16 | The build hashes app assets and generates a versioned service-worker cache so installed copies receive releases safely. | 17 | F-2-2 |
| 17 | No remote fonts, analytics, trackers, or runtime third-party scripts are used. | 11 | OK — registered claim |
| 18 | The notebook illustration’s prompt and provenance are recorded in `.factory/design.md`. | 10 | OK |
| 19 | Static deploy target: `dist/`. | 4 | OK |
| 20 | License: MIT, in `LICENSE`. | 4 | OK |
| 21 | Demo details: `.factory/demo.md`. | 3 | OK |
| 22 | Verifiable visitor claims: `.factory/claims.json`. | 4 | OK |

## Demo and sandbox check

**PASS.** From a new 390 px context, the landing action opened `/demo` in one
click. The first screen was already in use: it showed the persistent “Demo —
sample data, nothing is saved to your game.” banner, two realistic completed
rounds (`3 steps`, `2 claps`), and **We did 4 claps**. **Reset demo** restored
that seeded view. **Start for real** opened `/game` with no banner, no completed
rounds, and neither the demo nor real localStorage key set. Source confirms the
separate namespaces: `demo:number-motion-duet:session` for the sample and
`number-motion-duet:session` for real play.

Opening `/?demo=1` also entered the same isolated demo. After the first visit,
an offline reload of live `/demo` retained the demo banner and showed “Offline.
This game still works here.”

## Claims check

**PASS.** I cloned the supplied checkout into a new temporary directory, ran
`npm ci` (0 vulnerabilities), then ran every exact command in
`.factory/claims.json` individually. All 11 passed. `npm test` then passed
21/21, and `npm run build` produced `dist/` (13.28 kB JS / 4.90 kB gzip; 9.20 kB
CSS / 2.88 kB gzip; 72.01 kB original WebP art).

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

The live landing and README claim-like copy maps to entries for demo isolation,
keyboard use, local-only play, seeded demo, shape amount, free play, no online
features, no personal details, no remote resources, and release updates. No
unlisted visitor claim was found. Live Playwright request logs during landing,
demo, and offline reload contained only `number-motion-duet.sociobot.in` URLs;
no provider key, AI call, tracker, remote font, or third-party script exists.

The brief is a local shared movement game. It does not imply import/export,
sync, or an AI step; adding one would be decorative rather than useful.

## Structure, accessibility, and links

**PASS.** Live `/`, `/demo`, `/game`, `/privacy`, and `/terms` each returned
200 and had a route-specific title, one H1, one main landmark, a description,
canonical URL, favicon, consistent header/footer, and no Axe violations. Client
navigation to Privacy and browser Back both focused the incoming H1 and updated
the polite route announcement. The sitemap lists all five product routes;
robots allows crawling. All crawled internal links and the explicit external
Param Factory link returned 200. A deliberate missing path returned the styled
404 with HTTP 404.

The root has canonical, Open Graph/Twitter metadata, a product-specific social
image, SVG favicon, and Apple touch icon. No dead link, generic-template visual
treatment, broken deep link, or route/back-button defect was observed.

## Earlier-finding regression check

Every earlier verifier finding was rechecked on the live site and in the
current code; none regressed. The preceding records did not assign `F-*` IDs,
so their original finding labels are retained here.

| Earlier finding | Current confirmation |
| --- | --- |
| Demo samples appeared in real games | Fixed: `/game` starts empty; `emptySession()` is reserved for real play; live Start for real was empty. |
| `demo-isolated` test was a false positive | Fixed: the tagged test now checks the real UI and storage boundary. |
| First screen was abstract | Fixed: cold H1, audience sentence, and explicit sample action answered all three first-read questions. |
| Header/footer/demo controls were under 44 px | Fixed: mobile primary action and demo controls meet the local tested target baseline. |
| Service worker could remain stale | Fixed: production assets are content-hashed and `release-updates` passed. |
| Corrupt state and singular wording | Fixed: deserialisation validates data; 1 uses singular wording; recovery tests pass. |
| Static 404 was a 200 fallback | Fixed: a missing live path returned styled HTTP 404. |
| Visitor claims were unregistered | Fixed: 11 claims each have an exact tagged test; current claim-like visitor copy maps to them. |
| Storage failures stopped play or hid feedback | Fixed: current suite covers write/delete failure recovery. |
| Keyboard selection dropped focus | Fixed: current tagged keyboard test and complete suite pass. |
| 200% text overflowed at 390 px | Fixed: the current responsive test passes. |
| Non-home metadata/canonicals were wrong | Fixed: live app routes update title, description, social metadata, and canonical URL. |
| Sitemap and static-404 skeleton were incomplete | Fixed: `/game` is in the sitemap; static 404 has navigation, legal links, factory footer, and version. |
| Catalog description was missing/nonconforming | Fixed: `.factory/catalog-description.txt` is verb-first and concise. |

## What would make this perfect

Apply F-2-1 through F-2-5, then rerun the clean-clone claims commands, full
suite, build, and the 390 px cold-read check. At that point the product would
have no known functional, privacy, structural, accessibility, or copy finding.
