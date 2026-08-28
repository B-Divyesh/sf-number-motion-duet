# Demo sandbox

Open `/demo` or `/?demo=1` for a one-click sample game. It starts with two
completed sample rounds and a ready-made four-clap call.

Demo state uses only the `demo:number-motion-duet:session` localStorage key.
Real play uses `number-motion-duet:session`, and the game never reads that key
while the demo banner is present. **Reset demo** deletes the demo key and loads
the sample again. **Start for real** deletes demo state before opening `/game`.

The service worker caches the app shell and the sample illustration after the
first visit. The `/demo` flow can then be reloaded offline.
