# Pixel companion

The floating terrain in `MascotScene.tsx`, stepped toolkit emblems, and interactive architecture panels are original SVG/CSS artwork authored for this portfolio. They contain no third-party game artwork or branding. No additional downloaded assets or licenses were introduced by the redesign.

Original art: **Pet Cats Pack**, Cat 1, by **LuizMelo**.

- Source: https://luizmelo.itch.io/pet-cat-pack
- License: CC0 1.0 Universal, https://creativecommons.org/publicdomain/zero/1.0/
- Original author-provided license: `LICENSE.txt` in this directory.
- Retrieved: October 24, 2026.
- Original download: `Pet Cats Pack.zip`, public itch.io upload 14065011.

The local sheets are cropped from 50 × 50 to 32 × 32 per frame, keeping the original frame alignment. Their brown palette is remapped to muted lavender, preserving alpha and luminance. Idle, Walk, Run, Meow, Sleeping2, Stretching, Sitting, Laying, Licking 1, Licking 2, and Itch are used. These eleven source animations are packed directly into the locally served `cat-atlas.png`; intermediate sheets stay in memory and are not written to the public directory. Jump combines the Meow sheet with GSAP movement; it is not an additional animation supplied by the artist. Idle includes the artist’s existing small movements; no separate blinking sheet is claimed.

Sitting down and standing up reuse forward/reverse ranges of the Laying sheet. Additional sniffing, head tilts, kneading, fluff shakes, peeking, and tail-chasing gestures combine these existing frames with code-driven motion; they are not additional source animations supplied by the artist.

Waking now reverses Laying frames 7–4 so the sleeping silhouette rises into the same seated pose used by the standing bridge. The Stretching sheet is reserved for standing stretches; it is not used as a lying-to-sitting transition. Sprite placement anchors the artwork's ground row (22 of 32 pixels) to the scene floor at every responsive size.

Regenerate with `node scripts/prepare-assets.mjs "<extracted Pet Cats Pack directory>"` after downloading the pack from the author. No critical art is hotlinked. The interface’s pixel face mark and architecture illustration are original code-native graphics.
