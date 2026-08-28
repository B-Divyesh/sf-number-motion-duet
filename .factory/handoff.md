# Review 2 handoff — Number Motion Duet

## Result

Review completed without changing product code. The required report is
`.factory/review-2.md`.

**Verdict: FAIL.** The live product passes the functional, demo-isolation,
privacy, claims, routing, accessibility, and responsive checks. Five minor
plain-words findings remain: four README rewrites and one abstract landing H2.
They are fully specified as `F-2-1` through `F-2-5` in the review.

## Verification performed

- Fresh live browser contexts at desktop and 390 px: first-read, demo flow,
  reset, Start for real, localStorage separation, same-origin requests, offline
  demo reload, route focus/back behavior, metadata, links, and styled HTTP 404.
- Live Axe scans on `/`, `/demo`, `/game`, `/privacy`, and `/terms`: no
  violations.
- Fresh temporary clone: `npm ci`, every exact command in
  `.factory/claims.json` (11/11 passed), `npm test` (21/21 passed), `npm run
  build` (passed and created `dist/`), and `git diff --check`.
- Read the brief, design, claims, demo documentation, prior verifier records,
  polish record, and prior handoff. Earlier functional findings were confirmed
  fixed in both live behavior and source.

## Remaining work

Apply the five copy fixes in `.factory/review-2.md`, then repeat the clean-clone
claim commands, full test/build, and cold 390 px first-read check. No product
code was modified during this review.
