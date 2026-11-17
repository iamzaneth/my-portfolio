# Zaneth — Personal Portfolio

Personal website of Tran Thien Phuc, a Data Engineering student at Ho Chi Minh
City University of Technology and Engineering.

[Website](https://zaneth.vercel.app/) · [GitHub](https://github.com/iamzaneth)

React, TypeScript, Vite, Tailwind CSS and GSAP. Cosmic dark theme with midnight
and cobalt colors, continuous section gradients, a 3D identity card, project
dialogs and an animated 32×32 pixel tuxedo cat with golden eyes.

## Development

Use Node.js 22.12+ and pnpm 11.18.0. No backend or environment variables required.

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

```sh
pnpm run lint
pnpm run build
pnpm run preview
```

The production build is written to `dist/`.

## Content and assets

- `src/data/profile.ts`: profile, contact, navigation and CV link.
- `src/data/skills.ts`: skills.
- `src/data/projects.ts`: project cards and case studies.
- `src/styles/tokens.css`: shared palette and design tokens.
- `src/features/`: mascot, cosmic scenes, identity card and interactive features.
- `public/`: served images, CV, fonts, mascot atlas and licenses.
- `assets/source/`: editable avatar and mascot source files.

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
