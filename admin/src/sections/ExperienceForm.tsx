import React, { useState, useEffect } from 'react';
import type { Experience } from '../types';
import type { GitHubClient } from '../api/github';

interface ExperienceFormProps {
  data: Experience[];
  client: GitHubClient;
  saving: boolean;
}

function toDatetimeLocal(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export function ExperienceForm({ data, client, saving }: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<Experience[]>(data);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Experience>({
    id: '',
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    current: false,
    location: '',
    achievements: [],
    techStack: [],
    logo: '',
  });
  const [newDescription, setNewDescription] = useState('');
  const [newTech, setNewTech] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setExperiences(data);
  }, [data]);

  const startEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setForm({
      ...exp,
      achievements: [...exp.achievements],
      techStack: [...(exp.techStack || [])],
    });
    setNewDescription('');
    setNewTech('');
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ id: '', company: '', role: '', startDate: '', endDate: '', current: false, location: '', achievements: [], techStack: [] });
    setNewDescription('');
    setNewTech('');
    setError(null);
  };

  const addDescription = () => {
    if (newDescription.trim()) {
      setForm(prev => ({ ...prev, achievements: [...(prev.achievements || []), newDescription.trim()] }));
      setNewDescription('');
    }
  };

  const removeDescription = (index: number) => {
    setForm(prev => ({ ...prev, achievements: (prev.achievements || []).filter((_, i) => i !== index) }));
  };

  const addTech = () => {
    if (newTech.trim()) {
      setForm(prev => ({ ...prev, techStack: [...(prev.techStack || []), newTech.trim()] }));
      setNewTech('');
    }
  };

  const removeTech = (index: number) => {
    setForm(prev => ({ ...prev, techStack: (prev.techStack || []).filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const exp: Experience = {
        ...form,
        id: form.id || form.company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        achievements: form.achievements.filter(a => a.trim()),
      };
      if (editingId && editingId !== 'new') {
        await client.updateExperience(exp);
      } else {
        await client.createExperience(exp);
      }
      setExperiences(prev => {
        const next = editingId && editingId !== 'new'
          ? prev.map(x => (x.id === exp.id ? exp : x))
          : [exp, ...prev];
        return next.sort((a, b) => b.startDate.localeCompare(a.startDate));
      });
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    try {
      setError(null);
      await client.deleteExperience(id);
      setExperiences(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-surface-900">Experiences</h2>
        <button
          type="button"
          onClick={() => {
            setEditingId('new');
            setForm({ id: '', company: '', role: '', startDate: '', endDate: '', current: false, location: '', achievements: [], techStack: [] });
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          + Add Experience
        </button>
      </div>

      {editingId && (
        <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-surface-900">{editingId === 'new' ? 'Add' : 'Edit'} Experience</h3>
              <button
                type="button"
                onClick={cancelEdit}
                className="text-surface-500 hover:text-surface-700"
              >
                Cancel
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Company</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={e => setForm(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={toDatetimeLocal(form.startDate)}
                  onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={toDatetimeLocal(form.endDate)}
                  onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
                  disabled={form.current}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-surface-100"
                />
                <label className="mt-2 flex items-center gap-2 text-sm text-surface-700">
                  <input
                    type="checkbox"
                    checked={form.current}
                    onChange={e => setForm(prev => ({ ...prev, current: e.target.checked, endDate: e.target.checked ? undefined : prev.endDate }))}
                  />
                  Currently working here
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-surface-700 mb-1">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-surface-700 mb-1">Logo URL (optional)</label>
                <input
                  type="url"
                  value={form.logo || ''}
                  onChange={e => setForm(prev => ({ ...prev, logo: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Achievements (3-5 bullet points)</label>
              <div className="space-y-2">
                {(form.achievements || []).map((item, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item}
                      onChange={e => {
                        const desc = [...(form.achievements || [])];
                        desc[i] = e.target.value;
                        setForm(prev => ({ ...prev, achievements: desc }));
                      }}
                      className="flex-1 px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <button type="button" onClick={() => removeDescription(i)} className="text-red-500 hover:text-red-700 px-2">
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addDescription())}
                    className="flex-1 px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Add a bullet point..."
                  />
                  <button type="button" onClick={addDescription} className="px-4 py-2.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200">
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Tech Stack (optional)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(form.techStack || []).map((tech, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                    {tech}
                    <button type="button" onClick={() => removeTech(i)} className="text-red-500 hover:text-red-700 font-bold">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={e => setNewTech(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  className="flex-1 px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Python, PyTorch"
                />
                <button type="button" onClick={addTech} className="px-4 py-2.5 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200">
                  Add
                </button>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>}

            <div className="flex justify-end gap-3 pt-4 border-t border-surface-200">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId === 'new' ? 'Add' : 'Save'}
              </button>
              <button type="button" onClick={cancelEdit} className="px-6 py-3 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {experiences.map(exp => (
          <div key={exp.id} className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-surface-900">{exp.role}</h3>
                <p className="text-primary-600 font-medium">{exp.company}</p>
                <p className="text-sm text-surface-500 mt-1">
                  {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} –{' '}
                  {exp.current || !exp.endDate ? 'Present' : new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(exp)}
                  className="px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {exp.achievements.map((item, i) => (
                <p key={i} className="text-surface-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5"></span>
                  {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}