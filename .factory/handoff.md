# Number Motion Duet polish 1 handoff

## Result

**PASS — deployed and cold-checked at
<https://number-motion-duet.sociobot.in>.** This polish starts from candidate
`ca10fa5145f0e994f15e648bfafdbe6490965776`, closes the cumulative verifier
findings plus the controller requirements, and is deployed from commit
`a7d698a0f7ad78bd9e0ec8eb1690f81e69cfb787`.

The product keeps its handwritten lab-notebook identity while making the first
screen more direct: **“Practice numbers with claps and steps.”** It retains a
one-click isolated demo at `/demo` and `/?demo=1`, and now updates route
description/social metadata along with title and canonical URL.

## What was verified

- All 11 exact commands in `.factory/claims.json` passed individually after
  `npm ci`.
- The cold desktop and 390 px first screen plainly states what the product does,
  who it serves, and the first click. **Try it with sample data** opens the
  isolated, seeded four-clap demo in one click.
- `npm ci` (0 vulnerabilities), typecheck, lint, all 21 Playwright tests, the exact production build,
  and `git diff --check` passed. The install reported zero vulnerabilities.
- Local normal, boundary (1 and 10), ten-round, corrupt-storage, storage-failure,
  demo reset/separation, persistence, keyboard, mobile, 200% text, reduced-motion,
  offline, and update paths passed.
- The local Axe suite found zero serious or critical violations on all app routes. No console/page errors,
  cross-origin runtime requests, tracker, account, payment, camera, or child-data
  collection path was found.
- The preceding candidate's cold mobile Lighthouse scored **99 Performance / 100 Accessibility / 100 Best
  Practices / 100 SEO**, with 1.3 s LCP, 140 ms TBT, 0 CLS, and 79 KiB transfer;
  this polish changes only copy, metadata, and test coverage and remains within
  the same asset budgets.
- Security headers, cache policies, all links, the true styled 404, and service
  worker offline/update behavior passed.
- Live HTML, service worker, hashed JS/CSS/hero, 404, robots, and sitemap
  byte-match the local production build.

## Evidence

- `.factory/polish-1.md` — finding-to-change-to-evidence closure map.
- `.factory/verification-4.md` — prior detailed verification evidence.
- `.factory/evidence/qa-live.json` — structured browser/flow/accessibility data.
- `.factory/evidence/verification-4-live-cold-desktop.png` and
  `.factory/evidence/verification-4-live-cold-mobile.png` — cold first-read.
- `.factory/evidence/live-mobile-demo.png` and
  `.factory/evidence/live-mobile-demo-text-200.png` — mobile and 200% text.
- `.factory/evidence/verification-4-lighthouse-home.json` — fresh Lighthouse.
- `.factory/evidence/polish-1-verify-url/` — post-deploy factory URL-verifier
  output and cold desktop/mobile screenshots.
- `.factory/evidence/qa-live.json` — post-deploy live browser, Axe, mobile,
  keyboard, storage, offline, and demo-isolation evidence.

## Reproduce

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
node .factory/evidence/qa-live.mjs
```

For the mandatory claims gate, run each `test` string from
`.factory/claims.json` individually. This artifact is static and has no server
API, sign-in, billing, package/CLI, or backend, so those checks are not applicable.

## Final deployment evidence

- The factory static deploy completed as deployment ID
  `db7bb30b-4029-49b9-a359-be16770c238b`.
- A fresh live Playwright/Axe run found zero Axe violations on `/`, `/demo`,
  `/game`, `/privacy`, and `/terms`; no console/page errors or cross-origin
  runtime requests occurred. The 390 px view had no overflow and no target
  below 44 px; at 200% text it remained 390 px wide. Offline `/demo` reload
  succeeded after first visit.
- The factory `verify-url.sh` check passed: HTTP 200, title, `lang=en`, one H1,
  main landmark, image alt text, no unlabeled buttons, and no console errors
  (`loadMs: 688`). The standalone Axe CLI could not locate a Chrome binary in
  this container even when pointed at the Playwright browser; the shipped
  Playwright Axe integration and the live `qa-live.mjs` Axe run are the passing
  accessibility evidence.
- Cold live `/?demo=1` had title **Demo — Number Motion Duet**, the persistent
  demo banner, reset/start-real controls, and seed rounds `3 steps` / `2 claps`.
  A live client navigation to `/privacy` updated title, canonical URL,
  description, Open Graph, and Twitter metadata and focused the H1. The sitemap
  lists all app routes; a missing route returns HTTP 404.
- Local and live SHA-256 values match: `index.html`
  `d92639f2ecf2db6afec03b22a553237700651c885b64ed3e3f469ef12e34c3de`,
  `sw.js` `060b8b0fae7077ca05f7ed72e07e10e79535b5bbee9ef4df03a8a8d5c9313d26`,
  and app JS `182d2ca913f383470e83ae0ccec58358d55232f7a8a936a042c20ade6120a543`.

## Known gaps and next steps

No known product, accessibility, privacy, routing, demo, or deployment gap remains.
