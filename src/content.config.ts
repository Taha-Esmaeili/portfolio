import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const profile = defineCollection({
  loader: glob({ pattern: 'profile.json', base: 'src/content' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    tagline: z.string(),
    bio: z.string(),
    avatar: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string(),
    expertise: z.array(z.string()).optional(),
    languages: z.array(z.object({ name: z.string(), level: z.string() })).optional(),
    socialLinks: z.array(z.object({
      platform: z.enum(['github', 'linkedin', 'twitter', 'email', 'website', 'custom']),
      url: z.string().url(),
      label: z.string(),
      icon: z.string().optional(),
    })),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/projects' }),
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
  loader: glob({ pattern: '**/*.json', base: 'src/content/skills' }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    category: z.enum(['frontend', 'backend', 'devops', 'tools', 'languages', 'testing', 'design', 'ai', 'data']),
    proficiency: z.number().min(1).max(5),
    yearsExperience: z.number().min(0),
    description: z.string().optional(),
    icon: z.string().optional(),
    relatedProjects: z.array(z.string()).optional(),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/experience' }),
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

const education = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/education' }),
  schema: z.object({
    id: z.string(),
    degree: z.string(),
    school: z.string(),
    schoolUrl: z.string().url().optional(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string().optional(),
  }),
});

const certifications = defineCollection({
  loader: glob({ pattern: '**/*.json', base: 'src/content/certifications' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    issuer: z.string(),
    date: z.string(),
    url: z.string().url().optional(),
  }),
});

export const collections = { profile, projects, skills, experience, education, certifications };
