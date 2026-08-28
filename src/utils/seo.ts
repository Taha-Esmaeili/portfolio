import type { SEOData } from '../types';

export function generateSEOMeta(data: SEOData): Record<string, string> {
  const { title, description, image, url, type = 'website', twitterCard = 'summary_large_image' } = data;
  
  return {
    title,
    description,
    'og:title': title,
    'og:description': description,
    'og:type': type,
    'og:url': url || '',
    'og:image': image || '',
    'twitter:card': twitterCard,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image || '',
  };
}

export function generatePersonSchema(profile: {
  name: string;
  title: string;
  url: string;
  image: string;
  email: string;
  worksFor?: { name: string };
  sameAs: string[];
  knowsAbout: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    url: profile.url,
    image: profile.image,
    email: profile.email,
    worksFor: profile.worksFor,
    sameAs: profile.sameAs,
    knowsAbout: profile.knowsAbout,
  };
}

export function generateWebSiteSchema(site: {
  name: string;
  url: string;
  author: { name: string; url: string };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    author: {
      '@type': 'Person',
      name: site.author.name,
      url: site.author.url,
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}