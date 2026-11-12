# Pixel companion credits

Original motion and silhouette reference: **Pet Cats Pack**, Cat 1, by **LuizMelo**.

- Source: https://luizmelo.itch.io/pet-cat-pack
- License: CC0 1.0 Universal, https://creativecommons.org/publicdomain/zero/1.0/
- Original author-provided license: `LICENSE.txt` in this directory.
- Retrieved October 24, 2026; original public itch.io upload 14065011.

The tuxedo artwork was redrawn using the built-in Imagegen tool with the previous
project atlas as a pose reference, then normalized into a shared 19-color palette
with binary alpha. The character has a black coat, white chest/muzzle/socks,
pink ears and golden yellow eyes. This new artwork is not attributed to LuizMelo.

The 65 editable frames and `manifest.json` are in `assets/source/mascot/`.
Production frames are 64×64; the served atlas is 832×704 (13 columns × 11 rows).
The website uses no runtime image generation or recolor filter.

Animation frame counts: idle 10, walk 8, run 8, meow 4, sleep 1, stretch (`wake`)
13, sit 1, lieDown 8, groom 5, groomPaw 5, scratch 2. Logical waking reverses
lieDown frames; additional gestures combine these clips with GSAP movement.

Moon Garden's scenery and controls are original SVG/CSS artwork. Font licenses
are retained separately in `public/fonts/`. Asset build commands are documented
in the root README.
