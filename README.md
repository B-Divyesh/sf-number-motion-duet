# Number Motion Duet

Number Motion Duet is a free, one-device movement game for caregivers and
preschoolers. An adult calls a number. A child answers with claps or steps.
Both see shape marks that show the amount.

Try the isolated sample game at `/demo` or `/?demo=1`.

## Who it is for

Caregivers who want early number play to be physical and cooperative. It is not
a solo drill app, camera tracker, online score board, or classroom tool.

## Use it

1. Pick claps or steps.
2. Tap a number and say it aloud.
3. Move together, then tap the completion button.

The game stores completed rounds in browser storage only. Demo rounds use a
separate `demo:` storage key. See [Privacy](/privacy) and [Terms](/terms).

## Develop and verify

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm run build` is the deployment build command. It creates `dist/` with
`index.html` at its root for Azure Static Web Apps. `npm test` builds the site,
serves it locally, and runs Playwright checks for the demo sandbox, keyboard
play, local storage separation, offline reload and update behavior, routes,
touch targets, and accessibility. The build hashes app assets and generates a
versioned service-worker cache so installed copies receive releases safely.

No remote fonts, analytics, trackers, or runtime third-party scripts are used.
The generated notebook illustration is original to this product; its prompt and
provenance are recorded in `.factory/design.md`.

## Project notes

- Static deploy target: `dist/`
- License: MIT, in [LICENSE](LICENSE)
- Demo details: `.factory/demo.md`
- Verifiable visitor claims: `.factory/claims.json`
