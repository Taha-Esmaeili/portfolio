# Implementation Tasks: Personal Portfolio Website

**Branch**: `001-portfolio-page` | **Date**: 2026-08-28

## Task Breakdown

### Phase 0: Project Setup & Configuration

- [ ] **T001**: Initialize Astro project with TypeScript and Tailwind
  - Run `npm create astro@latest -- --template minimal --typescript strict --install`
  - Install `@astrojs/tailwind`, `astro-icon`, `sharp`
  - Configure `astro.config.mjs` with integrations

- [ ] **T002**: Configure Tailwind CSS v3
  - Create `tailwind.config.mjs` with content paths, theme extensions
  - Set up CSS custom properties for theming (light/dark)
  - Configure dark mode: `class` strategy

- [ ] **T003**: Set up TypeScript strict config
  - Extend `astro/tsconfigs/strict` in `tsconfig.json`
  - Enable `strictNullChecks`, `noUncheckedIndexedAccess`
  - Configure path aliases (`@/*`, `@components/*`, etc.)

- [ ] **T004**: Configure ESLint + Prettier
  - Install `eslint`, `prettier`, `eslint-plugin-astro`, `eslint-plugin-tailwindcss`
  - Create `.eslintrc.json` with Astro/TypeScript rules
  - Create `.prettierrc` with consistent formatting

- [ ] **T005**: Set up content collections
  - Create `src/content/config.ts` with schemas (per data-model.md)
  - Create `src/types/index.ts` with shared interfaces
  - Add sample data files for profile, projects, skills, experience

### Phase 1: Core Layout & Theme System

- [ ] **T006**: Create base layout (`src/layouts/Base.astro`)
  - HTML5 doctype, lang attribute, viewport meta
  - SEO meta tags (title, description, OG, Twitter, JSON-LD)
  - Font preloads, favicon, theme-color meta
  - Theme initialization script (inline, CSP-compatible)
  - Slot for page content

- [ ] **T007**: Implement theme system (`src/utils/theme.ts`)
  - `getInitialTheme()`: OS preference → localStorage → default
  - `applyTheme(theme)`: Sets `data-theme` on `<html>`
  - `toggleTheme()`: Cycles light/dark, persists to localStorage
  - CSS custom properties for all theme colors

- [ ] **T008**: Create global styles (`src/styles/global.css`)
  - `@tailwind base; @tailwind components; @tailwind utilities;`
  - CSS custom properties for colors, spacing, typography
  - Fluid typography with `clamp()`
  - Focus-visible styles for accessibility
  - Reduced motion media query
  - Print stylesheet import

- [ ] **T009**: Create print stylesheet (`src/styles/print.css`)
  - Hide navigation, theme toggle, animations
  - Show all section content
  - Optimize typography for print
  - Page break controls

### Phase 2: Reusable Components

- [ ] **T010**: Create common components
  - `Container.astro` — Max-width wrapper with padding
  - `Section.astro` — Semantic section with id, heading, spacing
  - `Button.astro` — Variants (primary, secondary, ghost), sizes, loading state
  - `Card.astro` — Image, title, description, tags, actions
  - `Badge.astro` — Tech stack tags, proficiency indicators

- [ ] **T011**: Create UI components
  - `Icon.astro` — Wrapper for astro-icon with size, a11y props
  - `ThemeToggle.astro` — Button with sun/moon icons, keyboard accessible
  - `Tooltip.astro` — CSS-only tooltip for skill proficiency
  - `ScrollSpy.astro` — IntersectionObserver for active nav highlighting

- [ ] **T012**: Create layout components
  - `Header.astro` — Logo, navigation links, theme toggle
  - `Footer.astro` — Copyright, social links, back-to-top
  - `Navigation.astro` — Smooth scroll links, active state

### Phase 3: Section Components

- [ ] **T013**: Hero section (`src/components/sections/Hero.astro`)
  - Profile image (optimized with Astro `<Image />`)
  - Name, title, tagline, bio
  - Primary CTAs (View Projects, Contact)
  - Social link icons
  - Responsive: stacked on mobile, side-by-side on desktop
  - Entrance animation (respects `prefers-reduced-motion`)

- [ ] **T014**: Projects section (`src/components/sections/Projects.astro`)
  - Filter tabs: All / Featured / Web / Mobile / etc.
  - Responsive grid (1 col mobile, 2 tablet, 3 desktop)
  - Project cards with image, title, short description, tech badges
  - Links: Live Demo (external), Source Code (external)
  - Lazy load images below fold
  - Empty state for no projects

- [ ] **T015**: Skills section (`src/components/sections/Skills.astro`)
  - Grouped by category with section headers
  - Visual proficiency: 5 dots/bars per skill
  - Tooltip on hover/focus: years experience, related projects
  - Icon per skill (from icon library)
  - Responsive: 2-3 columns on desktop, 1 on mobile

- [ ] **T016**: Experience section (`src/components/sections/Experience.astro`)
  - Vertical timeline with connecting line
  - Company logo, role, location, dates
  - Expandable achievements (3-5 bullets)
  - Current role indicator
  - Tech stack tags per role
  - Mobile: timeline line on left, cards stacked

- [ ] **T017**: Contact section (`src/components/sections/Contact.astro`)
  - Email link with `mailto:` and pre-filled subject
  - Social links (GitHub, LinkedIn, etc.) with icons
  - Optional: Netlify Forms / Formspree contact form
  - Success/error toast messages
  - hCaptcha / Turnstile if form included (privacy-friendly)

### Phase 4: Main Page Assembly & Polish

- [ ] **T018**: Assemble main page (`src/pages/index.astro`)
  - Import and compose all sections in order
  - Pass content from collections to sections
  - Add JSON-LD structured data (Person + WebSite)
  - Ensure proper heading hierarchy (h1 → h2 → h3)

- [ ] **T019**: Implement smooth scroll & scroll spy
  - CSS `scroll-behavior: smooth` (respects reduced motion)
  - IntersectionObserver for active nav highlighting
  - Offset for fixed header

- [ ] **T020**: Optimize images
  - Configure Astro image optimization (sharp)
  - Add blur placeholders for project images
  - Proper `alt` text for all images
  - WebP/AVIF conversion, responsive sizes

- [ ] **T021**: Add SEO & metadata
  - Dynamic title/description from profile
  - Open Graph tags (og:title, og:description, og:image, og:type)
  - Twitter Card tags
  - JSON-LD Person and WebSite schemas
  - Sitemap generation (`@astrojs/sitemap`)
  - robots.txt

### Phase 5: Testing & Quality Gates

- [ ] **T022**: TypeScript type checking
  - Run `npm run typecheck` — zero errors
  - Verify content collection types inferred correctly

- [ ] **T023**: Linting & formatting
  - Run `npm run lint` — zero errors/warnings
  - Run `npm run format` — consistent formatting

- [ ] **T024**: Lighthouse CI (local)
  - Run `npm run build && npx lighthouse http://localhost:4321 --output=json`
  - Verify Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95

- [ ] **T025**: Cross-browser testing
  - Test in Chrome, Firefox, Safari (latest 2 versions)
  - Verify mobile viewports (320px, 375px, 768px, 1024px)
  - Test keyboard navigation, screen reader (NVDA/VoiceOver)

- [ ] **T026**: Accessibility audit
  - Run `npm run build && npx @axe-core/cli http://localhost:4321`
  - Zero critical/serious violations
  - Verify heading hierarchy, landmarks, focus management

- [ ] **T027**: Performance verification
  - Bundle size analysis: `npm run build && npx astro-bundle-analyzer`
  - JS < 50KB gzipped
  - LCP < 2.5s on 3G Fast (DevTools throttling)

### Phase 6: Deployment & Documentation

- [ ] **T028**: Configure GitHub Actions for CI/CD
  - `.github/workflows/ci.yml` — typecheck, lint, build, lighthouse
  - `.github/workflows/deploy.yml` — deploy to GitHub Pages on main

- [ ] **T029**: Create README.md
  - Project overview, tech stack
  - Quickstart commands
  - Content management guide
  - Deployment instructions
  - Customization guide

- [ ] **T030**: Final verification
  - Production build succeeds
  - Deploy to staging (Netlify preview / GitHub Pages)
  - Verify all user stories from spec.md pass
  - Document any deviations from spec in DECISIONS.md

## Task Dependencies

```
T001 → T002 → T003 → T004 → T005
T005 → T006 → T007 → T008 → T009
T009 → T010 → T011 → T012
T012 → T013, T014, T015, T016, T017 (parallel)
T013-017 → T018 → T019 → T020 → T021
T021 → T022, T023, T024, T025, T026, T027 (parallel)
T027 → T028 → T029 → T030
```

## Estimated Effort

| Phase | Tasks | Est. Hours |
|-------|-------|------------|
| 0: Setup | 5 | 2-3 |
| 1: Core | 4 | 3-4 |
| 2: Components | 3 | 4-5 |
| 3: Sections | 5 | 6-8 |
| 4: Assembly | 4 | 3-4 |
| 5: Testing | 6 | 4-5 |
| 6: Deploy | 3 | 2-3 |
| **Total** | **30** | **24-32** |