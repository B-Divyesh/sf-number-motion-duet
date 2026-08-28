# Demo sandbox

Open `/demo` or `/?demo=1` for a one-click sample game. It starts with two
completed sample rounds and a ready-made four-clap call.

Demo state uses only the `demo:number-motion-duet:session` localStorage key.
Real play uses `number-motion-duet:session`, starts with no completed rounds,
and never reads the demo key. **Reset demo** deletes the demo key and loads the
sample again. **Start for real** deletes demo state before opening an empty
`/game`.

The service worker precaches the app shell and the sample illustration after the
first visit. Production JS, CSS, and illustration names are content-hashed; a
build-derived cache name removes prior Number Motion Duet caches on update. The
`/demo` flow can then be reloaded offline.
