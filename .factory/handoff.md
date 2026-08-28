# Review 4 handoff — Number Motion Duet

## Result

Independent adversarial review completed without changing product code.
Committed review artifact: `.factory/review-4.md`.

Verdict: **FAIL** with one minor finding, `F-4-1`: the deployed static HTTP 404
has a description and SVG favicon but lacks canonical, Open Graph, Twitter, and
Apple touch-icon metadata. All application routes have that metadata.

## Verified

- Fresh cold live checks at 390 × 844 and 1440 × 900: job, audience, first
  action, and all three facts are visible; no console/page errors or external
  requests.
- One-click `/demo`, direct `?demo=1`, seeded sample, Reset demo, Start for
  real, separate storage namespaces, and empty real game.
- `npm ci` in a fresh clone; all 11 exact claim commands passed individually;
  full Playwright suite passed 24/24; typecheck/lint passed; build produced
  `dist/index.html`.
- Live route/link crawl, HTTP 404, metadata, routing/back-focus behavior, and
  history regression check. The source and live checks confirm all earlier
  findings remain fixed.

## How to reproduce

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Open `https://number-motion-duet.sociobot.in/`, then use **Try it with sample
data**. Check `/not-a-real-page` for the remaining static-404 metadata issue.

## Next step

Add canonical, Open Graph, Twitter, and Apple touch-icon tags to
`public/404.html`, add an HTTP-404 head-metadata test, then rerun the commands
above and the individual commands in `.factory/claims.json`.
