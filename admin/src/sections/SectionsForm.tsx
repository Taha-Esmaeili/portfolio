import React, { useState, useEffect } from 'react';

interface SectionMeta {
  key: string;
  label: string;
  description: string;
}

// Profile is not toggleable: its data (name, contact info, socials) powers
// the Hero, Contact and Footer regardless of which sections are shown.
const TOGGLEABLE_SECTIONS: SectionMeta[] = [
  { key: 'hero', label: 'Hero', description: 'Name, tagline, bio and intro at the top of the page' },
  { key: 'experience', label: 'Experience', description: 'Work history timeline' },
  { key: 'projects', label: 'Projects', description: 'Project cards with category filters' },
  { key: 'skills', label: 'Skills', description: 'Skills grouped by category' },
  { key: 'education', label: 'Education', description: 'Degrees and languages' },
  { key: 'certifications', label: 'Certifications', description: 'Courses and certificates' },
  { key: 'contact', label: 'Contact', description: 'Contact info and social links' },
];

interface SectionsFormProps {
  data: Record<string, boolean> & { sha: string };
  onSave: (data: Record<string, boolean>) => void;
  saving: boolean;
}

export function SectionsForm({ data, onSave, saving }: SectionsFormProps) {
  const [settings, setSettings] = useState<Record<string, boolean>>(() => {
    const { sha: _sha, ...rest } = data;
    return rest;
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const { sha: _sha, ...rest } = data;
    setSettings(rest);
  }, [data]);

  const toggle = (key: string) => {
    setSaved(false);
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
    setSaved(true);
  };

  const offCount = TOGGLEABLE_SECTIONS.filter(s => settings[s.key] === false).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 text-sm text-primary-800">
        Turn sections on or off. Hidden sections are removed from the homepage (including the header
        navigation). <strong>Note:</strong> changes take effect after the site rebuilds — the next
        deploy after your commit lands on the deploy branch.
        {offCount > 0 && (
          <p className="mt-2 font-medium">{offCount} section{offCount > 1 ? 's' : ''} currently hidden.</p>
        )}
      </div>

      <div className="space-y-3">
        {TOGGLEABLE_SECTIONS.map(section => {
          const enabled = settings[section.key] !== false;
          return (
            <div key={section.key} className="bg-white rounded-xl shadow-sm border border-surface-200 p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-surface-900">{section.label}</p>
                <p className="text-sm text-surface-500">{section.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={`Toggle ${section.label} section`}
                onClick={() => toggle(section.key)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  enabled ? 'bg-primary-600' : 'bg-surface-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200">
        {saved && !saving && <span className="text-sm text-green-600">Saved! Rebuild the site to apply.</span>}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
