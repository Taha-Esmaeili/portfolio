import React, { useState, useEffect } from 'react';
import type { Profile, SocialLink, Language } from '../types';

interface ProfileFormProps {
  data: Profile & { sha: string };
  onSave: (data: Profile) => void;
  saving: boolean;
}

export function ProfileForm({ data, onSave, saving }: ProfileFormProps) {
  const [form, setForm] = useState<Profile>({
    name: data.name,
    title: data.title,
    bio: data.bio,
    email: data.email,
    phone: data.phone,
    location: data.location,
    socialLinks: data.socialLinks,
    expertise: data.expertise,
    languages: data.languages,
    avatar: data.avatar,
    tagline: data.tagline,
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(data.socialLinks || []);
  const [expertise, setExpertise] = useState<string[]>(data.expertise || []);
  const [languages, setLanguages] = useState<Language[]>(data.languages || []);
  const [newSocialLabel, setNewSocialLabel] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialIcon, setNewSocialIcon] = useState('');
  const [newExpertise, setNewExpertise] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newLanguageLevel, setNewLanguageLevel] = useState('Fluent');

  useEffect(() => {
    setForm({
      name: data.name,
      title: data.title,
      bio: data.bio,
      email: data.email,
      phone: data.phone,
      location: data.location,
      socialLinks: data.socialLinks,
      expertise: data.expertise,
      languages: data.languages,
      avatar: data.avatar,
      tagline: data.tagline,
    });
    setSocialLinks(data.socialLinks || []);
    setExpertise(data.expertise || []);
    setLanguages(data.languages || []);
  }, [data]);

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const derivePlatform = (url: string): SocialLink['platform'] => {
    const u = url.toLowerCase();
    if (u.includes('github.com')) return 'github';
    if (u.includes('linkedin.com')) return 'linkedin';
    if (u.includes('twitter.com') || u.includes('x.com')) return 'twitter';
    if (u.startsWith('mailto:')) return 'email';
    return 'website';
  };

  const addSocialLink = () => {
    if (newSocialLabel && newSocialUrl && newSocialIcon) {
      setSocialLinks([...socialLinks, { platform: derivePlatform(newSocialUrl), label: newSocialLabel, url: newSocialUrl, icon: newSocialIcon }]);
      setNewSocialLabel('');
      setNewSocialUrl('');
      setNewSocialIcon('');
    }
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const addItem = (arr: string[], setter: (val: string[]) => void, newVal: string, setNewVal: (val: string) => void) => {
    if (newVal.trim()) {
      setter([...arr, newVal.trim()]);
      setNewVal('');
    }
  };

  const removeItem = (arr: string[], setter: (val: string[]) => void, index: number) => {
    setter(arr.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      // The avatar is managed via git (public/images/avatar.jpg); never let
      // a form submission clear it.
      avatar: form.avatar || data.avatar || '/images/avatar.jpg',
      socialLinks,
      expertise,
      languages,
    };
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 space-y-6">
        <h3 className="text-lg font-semibold text-surface-900">Basic Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-surface-700 mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => handleChange('bio', e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={e => handleChange('location', e.target.value)}
              className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="text-sm text-surface-500 bg-surface-50 border border-surface-200 rounded-lg p-3">
            ℹ️ The profile picture is managed as an image file in the repository
            (<code className="text-xs">public/images/avatar.jpg</code>) and can't be changed here.
            Editing this form always preserves it.
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-surface-900">Tagline & Hero CTA</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline || ''}
              onChange={e => handleChange('tagline', e.target.value)}
              className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="AI & NLP Engineer building intelligent language systems..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-surface-900">Expertise Badges</h3>
        <div className="flex flex-wrap gap-2">
          {expertise.map((item, i) => (
            <span key={i} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm flex items-center gap-1.5">
              {item}
              <button type="button" onClick={() => removeItem(expertise, setExpertise, i)} className="hover:text-primary-600">×</button>
            </span>
          ))}
          <div className="flex gap-2 items-end">
            <input
              type="text"
              value={newExpertise}
              onChange={e => setNewExpertise(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem(expertise, setExpertise, newExpertise, setNewExpertise))}
              className="flex-1 px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Add expertise..."
            />
            <button type="button" onClick={() => addItem(expertise, setExpertise, newExpertise, setNewExpertise)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-surface-900">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang, i) => (
            <span key={i} className="px-3 py-1 bg-surface-100 text-surface-700 rounded-full text-sm flex items-center gap-1.5">
              {lang.name} ({lang.level})
              <button type="button" onClick={() => setLanguages(languages.filter((_, j) => j !== i))} className="hover:text-surface-600">×</button>
            </span>
          ))}
          <div className="flex gap-2 items-end">
            <input
              type="text"
              value={newLanguage}
              onChange={e => setNewLanguage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), newLanguage.trim() && (setLanguages([...languages, { name: newLanguage.trim(), level: newLanguageLevel }]), setNewLanguage('')))}
              className="flex-1 px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Add language..."
            />
            <select
              value={newLanguageLevel}
              onChange={e => setNewLanguageLevel(e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option>Native</option>
              <option>Fluent</option>
              <option>Advanced</option>
              <option>Intermediate</option>
              <option>Basic</option>
            </select>
            <button
              type="button"
              onClick={() => {
                if (newLanguage.trim()) {
                  setLanguages([...languages, { name: newLanguage.trim(), level: newLanguageLevel }]);
                  setNewLanguage('');
                }
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-surface-900">Social Links</h3>
        <div className="space-y-3">
          {socialLinks.map((link, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_80px_40px] gap-3 items-end">
              <input
                type="text"
                value={link.label}
                onChange={e => {
                  const newLinks = [...socialLinks];
                  newLinks[i] = { ...newLinks[i], label: e.target.value };
                  setSocialLinks(newLinks);
                }}
                className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Label"
              />
              <input
                type="url"
                value={link.url}
                onChange={e => {
                  const newLinks = [...socialLinks];
                  newLinks[i] = { ...newLinks[i], url: e.target.value };
                  setSocialLinks(newLinks);
                }}
                className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="URL"
              />
              <input
                type="text"
                value={link.icon}
                onChange={e => {
                  const newLinks = [...socialLinks];
                  newLinks[i] = { ...newLinks[i], icon: e.target.value };
                  setSocialLinks(newLinks);
                }}
                className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Icon (e.g., simple-icons:github)"
              />
              <button type="button" onClick={() => removeSocialLink(i)} className="text-red-500 hover:text-red-700 font-bold">×</button>
            </div>
          ))}
          <div className="grid grid-cols-[1fr_2fr_80px_40px] gap-3 items-end">
            <input
              type="text"
              value={newSocialLabel}
              onChange={e => setNewSocialLabel(e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Label"
            />
            <input
              type="url"
              value={newSocialUrl}
              onChange={e => setNewSocialUrl(e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="URL"
            />
            <input
              type="text"
              value={newSocialIcon}
              onChange={e => setNewSocialIcon(e.target.value)}
              className="px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Icon"
            />
            <button type="button" onClick={addSocialLink} className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Add</button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}