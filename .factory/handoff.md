# Polish 3 handoff — Number Motion Duet

## Result

Released the zero-finding repair for candidate
`08a27f783d0e863c7966a10085b6111238b9632a`.

- Repair commit: `3b562bcbe7afd71225d5465c9dbbb2e686ee276c`
- Live URL: <https://number-motion-duet.sociobot.in>
- Deployment: `swa deploy ./dist --env production --app-name sf-number-motion-duet`

The repair puts every first-screen fact into the 390 px view, moves a new
route to its visible H1 while restoring scroll on Back, makes both 404 H1s
literal, and removes the untestable participation promise. The one-click,
isolated `/demo` and `?demo=1` flows, banner, reset, Start for real path,
claims registry, legal routes, metadata, true 404, privacy, and notebook visual
identity remain intact.

## Run and verify

```sh
npm ci
npm run typecheck
npm run lint
npm run build
npm test
```

For the sample game, open `/demo` or `/?demo=1`. The live deployment was
verified with `/opt/fleet/lib/verify-url.sh`, the checked-in Playwright + Axe
audit, and Lighthouse.

## Exact evidence

- Fresh clone `/tmp/number-motion-duet-clean-9CrJWy`: 0 npm vulnerabilities;
  all 11 exact claim commands from `.factory/claims.json` passed individually;
  then typecheck, lint, build, and Playwright passed with 24 tests.
- Final local/live SHA-256 pairs byte-match for `index.html`
  (`9079318e…28a85ec5`), app JS (`2c0081da…c66c5b48`), app CSS
  (`b4d63137…49a3a470`), and `sw.js` (`3d471f86…916f12703`).
- Live [`evidence/qa-live.json`](evidence/qa-live.json): all five app routes
  returned 200, the deliberate missing route returned 404, every scanned route
  had one H1/main and zero Axe violations, and the demo/offline/privacy/mobile
  flows passed with no external requests or browser errors. The expected
  browser network message for the HTTP-404 navigation is recorded separately;
  it is not a page error.
- Live mobile first screen: [`evidence/polish-3-live-first-screen-mobile.png`](evidence/polish-3-live-first-screen-mobile.png).
  All three facts end at 580 px in an 844 px viewport.
- Live basic page audit and screenshots:
  [`evidence/polish-3-verify-url`](evidence/polish-3-verify-url).
- Live Lighthouse: [`evidence/polish-3-lighthouse-home.json`](evidence/polish-3-lighthouse-home.json)
  reports 100/100/100/100 (performance/accessibility/best-practices/SEO),
  FCP 0.8 s, LCP 1.2 s, CLS 0, TBT 0 ms.

## Known gaps

None. There are no unresolved findings from the supplied review or earlier
review, polish, and verification records.
