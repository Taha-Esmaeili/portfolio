# Implementation Plan: Personal Portfolio Website

**Branch**: `001-portfolio-page` | **Date**: 2026-08-28 | **Spec**: specs/001-portfolio-page/spec.md

**Input**: Feature specification from `/specs/001-portfolio-page/spec.md`

## Summary

Build a modern, performant, accessible personal portfolio website using **Astro + Tailwind CSS + TypeScript**. Content-driven architecture with structured data files. Static export to `dist/` for deployment on GitHub Pages/Netlify.

## Technical Context

**Language/Version**: TypeScript 5.x, Astro 4.x

**Primary Dependencies**:
- `astro` - Static site generator (islands architecture, zero-JS by default)
- `tailwindcss` - Utility-first CSS framework
- `@astrojs/tailwind` - Official integration
- `typescript` - Type safety
- `astro-icon` - SVG icon system
- `sharp` - Image optimization (Astro default)

**Storage**: File-based content (JSON/YAML in `src/content/`), no database

**Testing**: 
- Lighthouse CI for performance/accessibility
- Playwright for E2E visual regression
- TypeScript strict mode for type checking
- ESLint + Prettier for linting

**Target Platform**: Static hosting (GitHub Pages, Netlify, Vercel) — Node.js 20+ for build

**Project Type**: Static web application (Astro)

**Performance Goals**:
- LCP < 2.5s on 3G Fast
- Total JS < 50KB gzipped
- Lighthouse scores ≥ 95 all categories

**Constraints**:
- Zero runtime tracking/analytics
- No cookies/localStorage (except theme preference)
- CSP-compatible (no inline scripts/styles)
- Mobile-first responsive
- Print stylesheet required

**Scale/Scope**: Single page, ~6 sections, ~10-15 projects, ~20 skills, ~5 experience entries

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance | Notes |
|-----------|------------|-------|
| I. Static-First | ✅ | Astro static export |
| II. Modern Framework | ✅ | Astro + Tailwind + TS |
| III. Perf & A11y | ✅ | Lighthouse CI gates |
| IV. Content-Driven | ✅ | Content collections |
| V. Minimal Deps | ✅ | Minimal deps, no tracking |

All principles satisfied. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
portfolio/
├── public/
│   ├── fonts/           # Self-hosted fonts
│   ├── images/          # Static assets (favicon, og-image)
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── common/      # Button, Card, Section, Container
│   │   ├── layout/      # Header, Footer, Navigation
│   │   ├── sections/    # Hero, Projects, Skills, Experience, Contact
│   │   └── ui/          # ThemeToggle, Icon, Badge, Tooltip
│   ├── content/
│   │   ├── config.ts    # Content collections schema
│   │   ├── projects/    # Project .md/.json files
│   │   ├── skills/      # Skills data
│   │   ├── experience/  # Experience data
│   │   └── profile.json # Profile data
│   ├── layouts/
│   │   └── Base.astro   # Root layout with SEO, fonts, theme
│   ├── pages/
│   │   └── index.astro  # Main page (single-page app)
│   ├── styles/
│   │   ├── global.css   # Tailwind imports + custom properties
│   │   └── print.css    # Print stylesheet
│   ├── utils/
│   │   ├── theme.ts     # Theme detection/toggle logic
│   │   ├── scroll.ts    # Smooth scroll utilities
│   │   └── seo.ts       # Meta tag generators
│   └── types/
│       └── index.ts     # Shared TypeScript interfaces
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

**Structure Decision**: Option 2 (Web application) adapted for Astro static site. Single `src/pages/index.astro` with section components. Content collections for type-safe data.

## Complexity Tracking

No constitution violations. All design decisions align with principles.

## Phase 0: Research

- [ ] Evaluate Astro vs Vite+React for this use case (Astro wins for static content sites)
- [ ] Choose icon system (astro-icon with SVG sprites)
- [ ] Decide on image optimization strategy (Astro built-in + sharp)
- [ ] Research Tailwind v4 vs v3 (use stable v3 for now)

## Phase 1: Design & Data Model

- [ ] Define TypeScript interfaces for all entities (data-model.md)
- [ ] Create content collection schemas (contracts/)
- [ ] Design component hierarchy and props
- [ ] Create quickstart guide for local development
- [ ] Define CSS custom properties for theming

## Phase 2: Task Breakdown

- [ ] Generate tasks.md with implementation steps