import type { Profile, Skill, SkillCategory, Experience, Education, Certification, Project, HeroContent, ContactContent } from '../types';

const GITHUB_API_BASE = 'https://api.github.com/repos';

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  type?: string;
  content?: string;
  encoding?: string;
}

export interface RepoInfo {
  owner: string;
  repo: string;
  branch: string;
}

export function createGitHubClient(token: string, repoInfo: RepoInfo) {
  const { owner, repo, branch } = repoInfo;

  const baseHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${GITHUB_API_BASE}/${owner}/${repo}${path}`, {
      ...options,
      headers: {
        ...baseHeaders,
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  async function getFile(path: string): Promise<{ content: string; sha: string }> {
    const file = await request<GitHubFile>(`/contents/${path}?ref=${branch}`);
    if (!file.content) {
      throw new Error(`File ${path} is empty or not found`);
    }
    const content = atob(file.content.replace(/\s/g, ''));
    return { content, sha: file.sha };
  }

  async function updateFile(path: string, content: string, message: string, sha: string): Promise<void> {
    const payload: Record<string, unknown> = {
      message,
      content: btoa(content),
      branch,
    };
    if (sha) payload.sha = sha;
    await request(`/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async function listFiles(dirPath: string): Promise<string[]> {
    const files = await request<GitHubFile[]>(`/contents/${dirPath}?ref=${branch}`);
    return files.filter(f => f.type === 'file' && f.name.endsWith('.json')).map(f => f.path);
  }

  // Content-specific helpers
  async function getProfile(): Promise<Profile & { sha: string }> {
    const file = await getFile('src/content/profile.json');
    return { ...JSON.parse(file.content), sha: file.sha };
  }

  const DEFAULT_SECTION_SETTINGS = { hero: true, experience: true, projects: true, skills: true, education: true, certifications: true, contact: true };

  async function getSectionSettings(): Promise<Record<string, boolean> & { sha: string }> {
    try {
      const file = await getFile('src/content/sections.json');
      return { ...DEFAULT_SECTION_SETTINGS, ...JSON.parse(file.content), sha: file.sha };
    } catch (err) {
      // File doesn't exist yet on the branch (feature not committed/pushed):
      // fall back to all-on defaults so first save creates the file.
      if (err instanceof Error && err.message.includes('(404)')) {
        // Cast: spread includes sha (string) alongside boolean flags; the
        // SectionsForm strips sha before treating the rest as booleans.
        return { ...DEFAULT_SECTION_SETTINGS, sha: '' } as unknown as Record<string, boolean> & { sha: string };
      }
      throw err;
    }
  }

  async function updateSectionSettings(settings: Record<string, boolean>, sha: string): Promise<void> {
    await updateFile('src/content/sections.json', JSON.stringify(settings, null, 2), 'Update section visibility', sha);
  }

  async function updateProfile(profile: Profile, sha: string): Promise<void> {
    await updateFile('src/content/profile.json', JSON.stringify(profile, null, 2), 'Update profile', sha);
  }

  const CATEGORY_LABELS: Record<string, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    devops: 'DevOps',
    tools: 'Tools',
    languages: 'Languages',
    testing: 'Testing',
    design: 'Design',
    ai: 'AI & ML',
    data: 'Data',
  };

  function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function getSkills(): Promise<SkillCategory[]> {
    const paths = await listFiles('src/content/skills');
    const skills: Skill[] = [];
    for (const path of paths) {
      const { content } = await getFile(path);
      skills.push(JSON.parse(content));
    }
    const byCategory = new Map<string, Skill[]>();
    for (const skill of skills) {
      const list = byCategory.get(skill.category) || [];
      list.push(skill);
      byCategory.set(skill.category, list);
    }
    return [...byCategory.entries()].map(([key, catSkills]) => ({
      key: key as SkillCategory['key'],
      label: CATEGORY_LABELS[key] || key,
      icon: 'mdi:tag',
      skills: catSkills.sort((a, b) => b.proficiency - a.proficiency),
    }));
  }

  async function updateSkills(categories: SkillCategory[]): Promise<void> {
    const desired: { id: string; data: Skill }[] = [];
    for (const category of categories) {
      for (const skill of category.skills) {
        const id = skill.id || slugify(skill.name);
        if (!id || !skill.name) continue;
        desired.push({
          id,
          data: {
            id,
            name: skill.name,
            category: category.key,
            proficiency: skill.proficiency,
            yearsExperience: skill.yearsExperience ?? 0,
            description: skill.description || undefined,
            icon: skill.icon || undefined,
          } as Skill,
        });
      }
    }
    const desiredIds = new Set(desired.map(d => d.id));
    const existingPaths = await listFiles('src/content/skills');
    const existingIds = new Set(existingPaths.map(p => p.split('/').pop()!.replace(/\.json$/, '')));

    // Update or create desired skills
    for (const { id, data } of desired) {
      const path = `src/content/skills/${id}.json`;
      const serialized = JSON.stringify(data, null, 2);
      if (existingIds.has(id)) {
        const { content, sha } = await getFile(path);
        if (content.trim() !== serialized) {
          await updateFile(path, serialized, `Update skill: ${data.name}`, sha);
        }
      } else {
        await updateFile(path, serialized, `Add skill: ${data.name}`, '');
      }
    }

    // Delete skills removed from the form
    for (const id of existingIds) {
      if (!desiredIds.has(id)) {
        await deleteSkill(id);
      }
    }
  }

  async function deleteSkill(id: string): Promise<void> {
    const { sha } = await getFile(`src/content/skills/${id}.json`);
    await request(`/contents/src/content/skills/${id}.json`, {
      method: 'DELETE',
      body: JSON.stringify({
        message: `Delete skill: ${id}`,
        sha,
        branch,
      }),
    });
  }

  async function getExperience(): Promise<Experience[]> {
    const paths = await listFiles('src/content/experience');
    const items: Experience[] = [];
    for (const path of paths) {
      const { content } = await getFile(path);
      items.push(JSON.parse(content));
    }
    return items.sort((a, b) => b.startDate.localeCompare(a.startDate));
  }

  async function updateExperience(item: Experience): Promise<void> {
    const { sha } = await getFile(`src/content/experience/${item.id}.json`);
    await updateFile(`src/content/experience/${item.id}.json`, JSON.stringify(item, null, 2), `Update experience: ${item.role}`, sha);
  }

  async function createExperience(item: Experience): Promise<void> {
    await request(`/contents/src/content/experience/${item.id}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Add experience: ${item.role}`,
        content: btoa(JSON.stringify(item, null, 2)),
        branch,
      }),
    });
  }

  async function deleteExperience(id: string): Promise<void> {
    const { sha } = await getFile(`src/content/experience/${id}.json`);
    await request(`/contents/src/content/experience/${id}.json`, {
      method: 'DELETE',
      body: JSON.stringify({
        message: `Delete experience: ${id}`,
        sha,
        branch,
      }),
    });
  }

  async function getProjects(): Promise<Project[]> {
    const paths = await listFiles('src/content/projects');
    const items: Project[] = [];
    for (const path of paths) {
      const { content } = await getFile(path);
      items.push(JSON.parse(content));
    }
    return items.sort((a, b) => b.startDate.localeCompare(a.startDate));
  }

  async function updateProject(item: Project): Promise<void> {
    const { sha } = await getFile(`src/content/projects/${item.id}.json`);
    await updateFile(`src/content/projects/${item.id}.json`, JSON.stringify(item, null, 2), `Update project: ${item.title}`, sha);
  }

  async function createProject(item: Project): Promise<void> {
    await request(`/contents/src/content/projects/${item.id}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Add project: ${item.title}`,
        content: btoa(JSON.stringify(item, null, 2)),
        branch,
      }),
    });
  }

  async function deleteProject(id: string): Promise<void> {
    const { sha } = await getFile(`src/content/projects/${id}.json`);
    await request(`/contents/src/content/projects/${id}.json`, {
      method: 'DELETE',
      body: JSON.stringify({
        message: `Delete project: ${id}`,
        sha,
        branch,
      }),
    });
  }

  async function getEducation(): Promise<Education[]> {
    const paths = await listFiles('src/content/education');
    const items: Education[] = [];
    for (const path of paths) {
      const { content } = await getFile(path);
      items.push(JSON.parse(content));
    }
    return items.sort((a, b) => b.startDate.localeCompare(a.startDate));
  }

  async function updateEducation(item: Education): Promise<void> {
    const { sha } = await getFile(`src/content/education/${item.id}.json`);
    await updateFile(`src/content/education/${item.id}.json`, JSON.stringify(item, null, 2), `Update education: ${item.degree}`, sha);
  }

  async function createEducation(item: Education): Promise<void> {
    await request(`/contents/src/content/education/${item.id}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Add education: ${item.degree}`,
        content: btoa(JSON.stringify(item, null, 2)),
        branch,
      }),
    });
  }

  async function deleteEducation(id: string): Promise<void> {
    const { sha } = await getFile(`src/content/education/${id}.json`);
    await request(`/contents/src/content/education/${id}.json`, {
      method: 'DELETE',
      body: JSON.stringify({
        message: `Delete education: ${id}`,
        sha,
        branch,
      }),
    });
  }

  async function getCertifications(): Promise<Certification[]> {
    const paths = await listFiles('src/content/certifications');
    const items: Certification[] = [];
    for (const path of paths) {
      const { content } = await getFile(path);
      items.push(JSON.parse(content));
    }
    return items.sort((a, b) => b.date.localeCompare(a.date));
  }

  async function updateCertification(item: Certification): Promise<void> {
    const { sha } = await getFile(`src/content/certifications/${item.id}.json`);
    await updateFile(`src/content/certifications/${item.id}.json`, JSON.stringify(item, null, 2), `Update certification: ${item.title}`, sha);
  }

  async function createCertification(item: Certification): Promise<void> {
    await request(`/contents/src/content/certifications/${item.id}.json`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Add certification: ${item.title}`,
        content: btoa(JSON.stringify(item, null, 2)),
        branch,
      }),
    });
  }

  async function deleteCertification(id: string): Promise<void> {
    const { sha } = await getFile(`src/content/certifications/${id}.json`);
    await request(`/contents/src/content/certifications/${id}.json`, {
      method: 'DELETE',
      body: JSON.stringify({
        message: `Delete certification: ${id}`,
        sha,
        branch,
      }),
    });
  }

  async function getHero(): Promise<HeroContent> {
    // Hero content is embedded in profile or a separate file
    // For now, we'll store it in profile.json under hero field
    const profile = await getProfile();
    return profile.hero || { tagline: '', expertiseBadges: [], ctaText: 'View Experience' };
  }

  async function updateHero(hero: HeroContent): Promise<void> {
    const { content, sha } = await getFile('src/content/profile.json');
    const profile = JSON.parse(content) as Profile;
    await updateFile('src/content/profile.json', JSON.stringify({ ...profile, hero }, null, 2), 'Update hero section', sha);
  }

  async function getContact(): Promise<ContactContent> {
    const profile = await getProfile();
    return {
      email: profile.email,
      phone: profile.phone,
      availability: profile.availability || '',
      accessKey: profile.contactAccessKey,
    };
  }

  async function updateContact(contact: ContactContent): Promise<void> {
    const { content, sha } = await getFile('src/content/profile.json');
    const profile = JSON.parse(content) as Profile;
    const updated = { ...profile, email: contact.email, phone: contact.phone, availability: contact.availability, contactAccessKey: contact.accessKey };
    await updateFile('src/content/profile.json', JSON.stringify(updated, null, 2), 'Update contact info', sha);
  }

  return {
    getFile,
    updateFile,
    listFiles,
    // Content helpers
    getProfile,
    updateProfile,
    getSectionSettings,
    updateSectionSettings,
    getSkills,
    updateSkills,
    getExperience,
    updateExperience,
    createExperience,
    deleteExperience,
    getEducation,
    updateEducation,
    createEducation,
    deleteEducation,
    getCertifications,
    updateCertification,
    createCertification,
    deleteCertification,
    getProjects,
    updateProject,
    createProject,
    deleteProject,
    getHero,
    updateHero,
    getContact,
    updateContact,
  };
}

export type GitHubClient = ReturnType<typeof createGitHubClient>;