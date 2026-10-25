# Personal Portfolio

The personal website of **Tran Thien Phuc (Zaneth)**, a Data Engineering student exploring AI, data systems, and software development.

**[Live Website](https://zaneth.vercel.app)** · [GitHub Profile](https://github.com/iamzaneth)

## Overview

An interactive portfolio showcasing selected projects, technical skills, and interests in Data Science, Artificial Intelligence, and Software Development. About, Toolkit, Selected Work, and Contact sections introduce my background and the systems I am building.

## Features

- Responsive layouts with a midnight-navy theme, lavender accents, and self-hosted typography.
- Animated introductions, scroll-triggered section reveals, and a project pipeline illustration.
- An interactive pixel cat with Pet, Play, and Nap/Wake controls.
- Project cards with technology summaries, source code links, and project documentation.
- Sticky section navigation, active-section indicators, and an animated mobile menu.
- Keyboard navigation, visible focus states, a skip link, and support for system reduced-motion preferences.
- Email and social links, with a copy-email button and status feedback.

## Tech Stack

| Category | Technologies |
| --- | --- |
| UI | React 19 |
| Language | TypeScript 5 |
| Development & build | Vite 7, npm |
| Styling | Tailwind CSS 4, PostCSS, custom CSS |
| Animation | GSAP 3, ScrollTrigger, `@gsap/react`, CSS sprite animation |
| Icons & fonts | Lucide React, Manrope, IBM Plex Mono |
| Code quality & testing | ESLint, Playwright, axe-core |
| Hosting | Vercel |

## Getting Started

Use **Node.js 22.12 or later** and **npm**. Dependencies are pinned in `package-lock.json`.

Clone the repository, install dependencies, and start the development server:

```sh
git clone https://github.com/iamzaneth/my-portfolio.git
cd my-portfolio
npm ci
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`. No environment variables or backend service are required.

Build for production and preview the result locally:

```sh
npm run build
npm run preview
```

The build runs TypeScript checks and writes the static site to `dist/`.

Additional checks:

```sh
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser suite starts a production preview server and checks responsive layouts, accessibility, navigation, and mascot interactions.

On Windows PowerShell, use `npm.cmd` and `npx.cmd` if execution policy blocks the corresponding `.ps1` scripts.

## Project Structure

```text
public/            Static images, fonts, and mascot assets
src/
  animations/      Page introductions and scroll effects
  components/      Navigation and page sections
  data/            Profile, skills, and project content
  features/
    mascot/        Pixel cat controls, state, and animation
    projects/      Project cards and pipeline illustration
  hooks/           Motion preference handling
  styles/          Theme tokens, utilities, and custom CSS
  types/           Shared TypeScript types
  App.tsx          Page composition
scripts/           Asset preparation
tests/             Playwright browser checks
```

To update portfolio content, edit [`profile.ts`](src/data/profile.ts), [`skills.ts`](src/data/skills.ts), and [`projects.ts`](src/data/projects.ts).

## Contact

- GitHub: [@iamzaneth](https://github.com/iamzaneth)
- Email: [zaneth.dev@gmail.com](mailto:zaneth.dev@gmail.com)

Pixel cat artwork credits and licensing are documented in [`public/mascot/ATTRIBUTION.md`](public/mascot/ATTRIBUTION.md). Font licenses are included in [`public/fonts/`](public/fonts/).
