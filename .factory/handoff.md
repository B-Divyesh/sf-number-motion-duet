# Number Motion Duet polish 1 handoff

## Result

**Repair staged for deployment.** This polish starts from candidate
`ca10fa5145f0e994f15e648bfafdbe6490965776` and closes the cumulative verifier
findings plus the controller requirements. The final cold live check and
deployment commit are recorded below once the static work-order deployment has
finished.

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
- The final live byte/hash comparison is pending the factory static deployment.

## Evidence

- `.factory/polish-1.md` — finding-to-change-to-evidence closure map.
- `.factory/verification-4.md` — prior detailed verification evidence.
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

No product-code gap remains. The only pending step is the required cold live
recheck after this repair commit deploys; this handoff will be updated with its
exact URL evidence and commit.
