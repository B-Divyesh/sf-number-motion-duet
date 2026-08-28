# Number Motion Duet — visual thesis

## Direction

**Handwritten lab notebook.** This is a shared table activity, not a child-facing
quiz machine. The page should feel like a sturdy field notebook opened between an
adult and a child: warm paper, graphite marks, stamped shapes, and a clear place
to put a finger. The visual language supports turn-taking: the adult's prompt is
an ink note; the child's answer is a row of physical marks.

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#f7f1e4` | warm notebook page |
| `--paper-deep` | `#e9ddc5` | ruled-paper bands and inset areas |
| `--ink` | `#17263b` | primary text and outlines |
| `--muted` | `#526071` | supporting text |
| `--coral` | `#b83f4b` | adult call and primary action |
| `--ochre` | `#b86d17` | child motion marks |
| `--leaf` | `#256654` | correct confirmation |
| `--plum` | `#684c80` | non-colour shape cue and secondary detail |
| `--danger` | `#9f2635` | errors |

Ink on paper gives the default scheme a high-contrast, single-mode surface. State
always has a word and an icon/shape as well as a colour.

## Type, spacing, and shape

Display headings use the local `Georgia` serif stack for a friendly, handwritten
editorial rhythm. Body copy uses the local system UI sans stack for reliable
small-screen reading. No remote fonts are requested. Spacing follows an 8px
scale; the main page has 20px mobile padding and 48px desktop padding. Shapes are
slightly imperfect circles, squares, triangles, and rounded notebook tabs; thin
ink outlines replace generic shadows.

## Interaction and motion

The answer marks make one short 220ms upward "stamp" when a round is confirmed;
the current prompt gets a faint pencil underline. This shows a physical action
becoming a record. With reduced motion, the marks appear immediately and the
underline is static. There is no looping animation or colour-only instruction.

## Original art plan and provenance

Hero art: a flat-lay illustration of an open warm-paper lab notebook, wooden
counting tokens in circle/square/triangle shapes, small hand and adult pencil,
soft window light, no readable text. It explains that this is a shared table
activity. Generated through `/opt/fleet/lib/gen-image.sh` using the factory image
model on 2026-08-28; original product asset, no third-party license required.
Prompt sheet: tactile paper grain, navy graphite, muted coral/ochre/leaf accents,
gentle top-down 50mm lens, clean negative space; avoid text, logos, watermarks,
brand marks, real people, extra fingers, or busy toy-room backgrounds.

The generated hero is reviewed before inclusion, converted to WebP, and paired
with a hand-authored SVG social card and shape icons.
