export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatar: string;
  email: string;
  location: string;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'website' | 'custom';
  url: string;
  label: string;
  icon?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  techStack: string[];
  liveUrl?: string;
  codeUrl?: string;
  featured: boolean;
  startDate: string;
  endDate?: string;
  category: 'web' | 'mobile' | 'cli' | 'library' | 'other';
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'devops' | 'tools' | 'languages' | 'testing' | 'design';
  proficiency: 1 | 2 | 3 | 4 | 5;
  yearsExperience: number;
  icon?: string;
  relatedProjects?: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  achievements: string[];
  logo?: string;
  techStack?: string[];
}

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  themeColor: string;
  author: string;
}

export interface SEOData {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
}