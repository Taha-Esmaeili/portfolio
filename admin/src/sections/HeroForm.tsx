import React, { useState, useEffect } from 'react';
import type { HeroContent } from '../types';

interface HeroFormProps {
  data: HeroContent;
  onSave: (data: HeroContent) => void;
  saving: boolean;
}

export function HeroForm({ data, onSave, saving }: HeroFormProps) {
  const [form, setForm] = useState<HeroContent>({
    tagline: data.tagline,
    expertiseBadges: data.expertiseBadges,
    ctaText: data.ctaText,
  });
  const [newBadge, setNewBadge] = useState('');

  useEffect(() => {
    setForm(data);
  }, [data]);

  const addBadge = () => {
    if (newBadge.trim()) {
      setForm(prev => ({ ...prev, expertiseBadges: [...prev.expertiseBadges, newBadge.trim()] }));
      setNewBadge('');
    }
  };

  const removeBadge = (index: number) => {
    setForm(prev => ({ ...prev, expertiseBadges: prev.expertiseBadges.filter((_, i) => i !== index) }));
  };

  const handleChange = (field: keyof HeroContent, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-surface-900">Hero Section</h3>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Tagline</label>
          <textarea
            value={form.tagline}
            onChange={e => handleChange('tagline', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="A highly motivated recent Computer Science graduate..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">CTA Button Text</label>
          <input
            type="text"
            value={form.ctaText}
            onChange={e => handleChange('ctaText', e.target.value)}
            className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="View Experience"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-surface-700">Expertise Badges</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBadge}
                onChange={e => setNewBadge(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addBadge())}
                className="px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Add badge (e.g., NLP, LLMs, ML)"
              />
              <button type="button" onClick={addBadge} className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200">
                Add
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.expertiseBadges.map((badge, i) => (
              <span key={i} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm flex items-center gap-1.5">
                {badge}
                <button type="button" onClick={() => removeBadge(i)} className="hover:text-primary-600">×</button>
              </span>
            ))}
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