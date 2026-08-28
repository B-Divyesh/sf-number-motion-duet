# Number Motion Duet repair handoff

## Repair scope

Repaired every finding in independent verification report
`a67f63b92aee919fd68b8106689e32d0d9b0301e` for candidate
`f34f2f58e9dcc58de9391c0ee742dfdee02fd19c`.

- Real `/game` now starts from an empty session (one-clap call, zero completed
  rounds). Only `/demo` creates the two sample rounds. Leaving demo removes its
  separate key before opening the empty real game.
- The `demo-isolated` claim now proves the visible empty state on a fresh real
  game and after **Start for real**, then proves that a new real round stores
  only that round.
- All saved browser state is checked before use. Invalid JSON or invalid motion
  state is discarded with an accurate recovery message; quantities are clamped
  to one through ten; singular `clap` and `step` copy is used.
- Header, footer, wordmark, and skip-link targets are at least 44 × 44 CSS px
  at 390 px width.
- Vite emits content-hashed JS, CSS, and illustration assets. The build writes
  a generated service worker whose cache ID hashes every precached file;
  activation deletes old Number Motion Duet caches before claiming clients.
- Static Web Apps now rewrites only the known SPA routes and returns the styled
  `404.html` with HTTP 404 for missing routes.

The original static-web artifact, demo behavior, local-only storage policy,
visual system, keyboard flow, and offline demo all remain intact.

## Verification evidence

Ran from a clean dependency install on 2026-08-28:

```sh
npm ci
npm test -- --grep @claim:demo-isolated
npm test -- --grep @claim:keyboard
npm test -- --grep @claim:local-game
npm test -- --grep @claim:offline-demo
npm run lint
npm test
npm run build
git diff --check
```

All four exact claim commands passed on their first invocation. Full Playwright:
**12 passed**. The suite covers desktop demo/real flows, keyboard Enter/Space,
390 × 844 layout, zero serious/critical axe violations, console errors, local
same-origin-only requests, offline reload after service-worker readiness,
generated service-worker cache upgrade behavior (including a changed precached
shell file receiving a new cache ID), and Static Web Apps 404 configuration.
`npm run lint` runs strict TypeScript checking. Package-consumer testing does
not apply to this static web product.

`npm run build` passed and produced `dist/index.html`. Current built sizes:
JavaScript 11.49 KB (4.42 KB gzip), CSS 8.91 KB (2.84 KB gzip), and hero image
72.01 KB. They are within the static product budgets. Axe is run through the
shipped `@axe-core/playwright` integration; this repository has no
`verify-url.sh` script.

Local mobile Lighthouse on `/demo`: Performance **100**, Accessibility **100**,
FCP **0.9 s**, LCP **0.9 s**, CLS **0**, and TBT **0 ms**.

## Deployment

Static deployment is triggered by pushing the committed `main` branch to the
configured GitHub remote. The post-push check verifies the deployed identity,
404 response, and cache headers after the deployment workflow completes.

## Known limits

- This remains an adult-and-child confirmation activity; it does not detect
  physical claps or steps.
- No account, sync, analytics, payment, camera, or online score is included.
