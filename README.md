# Tran Thien Phuc Portfolio

Personal portfolio website for Tran Thien Phuc, showcasing my direction as a Data Analyst / AI Engineer, technical skills, featured project, and contact information.

Demo: [https://phuc-dev.vercel.app](https://phuc-dev.vercel.app)

## Overview

This project is a single-page application built with React, TypeScript, Vite, and Tailwind CSS. The interface is designed to be clean, modern, responsive, and easy to deploy on Vercel.

Main website sections:

- `Home`: short introduction, open-to-work status, avatar, contact CTA, and CV download.
- `About`: background in Data Engineering, Data Analysis, AI Engineering, and technical stack.
- `Projects`: featured project showcase, currently focused on NexTick.
- `Contact`: email, phone number, location, and social links.

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- Tailwind CSS 4
- Lucide React
- React Icons
- ESLint

## Features

- Dark mode interface with glassmorphism effects.
- Responsive layout for desktop, tablet, and mobile.
- Fixed navigation bar with a mobile menu.
- Smooth scrolling between page sections.
- Skill groups for Data Analysis, Database & Pipeline, AI & Mathematics, and Tools & Engineering.
- Project card with image, description, tech tags, GitHub link, and details link.
- Contact CTA via email and CV download from `public/cv.pdf`.

## Requirements

Vite 7 requires one of the following Node.js versions:

- Node.js `^20.19.0`
- Node.js `>=22.12.0`

npm is recommended because the project includes a `package-lock.json` file.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/iamzaneth/my-portfolio.git
cd my-portfolio
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

By default, Vite runs at:

```text
http://localhost:5173
```

## Scripts

```bash
npm run dev
```

Runs the local development server with Vite.

```bash
npm run build
```

Runs TypeScript checks and builds the production output into the `dist` directory.

```bash
npm run preview
```

Serves the production build locally for preview.

```bash
npm run lint
```

Runs ESLint across the project.

## Project Structure

```text
my-portfolio/
|-- public/
|   |-- avatar.png
|   |-- cv.pdf
|   `-- favicon.ico
|-- src/
|   |-- components/
|   |   |-- About.tsx
|   |   |-- Contact.tsx
|   |   |-- Hero.tsx
|   |   |-- Navbar.tsx
|   |   `-- Projects.tsx
|   |-- App.tsx
|   |-- index.css
|   `-- main.tsx
|-- eslint.config.js
|-- index.html
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
|-- tsconfig.app.json
|-- tsconfig.json
|-- tsconfig.node.json
`-- vite.config.ts
```

## Main Content

### Personal Profile

- Name: Tran Thien Phuc
- Target roles: Data Analyst / AI Engineer
- Interests: Data Analysis, AI Engineering, Applied Mathematics
- Location: Ho Chi Minh City, Vietnam

### Featured Project

**NexTick**

A real-time cryptocurrency candle streaming platform. The project ingests Binance trade ticks, streams data through Kafka, aggregates OHLCV candles, stores historical data in QuestDB, and visualizes real-time market updates with a React interface.

Main tech stack: Python, Kafka, QuestDB, NestJS, React, TypeScript, Docker.

Repository: [https://github.com/iamzaneth/NexTick](https://github.com/iamzaneth/NexTick)

## Deployment

This project is suitable for deployment on Vercel.

Recommended build settings:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Production demo: [https://phuc-dev.vercel.app](https://phuc-dev.vercel.app)

## Contact

- Email: [tthienphuc1612@gmail.com](mailto:tthienphuc1612@gmail.com)
- Phone: [+84 348 497 984](tel:+84348497984)
- GitHub: [Zaneth](https://github.com/iamzaneth)
- Facebook: [Thiên Phúc](https://www.facebook.com/zanethdr)