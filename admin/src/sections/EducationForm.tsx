import React, { useState, useEffect } from 'react';
import type { Education } from '../types';
import type { GitHubClient } from '../api/github';

interface EducationFormProps {
  data: Education[];
  client: GitHubClient;
  saving: boolean;
}

export function EducationForm({ data, client, saving }: EducationFormProps) {
  const [educations, setEducations] = useState<Education[]>(data);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Education>>({
    id: '',
    degree: '',
    school: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    setEducations(data);
  }, [data]);

  const startEdit = (edu: Education) => {
    setEditingId(edu.id);
    setForm({
      id: edu.id,
      degree: edu.degree,
      school: edu.school,
      startDate: edu.startDate,
      endDate: edu.endDate,
      location: edu.location,
      description: edu.description,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ id: '', degree: '', school: '', startDate: '', endDate: '', location: '', description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const edu = form as Education;
      if (editingId) {
        await client.updateEducation(edu);
      } else {
        await client.createEducation(edu);
      }
      cancelEdit();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this education?')) return;
    try {
      await client.deleteEducation(id);
      setEducations(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-surface-900">Education</h2>
        <button
          type="button"
          onClick={() => {
            setEditingId('new');
            setForm({ id: '', degree: '', school: '', startDate: '', endDate: '', location: '', description: '' });
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          + Add Education
        </button>
      </div>

      {editingId && (
        <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-surface-900">{editingId === 'new' ? 'Add' : 'Edit'} Education</h3>
              <button type="button" onClick={cancelEdit} className="text-surface-500 hover:text-surface-700">Cancel</button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Degree</label>
                <input
                  type="text"
                  value={form.degree}
                  onChange={e => setForm(prev => ({ ...prev, degree: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                  placeholder="B.Sc. Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">School</label>
                <input
                  type="text"
                  value={form.school}
                  onChange={e => setForm(prev => ({ ...prev, school: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                  placeholder="K. N. Toosi University"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Start Date</label>
                <input
                  type="text"
                  value={form.startDate}
                  onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="2018"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">End Date</label>
                <input
                  type="text"
                  value={form.endDate}
                  onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="2022"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-surface-700 mb-1">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Tehran, Iran"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Optional description"
                />
              </div>
            </div>

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
        {educations.map(edu => (
          <div key={edu.id} className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-surface-900">{edu.degree}</h3>
                <p className="text-primary-600 font-medium">{edu.school}</p>
                <p className="text-sm text-surface-500 mt-1">{edu.startDate} – {edu.endDate || 'Present'}</p>
                {edu.location && <p className="text-sm text-surface-500 mt-1">{edu.location}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(edu)} className="px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200">Edit</button>
                <button onClick={() => handleDelete(edu.id)} className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200">Delete</button>
              </div>
            </div>
            {edu.description && <p className="mt-4 text-surface-600">{edu.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}