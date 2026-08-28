# Polish 2 handoff — Number Motion Duet

## Result

Polish round 2 closes every finding in `.factory/review-2.md` and preserves the
handwritten lab-notebook visual system. The product repair is commit
`627a39f1b283b1d97b62f6948fe54c0063017f26`.

The production build was deployed directly to the configured Azure Static Web
App, `sf-number-motion-duet`, at
<https://number-motion-duet.sociobot.in>.

## Changes

- Rewrote all four README sentences flagged for jargon or length. They now use
  the visitor language “this browser,” “sample rounds,” and “new file names.”
- Replaced the abstract landing H2 with “Turn a number into claps or steps.”
- Kept the release-update claim registered while expressing it in plain words.
- Expanded `.factory/copy-audit.md` to cover every landing and README sentence.
- Added a browser regression test for the landing job, direct sample action,
  and revised turn-taking heading.

## Verification

From a clean clone at `/tmp/number-motion-duet-clean-KILRAO`:

- `npm ci` completed with 0 vulnerabilities.
- `npm run typecheck`, `npm run lint`, and `npm run build` passed.
- Every exact command in `.factory/claims.json` passed: 11/11.
- `npm test` passed: 22/22.

On the final checkout:

- `git diff --check`, `npm run typecheck`, `npm run lint`, `npm run build`, and
  `npm test` passed.
- The production build is 13.28 kB JavaScript (4.89 kB gzip), 9.20 kB CSS
  (2.88 kB gzip), and 72.01 kB original WebP art.
- Live Playwright + Axe audit: `/`, `/demo`, `/game`, `/privacy`, and `/terms`
  each returned 200 with one H1 and main landmark; Axe found zero violations;
  no console/page errors or external requests were recorded.
- Live mobile audit at 390 px found no horizontal overflow, no targets smaller
  than 44 px, and no overflow at 200% text. Reduced motion disabled animation.
- The live `/demo` offline reload worked after its first visit. `?demo=1`
  showed the persistent demo banner and Reset demo restored the seed. A missing
  route returned the styled 404 with HTTP 404.
- Mobile Lighthouse on the final live home page: performance 100,
  accessibility 100, best practices 100, SEO 100.

Evidence: `.factory/evidence/qa-live.json`,
`.factory/evidence/polish-2-cold-home-desktop.png`,
`.factory/evidence/polish-2-cold-home-mobile.png`, and
`.factory/evidence/lighthouse-polish-2-home.json`.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deploy `dist/` as a static Azure Static Web App. `public/staticwebapp.config.json`
is copied into that directory by the build.

## Known gaps

None.
