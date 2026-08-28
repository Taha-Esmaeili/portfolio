# Data Model: Personal Portfolio Website

**Branch**: `001-portfolio-page` | **Date**: 2026-08-28

## TypeScript Interfaces

```typescript
// src/types/index.ts

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatar: string;          // Path to image in public/images/
  email: string;
  location: string;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'website' | 'custom';
  url: string;
  label: string;
  icon?: string;           // Custom icon name from icon library
}

export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;    // For card preview
  image: string;               // Path to image in public/images/projects/
  techStack: string[];         // e.g., ['React', 'TypeScript', 'Tailwind']
  liveUrl?: string;
  codeUrl?: string;
  featured: boolean;
  startDate: string;           // ISO date
  endDate?: string;            // ISO date or 'present'
  category: 'web' | 'mobile' | 'cli' | 'library' | 'other';
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'tools' | 'languages' | 'testing' | 'design';
  proficiency: 1 | 2 | 3 | 4 | 5;  // 1=Beginner, 5=Expert
  yearsExperience: number;
  icon?: string;               // Icon name from icon library
  relatedProjects?: string[];  // Project IDs
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;           // ISO date
  endDate?: string;            // ISO date or 'present'
  current: boolean;
  achievements: string[];      // 3-5 bullet points
  logo?: string;               // Path to logo in public/images/companies/
  techStack?: string[];        // Technologies used in this role
}

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  themeColor: string;
  author: string;
}
```

## Content Collections Schema (Astro)

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const profile = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    title: z.string(),
    tagline: z.string(),
    bio: z.string(),
    avatar: z.string(),
    email: z.string().email(),
    location: z.string(),
    socialLinks: z.array(z.object({
      platform: z.enum(['github', 'linkedin', 'twitter', 'email', 'website', 'custom']),
      url: z.string().url(),
      label: z.string(),
      icon: z.string().optional(),
    })),
  }),
});

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    shortDescription: z.string().max(200),
    image: z.string(),
    techStack: z.array(z.string()),
    liveUrl: z.string().url().optional(),
    codeUrl: z.string().url().optional(),
    featured: z.boolean(),
    startDate: z.string().datetime(),
    endDate: z.string().optional(),
    category: z.enum(['web', 'mobile', 'cli', 'library', 'other']),
  }),
});

const skills = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    category: z.enum(['frontend', 'backend', 'devops', 'tools', 'languages', 'testing', 'design']),
    proficiency: z.number().min(1).max(5),
    yearsExperience: z.number().min(0),
    icon: z.string().optional(),
    relatedProjects: z.array(z.string()).optional(),
  }),
});

const experience = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    company: z.string(),
    role: z.string(),
    location: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().optional(),
    current: z.boolean(),
    achievements: z.array(z.string()).min(3).max(5),
    logo: z.string().optional(),
    techStack: z.array(z.string()).optional(),
  }),
});

export const collections = { profile, projects, skills, experience };
```

## JSON-LD Structured Data

```typescript
// Generated for Person and WebSite schemas
interface PersonSchema {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  jobTitle: string;
  url: string;
  image: string;
  email: string;
  worksFor?: {
    '@type': 'Organization';
    name: string;
  };
  sameAs: string[];
  knowsAbout: string[];
}

interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  author: PersonSchema;
}
```

## Content File Examples

### `src/content/profile.json`
```json
{
  "name": "Taha Es",
  "title": "Full Stack Developer",
  "tagline": "Building scalable web applications with modern technologies",
  "bio": "Passionate developer with 5+ years experience...",
  "avatar": "/images/avatar.jpg",
  "email": "taha@example.com",
  "location": "San Francisco, CA",
  "socialLinks": [
    { "platform": "github", "url": "https://github.com/tahaes", "label": "GitHub" },
    { "platform": "linkedin", "url": "https://linkedin.com/in/tahaes", "label": "LinkedIn" },
    { "platform": "email", "url": "mailto:taha@example.com", "label": "Email" }
  ]
}
```

### `src/content/projects/project-1.json`
```json
{
  "id": "project-1",
  "title": "E-Commerce Platform",
  "description": "Full-stack e-commerce solution with...",
  "shortDescription": "Scalable e-commerce platform with real-time inventory",
  "image": "/images/projects/ecommerce.jpg",
  "techStack": ["React", "Node.js", "PostgreSQL", "Redis", "Docker"],
  "liveUrl": "https://demo.example.com",
  "codeUrl": "https://github.com/tahaes/ecommerce",
  "featured": true,
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-06-30T00:00:00Z",
  "category": "web"
}
```