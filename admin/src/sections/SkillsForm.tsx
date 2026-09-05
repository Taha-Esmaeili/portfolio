import React, { useState, useEffect } from 'react';
import type { Capability } from '../types';

interface SkillsFormProps {
  data: { capabilities: Capability[]; sha: string };
  onSave: (data: { capabilities: Capability[] }) => void;
  saving: boolean;
}

function emptyCapability(): Capability {
  return { key: '', title: '', description: '', icon: 'tabler:sparkles', tags: [] };
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'card';
}

export function SkillsForm({ data, onSave, saving }: SkillsFormProps) {
  const [capabilities, setCapabilities] = useState<Capability[]>(data.capabilities || []);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setCapabilities(data.capabilities || []);
  }, [data]);

  const updateCard = (index: number, field: keyof Capability, value: any) => {
    setCapabilities(cards => cards.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const addTag = (index: number, tag: string) => {
    const t = tag.trim();
    if (!t) return;
    setCapabilities(cards =>
      cards.map((c, i) => (i === index && !c.tags.includes(t) ? { ...c, tags: [...c.tags, t] } : c))
    );
  };

  const removeTag = (index: number, tagIndex: number) => {
    setCapabilities(cards =>
      cards.map((c, i) => (i === index ? { ...c, tags: c.tags.filter((_, ti) => ti !== tagIndex) } : c))
    );
  };

  const addCard = () => setCapabilities(cards => [...cards, emptyCapability()]);
  const removeCard = (index: number) => setCapabilities(cards => cards.filter((_, i) => i !== index));

  const moveCard = (index: number, dir: -1 | 1) => {
    setCapabilities(cards => {
      const next = [...cards];
      const target = index + dir;
      if (target < 0 || target >= next.length) return next;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = capabilities
      .filter(c => c.title.trim())
      .map(c => ({
        ...c,
        key: c.key.trim() || slugify(c.title),
        icon: c.icon.trim() || 'tabler:sparkles',
        tags: c.tags.map(t => t.trim()).filter(Boolean),
      }));
    onSave({ capabilities: clean });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-surface-900">Skill Capabilities</h2>
        <button type="button" onClick={addCard} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          + Add Card
        </button>
      </div>

      <p className="text-sm text-surface-500">
        These cards render in the Skills section. Use the ↑/↓ buttons to order them; the top card appears first.
      </p>

      {capabilities.map((capability, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 space-y-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-surface-900">Card {index + 1}</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveCard(index, -1)}
                disabled={index === 0}
                className="px-2 py-1 text-sm bg-surface-100 text-surface-700 rounded hover:bg-surface-200 disabled:opacity-40"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveCard(index, 1)}
                disabled={index === capabilities.length - 1}
                className="px-2 py-1 text-sm bg-surface-100 text-surface-700 rounded hover:bg-surface-200 disabled:opacity-40"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeCard(index)}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Domain Title</label>
              <input
                type="text"
                value={capability.title}
                onChange={e => updateCard(index, 'title', e.target.value)}
                className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., NLP & Generative AI"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Icon (Iconify name)</label>
              <input
                type="text"
                value={capability.icon}
                onChange={e => updateCard(index, 'icon', e.target.value)}
                className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="tabler:brain"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-surface-700 mb-1">Description (one line)</label>
              <input
                type="text"
                value={capability.description}
                onChange={e => updateCard(index, 'description', e.target.value)}
                className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">Skills / Tools (badges)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {capability.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="inline-flex items-center gap-1 px-3 py-1 bg-surface-100 text-surface-700 rounded-full text-sm">
                  {tag}
                  <button type="button" onClick={() => removeTag(index, tagIndex)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                </span>
              ))}
            </div>
            {capability.tags.length === 0 && (
              <p className="text-xs text-surface-400 mb-2">No skills yet — add some below.</p>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag(index, newTag), setNewTag(''))}
                className="flex-1 px-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Add a skill/tool..."
              />
              <button
                type="button"
                onClick={() => (addTag(index, newTag), setNewTag(''))}
                className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
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