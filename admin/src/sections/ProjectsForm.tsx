import React, { useState, useEffect } from 'react';
import type { Project } from '../types';
import type { GitHubClient } from '../api/github';

interface ProjectsFormProps {
  data: Project[];
  client: GitHubClient;
  saving: boolean;
}

const CATEGORIES: Project['category'][] = ['web', 'mobile', 'cli', 'library', 'other'];

function emptyProject(): Project {
  return {
    id: '',
    title: '',
    description: '',
    shortDescription: '',
    image: '',
    techStack: [],
    liveUrl: '',
    codeUrl: '',
    featured: false,
    startDate: '',
    endDate: '',
    category: 'other',
  };
}

function toDateString(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

export function ProjectsForm({ data, client, saving }: ProjectsFormProps) {
  const [projects, setProjects] = useState<Project[]>(data);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Project>(emptyProject());
  const [newTech, setNewTech] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProjects(data);
  }, [data]);

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({ ...project, techStack: [...project.techStack] });
    setNewTech('');
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyProject());
    setNewTech('');
    setError(null);
  };

  const addTech = () => {
    if (newTech.trim()) {
      setForm(prev => ({ ...prev, techStack: [...prev.techStack, newTech.trim()] }));
      setNewTech('');
    }
  };

  const removeTech = (index: number) => {
    setForm(prev => ({ ...prev, techStack: prev.techStack.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const project: Project = {
        ...form,
        id: form.id || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        techStack: form.techStack.filter(t => t.trim()),
        liveUrl: form.liveUrl || undefined,
        codeUrl: form.codeUrl || undefined,
        endDate: form.endDate || undefined,
      };
      if (editingId && editingId !== 'new') {
        await client.updateProject(project);
      } else {
        await client.createProject(project);
      }
      setProjects(prev => {
        const next = editingId && editingId !== 'new'
          ? prev.map(p => (p.id === project.id ? project : p))
          : [project, ...prev];
        return next.sort((a, b) => b.startDate.localeCompare(a.startDate));
      });
      cancelEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      setError(null);
      await client.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-surface-900">Projects</h2>
        <button
          type="button"
          onClick={() => {
            setEditingId('new');
            setForm(emptyProject());
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          + Add Project
        </button>
      </div>

      {error && !editingId && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>}

      {editingId && (
        <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-surface-900">{editingId === 'new' ? 'Add' : 'Edit'} Project</h3>
              <button type="button" onClick={cancelEdit} className="text-surface-500 hover:text-surface-700">
                Cancel
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value as Project['category'] }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Image path/URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={e => setForm(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="/images/projects/my-project.svg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Short description (max 200 chars)</label>
                <input
                  type="text"
                  maxLength={200}
                  value={form.shortDescription}
                  onChange={e => setForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Start date</label>
                <input
                  type="date"
                  value={toDateString(form.startDate)}
                  onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">End date (optional)</label>
                <input
                  type="date"
                  value={toDateString(form.endDate)}
                  onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Live URL (optional)</label>
                <input
                  type="url"
                  value={form.liveUrl || ''}
                  onChange={e => setForm(prev => ({ ...prev, liveUrl: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Code URL (optional)</label>
                <input
                  type="url"
                  value={form.codeUrl || ''}
                  onChange={e => setForm(prev => ({ ...prev, codeUrl: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Full description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Tech Stack</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.techStack.map((tech, i) => (
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

            <label className="flex items-center gap-2 text-sm text-surface-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))}
              />
              Featured project
            </label>

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
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-surface-900">{project.title}</h3>
                  {project.featured && <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">Featured</span>}
                  <span className="px-2 py-0.5 text-xs bg-surface-100 text-surface-600 rounded-full">{project.category}</span>
                </div>
                <p className="text-surface-600 mt-1">{project.shortDescription}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-2 py-0.5 text-xs bg-surface-100 text-surface-600 rounded-full">{tech}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(project)}
                  className="px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
