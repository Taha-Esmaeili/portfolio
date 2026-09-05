import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { createGitHubClient, type GitHubClient } from './api/github';
import { SECTIONS, type SectionKey } from './types';
import { LoginScreen } from './components/LoginScreen';
import { PinScreen } from './components/PinScreen';
import { ProfileForm } from './sections/ProfileForm';
import { SkillsForm } from './sections/SkillsForm';
import { ExperienceForm } from './sections/ExperienceForm';
import { EducationForm } from './sections/EducationForm';
import { CertificationsForm } from './sections/CertificationsForm';
import { ProjectsForm } from './sections/ProjectsForm';
import { SectionsForm } from './sections/SectionsForm';
import { HeroForm } from './sections/HeroForm';
import { ContactForm } from './sections/ContactForm';
import { SectionLoader } from './components/SectionLoader';
import { AdminIcon } from './components/AdminIcon';
import { ErrorBoundary } from './components/ErrorBoundary';

function SectionContent({ section, client, onSave }: {
  section: SectionKey;
  client: GitHubClient;
  onSave: () => void;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        let result;
        switch (section) {
          case 'profile':
            result = await client.getProfile();
            break;
          case 'sections':
            result = await client.getSectionSettings();
            break;
          case 'skills':
            result = await client.getCapabilities();
            break;
          case 'experience':
            result = await client.getExperience();
            break;
          case 'education':
            result = await client.getEducation();
            break;
          case 'certifications':
            result = await client.getCertifications();
            break;
          case 'projects':
            result = await client.getProjects();
            break;
          case 'hero':
            result = await client.getHero();
            break;
          case 'contact':
            result = await client.getContact();
            break;
        }
        if (mounted) setData(result);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [section, client]);

  const handleSave = useCallback(async (newData: any) => {
    if (!data) return;
    try {
      setSaving(true);
      setError(null);
      switch (section) {
        case 'profile':
          await client.updateProfile(newData, data.sha);
          break;
        case 'sections':
          await client.updateSectionSettings(newData, data.sha);
          break;
        case 'skills':
          await client.updateCapabilities(newData, data.sha);
          break;
        case 'experience':
          // handled by form component directly
          break;
        case 'education':
          // handled by form component directly
          break;
        case 'certifications':
          // handled by form component directly
          break;
        case 'hero':
          await client.updateHero(newData);
          break;
        case 'contact':
          await client.updateContact(newData);
          break;
      }
      onSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [section, data, client, onSave]);

  if (loading) return <SectionLoader />;
  if (error) return <div className="p-4 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  if (!data) return <div className="p-4 text-surface-500">No data</div>;

  switch (section) {
    case 'profile':
      return <ProfileForm data={data} onSave={handleSave} saving={saving} />;
    case 'sections':
      return <SectionsForm data={data} onSave={handleSave} saving={saving} />;
    case 'skills':
      return <SkillsForm data={data} onSave={handleSave} saving={saving} />;
    case 'experience':
      return <ExperienceForm data={data} client={client} saving={saving} />;
    case 'education':
      return <EducationForm data={data} client={client} saving={saving} />;
    case 'certifications':
      return <CertificationsForm data={data} client={client} saving={saving} />;
    case 'projects':
      return <ProjectsForm data={data} client={client} saving={saving} />;
    case 'hero':
      return <HeroForm data={data} onSave={handleSave} saving={saving} />;
    case 'contact':
      return <ContactForm data={data} onSave={handleSave} saving={saving} />;
    default:
      return <div>Unknown section</div>;
  }
}

function AdminApp() {
  const { isAuthenticated, isPinVerified, token, repoInfo, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionKey>('profile');
  const [client, setClient] = useState<GitHubClient | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (token && repoInfo) {
      setClient(createGitHubClient(token, repoInfo));
    }
  }, [token, repoInfo]);

  const handleSave = useCallback(() => {
    setLastSaved(new Date());
  }, []);

  if (!isAuthenticated) return null;
  if (!isPinVerified) return <PinScreen />;

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-950 text-white flex flex-col h-screen fixed left-0 top-0 z-50">
        <div className="p-6 border-b border-surface-800">
          <h1 className="text-xl font-bold text-primary-400">Portfolio Admin</h1>
          <p className="text-sm text-surface-400 mt-1">Taha Esmaeili</p>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {SECTIONS.map(({ key, label, icon }) => (
              <li key={key}>
                <button
                  onClick={() => setActiveSection(key)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors flex items-center gap-3 ${
                    activeSection === key
                      ? 'bg-primary-600 text-white'
                      : 'text-surface-300 hover:bg-surface-800 hover:text-white'
                  }`}
                >
                  <AdminIcon name={icon} />
                  <span className="font-medium">{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-surface-800">
          <button
            onClick={logout}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-800 text-surface-300 hover:bg-surface-700 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
          {lastSaved && (
            <p className="mt-3 text-xs text-surface-500 text-center">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-surface-900">{SECTIONS.find(s => s.key === activeSection)?.label}</h2>
          <p className="text-surface-500 mt-1">Manage your portfolio content</p>
        </header>
        {client ? (
          <ErrorBoundary key={activeSection}>
            <SectionContent section={activeSection} client={client} onSave={handleSave} />
          </ErrorBoundary>
        ) : (
          <div className="text-center py-12 text-surface-500">Loading...</div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

function AppInner() {
  const { isAuthenticated, isPinVerified } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }
  if (!isPinVerified) {
    return <PinScreen />;
  }
  return <AdminApp />;
}