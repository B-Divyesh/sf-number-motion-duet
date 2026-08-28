# Number Motion Duet

Number Motion Duet is a free, one-device movement game for caregivers and
preschoolers. An adult calls a number. A child answers with claps or steps.
Both see shape marks that show the amount.

Try the isolated sample game at `/demo` or `/?demo=1`.

## Who it is for

Caregivers who want early number play to be physical and cooperative.

## Use it

1. Pick claps or steps.
2. Tap a number and say it aloud.
3. Move together, then tap the completion button.

Completed rounds stay in this browser. Sample rounds stay separate from real
games. See [Privacy](/privacy) and [Terms](/terms).

## Develop and verify

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm run build` is the deployment build command. It creates `dist/` with
`index.html` at its root for Azure Static Web Apps. `npm test` builds the site
and runs browser tests. It checks the demo, keyboard, saved rounds, offline use,
routes, touch targets, and accessibility. Each release uses new file names, so
installed copies can update safely.

No remote fonts, analytics, trackers, or runtime third-party scripts are used.
The notebook illustration's prompt and provenance are recorded in
`.factory/design.md`.

## Project notes

- Static deploy target: `dist/`
- License: MIT, in [LICENSE](LICENSE)
- Demo details: `.factory/demo.md`
- Verifiable visitor claims: `.factory/claims.json`
