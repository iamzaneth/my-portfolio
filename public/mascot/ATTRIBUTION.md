# Pixel companion

Original motion and silhouette reference: **Pet Cats Pack**, Cat 1, by **LuizMelo**.

- Source: https://luizmelo.itch.io/pet-cat-pack
- License: CC0 1.0 Universal, https://creativecommons.org/publicdomain/zero/1.0/
- The original author-provided `LICENSE.txt` is preserved in this directory.
- Retrieved October 24, 2026; original public itch.io upload 14065011.

## Project artwork

The portfolio's native 64×64 frames are project-authored enhancements of the
original CC0 poses, rather than new artwork attributed to LuizMelo. They retain
the slender lavender character, frame ordering and footfall phases, with refined
contours, tail lighting, ears, eyes, muzzle, chest fur, paws and toe separations.
The palette contains 13 named colors and uses binary alpha. No interpolation,
random fur noise or runtime image generation is used.

The production sources are `assets/source/mascot/manifest.json` and its 65 editable
transparent PNGs. The manifest describes frame dimensions, row mappings, source
paths, palette, per-frame bounds and groundRow 44. The served `cat-atlas.png` is
832×704: 13 columns and 11 rows.

| Clip | Original sheet | Frames |
| --- | --- | ---: |
| idle | Idle | 10 |
| walk | Walk | 8 |
| run | Run | 8 |
| meow | Meow | 4 |
| sleep | Sleeping2 | 1 |
| wake | Stretching | 13 |
| sit | Sitting | 1 |
| lieDown | Laying | 8 |
| groom | Licking 1 | 5 |
| groomPaw | Licking 2 | 5 |
| scratch | Itch | 2 |

The source key `wake` denotes Stretching. Logical waking reverses Laying frames
7–4 into sitting; sitting/standing bridges use forward/reverse Laying ranges.
Jump and additional gestures combine these clips with GSAP movement and are not
additional animations supplied by the original artist.

## Reproduce and validate

```sh
pnpm run assets:cat        # Pack editable PNGs and generate catSprites.ts
pnpm run assets:cat:check  # Check source pixels and deterministic output
pnpm run assets:prepare    # Also prepare avatars and self-hosted fonts
pnpm run assets:cat:review # Optional contact sheet and pixel audit
```

No source-pack download, proprietary editor, API key or network access is needed.
Packing preserves every source RGBA byte, validates all frame counts and bounds,
and rejects undeclared colors, semitransparent pixels, empty cells, sinking
artwork and cells with insufficient native pixel detail. Optional review output
is disposable and goes under `artifacts/mascot/`.

Moon Garden's moon, mountains, plants, terrain, frame and Play toy are original
code-native SVG/CSS artwork. Font licenses remain separate in `public/fonts/`.
