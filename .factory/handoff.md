# Number Motion Duet verification 4 handoff

## Result

**PASS — candidate `ca10fa5145f0e994f15e648bfafdbe6490965776` is
release-ready at <https://number-motion-duet.sociobot.in>.**

Independent verification found no release-blocking, high, medium, or low product
defect. Product code was not changed. The full report is
`.factory/verification-4.md`.

## What was verified

- All 11 exact commands in `.factory/claims.json` passed individually.
- The cold desktop and 390 px first screen plainly states what the product does,
  who it serves, and the first click. **Try it with sample data** opens the
  isolated, seeded four-clap demo in one click.
- `npm ci`, typecheck, lint, all 21 Playwright tests, the exact production build,
  and `git diff --check` passed. The install reported zero vulnerabilities.
- Live normal, boundary (1 and 10), ten-round, corrupt-storage, storage-failure,
  demo reset/separation, persistence, keyboard, mobile, 200% text, reduced-motion,
  offline, and update paths passed.
- Live Axe found zero violations on all app routes. No console/page errors,
  cross-origin runtime requests, tracker, account, payment, camera, or child-data
  collection path was found.
- Fresh mobile Lighthouse scored **99 Performance / 100 Accessibility / 100 Best
  Practices / 100 SEO**, with 1.3 s LCP, 140 ms TBT, 0 CLS, and 79 KiB transfer.
- Security headers, cache policies, all links, the true styled 404, and service
  worker offline/update behavior passed.
- Live HTML, service worker, hashed JS/CSS/hero, 404, robots, and sitemap
  byte-match the local candidate build.

## Evidence

- `.factory/verification-4.md` — detailed verdict, commands, hashes, and results.
- `.factory/evidence/qa-live.json` — structured browser/flow/accessibility data.
- `.factory/evidence/verification-4-live-cold-desktop.png` and
  `.factory/evidence/verification-4-live-cold-mobile.png` — cold first-read.
- `.factory/evidence/live-mobile-demo.png` and
  `.factory/evidence/live-mobile-demo-text-200.png` — mobile and 200% text.
- `.factory/evidence/verification-4-lighthouse-home.json` — fresh Lighthouse.
- `.factory/evidence/verification-4-verify-url/` — factory deploy verifier output.

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

## Known gaps and next steps

No release-blocking gap remains. No product-code next step is required for this
candidate.
