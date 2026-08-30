# Taha Esmaeili — Portfolio

Personal portfolio website built with **Astro**, **Tailwind CSS**, and **TypeScript**, plus a React-based **admin panel** for editing content directly in the repo via the GitHub API.

**Live site**: https://tahaes.dev/portfolio/

## Features

- Single-page portfolio: Hero, Experience, Skills, Education, Certifications, Contact
- Content-driven — all data lives in `src/content/` as JSON files (validated by Zod schemas in `src/content.config.ts`)
- Dark/light theme with OS-preference detection and manual toggle (persisted)
- Smooth scrolling with scroll-spy navigation, reduced-motion support
- SEO: Open Graph / Twitter cards, JSON-LD (Person + WebSite), sitemap, robots.txt
- Print-friendly stylesheet
- Static output, zero runtime dependencies on the main site
- **Lighthouse: 100 / 100 / 100 / 100** (Performance / Accessibility / Best Practices / SEO)

## Project Structure

```text
/
├── public/              # Static assets (favicon, images, robots.txt, webmanifest)
├── src/
│   ├── components/      # Astro components (common/, layout/, sections/, ui/)
│   ├── content/         # JSON content: profile, skills/, experience/, education/,
│   │                    #   certifications/ (schemas in src/content.config.ts)
│   ├── layouts/         # Base layout (SEO meta, theme init, fonts)
│   ├── pages/           # index.astro (assembled single page)
│   ├── styles/          # global.css, print.css
│   ├── types/           # Shared TypeScript interfaces
│   └── utils/           # theme, scroll-spy, SEO helpers
├── admin/               # React (Vite) content-editor app → served at /admin
└── specs/               # Feature specs and task breakdown
```

## Commands

| Command                          | Action                                        |
| :------------------------------- | :-------------------------------------------- |
| `npm install`                    | Install dependencies                          |
| `npm run dev`                    | Start local dev server at `localhost:4321`    |
| `npm run build`                  | Build production site to `./dist/`            |
| `npm run preview`                | Preview the production build locally          |
| `npm run check`                  | Type-check (`astro check`) + lint             |
| `npm run lint`                   | ESLint over `src/`                            |
| `cd admin && npm run dev`        | Run the admin panel dev server                |
| `cd admin && npm run build`      | Build admin into `public/admin/`              |

## Content Management

Two ways to update content:

1. **Directly edit JSON** in `src/content/` — one file per item (`src/content/experience/arman.json`, etc.). Schemas are enforced at build time.
2. **Admin panel** at `/admin`:
   - Log in with a GitHub **fine-grained PAT** with *Contents: Read/Write* on this repo
   - Set a local PIN (hashed with SHA-256 and stored in your browser only)
   - Edit profile, skills, experience, education, certifications, hero, and contact content
   - Saving writes commits straight to the configured branch via the GitHub API

> ⚠️ The admin token lives in the browser and can write to the repo. Only use it on trusted devices.

## CI / Deployment

- **CI** (`.github/workflows/ci.yml`): `astro check` + ESLint + build on every push to `dev` and PRs
- **Deploy** (`.github/workflows/deploy.yml`): builds the admin panel and the site, deploys `dist/` to **GitHub Pages** on pushes to `dev`

## Customization

- **Colors/theme**: `tailwind.config.mjs` + CSS custom properties in `src/styles/global.css`
- **Navigation**: `navigation` array in `src/pages/index.astro`
- **Content**: JSON files in `src/content/` (schema changes in `src/content.config.ts`)

## 👀 Want to learn more about Astro?

Check the [Astro documentation](https://docs.astro.build).
