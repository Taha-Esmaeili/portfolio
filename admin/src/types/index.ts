export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  socialLinks: SocialLink[];
  expertise: string[];
  languages: Language[];
  avatar?: string;
  tagline?: string;
  availability?: string;
  contactAccessKey?: string;
  hero?: HeroContent;
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'website' | 'custom';
  label: string;
  url: string;
  icon: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategoryKey;
  icon: string;
  proficiency: number;
  yearsExperience: number;
  description?: string;
}

export type SkillCategoryKey =
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'tools'
  | 'languages'
  | 'testing'
  | 'design'
  | 'ai'
  | 'data';

export interface SkillCategory {
  key: SkillCategoryKey;
  label: string;
  icon: string;
  skills: Skill[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location: string;
  achievements: string[];
  techStack?: string[];
  logo?: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface HeroContent {
  tagline: string;
  expertiseBadges: string[];
  ctaText: string;
}

export interface ContactContent {
  email: string;
  phone: string;
  availability: string;
  accessKey?: string;
}

export type SectionKey = 'profile' | 'skills' | 'experience' | 'education' | 'certifications' | 'hero' | 'contact';

export const SECTIONS: { key: SectionKey; label: string; icon: string }[] = [
  { key: 'profile', label: 'Profile', icon: 'User' },
  { key: 'skills', label: 'Skills', icon: 'Code' },
  { key: 'experience', label: 'Experience', icon: 'Briefcase' },
  { key: 'education', label: 'Education', icon: 'GraduationCap' },
  { key: 'certifications', label: 'Certifications', icon: 'Award' },
  { key: 'hero', label: 'Hero', icon: 'Home' },
  { key: 'contact', label: 'Contact', icon: 'Mail' },
];