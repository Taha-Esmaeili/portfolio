# Quickstart: Personal Portfolio Website

**Branch**: `001-portfolio-page` | **Date**: 2026-08-28

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+ or pnpm 9+
- Git

## Installation

```bash
# Clone and navigate
cd portfolio

# Install dependencies
npm install

# Or with pnpm
pnpm install
```

## Development

```bash
# Start dev server (http://localhost:4321)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview

# Type check
npm run typecheck

# Lint
npm run lint

# Format
npm run format
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── content/          # Content collections (type-safe data)
├── layouts/          # Page layouts (Base.astro)
├── pages/            # Route pages (index.astro)
├── styles/           # Global styles (Tailwind + custom)
├── utils/            # Helper functions
└── types/            # Shared TypeScript types
```

## Adding Content

### Profile
Edit `src/content/profile.json` with your information.

### Projects
Add JSON files to `src/content/projects/`:
```json
{
  "id": "unique-id",
  "title": "Project Name",
  "description": "Full description...",
  "shortDescription": "Brief card preview",
  "image": "/images/projects/your-image.jpg",
  "techStack": ["React", "TypeScript"],
  "liveUrl": "https://...",
  "codeUrl": "https://github.com/...",
  "featured": true,
  "startDate": "2024-01-01T00:00:00Z",
  "category": "web"
}
```

### Skills
Add to `src/content/skills/`:
```json
{
  "id": "react",
  "name": "React",
  "category": "frontend",
  "proficiency": 5,
  "yearsExperience": 4,
  "icon": "react",
  "relatedProjects": ["project-1", "project-2"]
}
```

### Experience
Add to `src/content/experience/`:
```json
{
  "id": "job-1",
  "company": "Company Name",
  "role": "Senior Developer",
  "location": "Remote",
  "startDate": "2022-01-01T00:00:00Z",
  "current": true,
  "achievements": [
    "Led team of 5 developers...",
    "Reduced build time by 40%...",
    "Implemented CI/CD pipeline..."
  ],
  "techStack": ["React", "AWS", "TypeScript"]
}
```

## Images

Place images in `public/images/`:
- `public/images/avatar.jpg` — Profile photo
- `public/images/projects/*.jpg` — Project screenshots
- `public/images/companies/*.svg` — Company logos
- `public/images/og-image.jpg` — Social sharing image (1200x630)

## Deployment

### GitHub Pages
1. Enable Pages in repo settings (source: GitHub Actions)
2. Push to main — workflow deploys automatically

### Netlify
1. Connect repo
2. Build command: `npm run build`
3. Publish directory: `dist`

### Vercel
1. Import project
2. Framework preset: Astro
3. Deploy

## Customization

### Theme Colors
Edit `tailwind.config.mjs` → `theme.extend.colors`

### Fonts
Add font files to `public/fonts/` and update `src/styles/global.css`

### Sections
Modify `src/pages/index.astro` to add/remove/reorder sections

## Scripts Reference

| Command | Description |
|---------|-------------|
| `dev` | Start development server |
| `build` | Production build to `dist/` |
| `preview` | Preview production build |
| `typecheck` | Run TypeScript compiler |
| `lint` | Run ESLint |
| `format` | Format with Prettier |
| `check` | Run typecheck + lint |