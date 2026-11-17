# Zaneth — A Universe of Engineering

The portfolio of Tran Thien Phuc, a Data Engineering student at Ho Chi Minh City University of Technology and Engineering. A cinematic Three.js planet introduces the identity. A normalized, volumetric knowledge graph connects one Zaneth root to real projects and canonical shared technologies.

[Website](https://zaneth.vercel.app/) · [GitHub](https://github.com/iamzaneth)

React 19, TypeScript, Vite, Tailwind CSS, GSAP and Three.js. The existing Vercel deployment architecture is unchanged.

## Development

Use Node.js 22.12+ and pnpm 11.18.0. No backend or environment variables are required.

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

```sh
pnpm run typecheck
pnpm run lint
pnpm run build
pnpm run preview
```

The production build is written to `dist/`.

## Content and architecture

- `src/data/profile.ts`: profile, contact links and navigation.
- `src/data/projects.ts`: the source of truth for project metadata and case studies. Adding a project creates its main hub, technology nodes and HTML selector. Every project remains in the overview. Shared technologies have canonical nodes; large stacks use secondary-node disclosure, with the complete stack always available in HTML.
- `src/data/skills.ts`: real technology/discipline content.
- `src/features/universe/`: shared state, retained viewport, renderer, planet, data-driven project constellations, projected labels and fallback.
- `src/features/chapters/`: full-screen section navigation, wheel gesture grouping and accessible content readers.
- `src/features/projects/`: readable cards, native project dialog and interactive architecture.
- `src/styles/tokens.css`: the common cosmic palette.

The section order is Home → About → Toolkit → Projects → Contact. Toolkit maps broad capabilities; Projects maps each real project to its own stack.

The 3D scene is lazy loaded. One fixed full-viewport canvas renders the global stars and nebula, then transparent local views for the hero and knowledge graph. Desktop chapters fill the viewport and group wheel gestures one section at a time; nested readers/dialogs retain their input. Mobile stays native. The experience respects reduced motion and supports a still view. Core content and project controls remain usable when WebGL fails. Section/project hash links retain native navigation and browser history.

The graph follows Zaneth → Projects → Technologies. Deterministic spherical placement and collision spacing provide depth; shared technologies keep one canonical node connected to their projects. Drag rotates the camera, with explicit zoom, side-view and reset controls. All projects and their full stacks remain reachable through HTML controls. DPR limits, instancing and hidden-tab suspension control rendering cost.

## Preserved source assets

The original mascot and cursor are no longer mounted in the redesigned application. Their source assets and license documentation are preserved. The portrait identity card and existing project case-study content remain active.

The mascot renders 65 transparent 32×32 frames from editable 64×64 sources
with a shared 19-color palette. Nearest-neighbor reduction keeps pixel edges
crisp without changing the animation timing, frame counts or on-page size.
Tiny golden eye pixels are retained when they fall between reduction samples.
`assets/source/mascot/manifest.json` defines animation rows, frame bounds and
the source ground reference (44) and production frame size (32). Keep source
PNG dimensions, palette and binary alpha intact;
update bounds in the manifest after changing a frame.

```sh
pnpm run assets:cat        # Rebuild the atlas and TypeScript sprite catalog
pnpm run assets:cat:check  # Verify sources and generated output
pnpm run assets:prepare    # Also rebuild avatar derivatives and local fonts
```

The mascot atlas is 416×352, with a production ground reference of 22.
Original motion credits and license details are in
[ATTRIBUTION.md](public/mascot/ATTRIBUTION.md). Font licenses are in `public/fonts/`.
