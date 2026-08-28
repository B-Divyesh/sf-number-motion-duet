# Number Motion Duet independent verification handoff

## Result

**FAIL — candidate `771f9e7712adee2f36de8bf1374b2eeb3a15d84f` is not release-ready.**

Fresh QA was performed on 2026-08-28 against
https://number-motion-duet.sociobot.in and the clean candidate checkout. The
deployed `index.html`, hashed JS/CSS, hero, and service worker exactly match the
local production build, so this is not the previously reported deployment-only
condition.

The full evidence and remediation detail are in
[`.factory/verification-2.md`](verification-2.md). Release blockers are:

1. Live and README claims exist outside the mandatory `.factory/claims.json` registry.
2. Browser-storage write failure silently prevents round completion; storage-delete failure breaks demo exit/reset.
3. Demo controls are 35 px high instead of the required 44 px.
4. Quantity selection drops keyboard focus to `<body>`.
5. At 200% text size on a 390 px viewport, content expands to 619 px wide.

Low-severity route issues remain: non-home routes keep the home canonical URL,
`sitemap.xml` omits `/game`, and the static 404 does not use the required full
header/footer skeleton.

## Verification summary

- Required post-install claim commands: **4 passed**.
- Full Playwright suite: **12 passed**.
- `npm run lint`: **passed**.
- `npm run build`: **passed**, with `dist/` produced.
- Live axe: **0 serious/critical and 0 total violations** on every app route and 404.
- Live mobile Lighthouse `/`: **99 performance, 100 accessibility, 100 best practices, 100 SEO**; LCP 1.2 s, CLS 0.
- Live mobile Lighthouse `/demo`: **100/100/100/92**; the SEO loss is the invalid home canonical.
- Offline reload and generated service-worker update tests: **passed**.
- Outbound runtime requests: **none outside the product origin**.
- API rate limiting, Entra sign-in, and package consumer checks: **not applicable** to this static, account-free product.

## Reproduce

```sh
npm ci
npm test -- --grep @claim:demo-isolated
npm test -- --grep @claim:keyboard
npm test -- --grep @claim:local-game
npm test -- --grep @claim:offline-demo
npm run lint
npm test
npm run build
node .factory/evidence/qa-live.mjs
```

No product code was modified during verification. QA artifacts are under
`.factory/evidence/`.
