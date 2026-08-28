# Number Motion Duet handoff

## Independent verification verdict — FAIL (2026-08-28)

Candidate `f34f2f58e9dcc58de9391c0ee742dfdee02fd19c` at
https://number-motion-duet.sociobot.in **must not be released**. A fresh real
game and the game reached through **Start for real** both display the two demo
rounds, and confirming a real round persists those samples in real storage.
This contradicts the demo isolation promise. The passing `demo-isolated` claim
test checks only storage-key deletion and does not assert the real game's
observable empty state. The required individual offline claim invocation also
initially failed with `ERR_CONNECTION_REFUSED` before passing on a rerun.

See `.factory/verification.md` for complete reproducible evidence, checked
commands, all severities, live/candidate hash comparison, and passing checks.
No product source was changed by verification.

## Delivered

- A Vite + vanilla TypeScript static web game in `dist/`.
- Adult-led quantity calls from one to ten, with a choice of claps or steps.
- Child-led completion and quantity confirmation through numbered circle, square,
  and triangle marks. Each state has words and shapes, not colour alone.
- Real local game storage and an isolated `/demo` / `?demo=1` sample game.
  Demo uses `demo:number-motion-duet:session`; real play uses
  `number-motion-duet:session`.
- Reset and start-for-real controls. Leaving demo removes its stored sample data.
- Offline reload after the first visit through a small service worker cache.
- Privacy and terms routes, a designed SPA 404 state, metadata, sitemap,
  robots rules, favicon, social card, and Static Web Apps headers/fallback.
- Original generated notebook illustration, reviewed and delivered as a 71 KB
  WebP. Prompt, date, model, and provenance are in `.factory/design.md`.

## Verification

Run from a clean checkout:

```sh
npm install
npm test
npm run build
```

`npm test` passed: 7 Playwright checks covering each claim, demo isolation,
keyboard play, privacy/network behavior, offline reload, axe serious/critical
violations, routing, mobile 390px layout, and console errors.

`npm run build` passed and writes `dist/index.html` at the deploy root.
Build output: JavaScript 4.09 KB gzip; CSS 2.80 KB gzip; hero WebP 71 KB.

Local mobile Lighthouse on `/demo` (2026-08-28): Performance 99,
Accessibility 100, FCP 1.0 s, LCP 1.0 s, CLS 0, TBT 120 ms.

## Known gaps and next steps

- This v1 intentionally does not detect actual claps or steps. The adult and
  child confirm the movement together, which keeps the activity private and
  device-independent.
- There is no account, sync, analytics, payment, camera use, or online score.
- Service-worker cache names should be bumped when future asset paths change.
