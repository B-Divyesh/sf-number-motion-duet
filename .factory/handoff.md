# Polish 4 handoff — Number Motion Duet

## Result

Release repair complete. Source repair commit: `cb91b2f` (`fix static 404
metadata coverage`), pushed to `origin/main` and deployed to
<https://number-motion-duet.sociobot.in>.

`F-4-1` is fixed: the actual static HTTP 404 now includes canonical, Open
Graph, Twitter, and Apple touch-icon metadata. The regression test requests a
missing route through the Static Web Apps emulator, and the live check confirms
the returned production document. Every older review and verifier finding was
also retested; `.factory/polish-4.md` maps each to its retained fix and proof.

## Verified

- Clean clone: `/tmp/number-motion-duet-polish4-D7lJVb`; `npm ci` completed
  with 0 vulnerabilities. Every exact claim command in `.factory/claims.json`
  passed separately (11/11). Typecheck, lint, the full browser suite (**24/24**),
  build, and `git diff --check` passed.
- Live cold recheck: the 390 px first screen shows the job, audience, sample
  action, and all three facts. The one-click demo and direct `?demo=1` show the
  isolated banner, sample rounds, reset, and Start for real. The real game
  remains empty until played.
- Live Playwright/Axe audit passed on `/`, `/demo`, `/game`, `/privacy`,
  `/terms`, and `/not-a-real-page`: no Axe violations, external requests, or
  app-route console/page errors. It also confirms offline demo reload,
  keyboard/focus flow, storage recovery, 390 px / 200% reflow, and reduced
  motion. See `.factory/evidence/qa-live.json`.
- The factory URL verifier passed: `.factory/evidence/polish-4-verify-url/`.
- Live mobile Lighthouse: Performance **98**, Accessibility **100**, Best
  Practices **100**, SEO **100**; FCP 0.9 s, LCP 1.3 s, TBT 180 ms, CLS 0.
  Report: `.factory/evidence/polish-4-lighthouse-home.json`.
- Build output remains inside the static budget: 13.77 kB JS (5.05 kB gzip),
  9.23 kB CSS (2.89 kB gzip), and 72.01 kB hero art.
- Local production bytes match the cold live responses: `index.html`
  `9079318efc573113850dd9d31a6f8081d89abfa20e61e993545fabaa28a85ec5`
  and `404.html`
  `f78498c5ba31f19ac884f420048167aa5427d64ced8681da3ca722d6c18e7468`.

## Reproduce

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

To deploy the built `dist/` directory through the configured work order:

```sh
swa deploy ./dist --env production --app-name sf-number-motion-duet
```

## Known gaps

None.
