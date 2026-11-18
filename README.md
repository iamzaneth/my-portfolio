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
- `src/data/projects.ts`: the source of truth for project metadata and case studies. Adding a project creates its planet, technology relationships and accessible HTML selector. Every project remains in the overview; shared technologies have canonical nodes. Full case studies and technology stacks open on selection.
- `src/data/skills.ts`: real technology/discipline content.
- `src/features/universe/`: shared state, retained viewport, renderer, planet, data-driven project constellations, projected labels and fallback.
- `src/features/chapters/`: full-screen section navigation, wheel gesture grouping and accessible content readers.
- `src/features/projects/`: accessible project index, native Mission Control dialog and interactive architecture.
- `src/styles/tokens.css`: the common cosmic palette.

The section order is Home → About → Toolkit → Projects → Contact. Toolkit maps broad capabilities; Projects maps each real project to its own stack.

The 3D scene is lazy loaded. One fixed full-viewport canvas renders the global stars and nebula, the full-canvas hero planet, and a scoped Projects galaxy. The Home text is not an internal scroll region; compact spacing keeps shorter desktop chapters readable. Desktop chapters fill the viewport and group wheel gestures one section at a time; nested readers/dialogs retain their input. Mobile stays native. The experience respects reduced motion and automatically provides a static fallback when WebGL is unavailable. Core content and project controls remain usable when WebGL fails. Section/project hash links retain native navigation and browser history.

The graph follows Zaneth → Projects → Technologies. Deterministic spherical placement and collision spacing provide depth; shared technologies keep one canonical node connected to their projects. Drag rotates the camera within safe bounds without consuming wheel input. Project details are hidden by default. Selecting a world approaches its planet and opens Mission Control; closing returns to the overview. Scene-management buttons are intentionally omitted. All projects and their full stacks remain reachable through HTML controls. DPR limits, instancing and hidden-tab suspension control rendering cost.

Toolkit uses one full-width capability map. Each discipline opens a native dialog with its original technologies and practice notes, internal scrolling, Escape support and focus restoration.

## Ambient sky

The mouse comet reuses the demand-driven Canvas 2D ribbon and a small particle pool. It preserves the native pointer and is disabled for touch/coarse pointers and reduced motion.

The global Three.js environment caches five astronomical figures and pooled meteor geometry. Star coordinates and visual magnitudes come from [Bright Star Catalogue, CDS V/50](https://vizier.cfa.harvard.edu/viz-bin/VizieR?-source=V/50). The connecting figures are conventional illustrations, [not official IAU boundaries or line definitions](https://www.iau.org/IAU/IAU/Astronomy-FAQs/Constellations.aspx). The renderer preserves each figure's tangent-plane projection and varies only its overall placement, rotation, scale and appearance timing.

`SkyActivity.ts` measures DOM exclusion regions on layout changes; bounded placement skips crowded areas. Modal and navigation state suppress new events, and showers reduce constellation emphasis. Scheduling uses the existing active scene clock, so hidden tabs do not accumulate missed events. Reduced motion disables decorative effects and continuous scene animation.

Meteor timings live in `MeteorShowers.ts`: first shower after 25–55 active seconds, then 90–180 seconds between events; rare single meteors share the same pool. For local visual checks, `pnpm run dev` with `/?skyPreview=1` shortens shower delays to 2–4 seconds initially and 7–12 seconds thereafter. This switch is guarded by `import.meta.env.DEV` and is inactive in production. Events may contain fewer meteors, or be skipped, when no safe path exists.

## Preserved source assets

The original mascot is no longer mounted. Its source assets and license documentation are preserved. The portrait identity card and existing project case-study content remain active.

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
