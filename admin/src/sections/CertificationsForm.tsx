import React, { useState, useEffect } from 'react';
import type { Certification } from '../types';
import type { GitHubClient } from '../api/github';

interface CertificationsFormProps {
  data: Certification[];
  client: GitHubClient;
  saving: boolean;
}

export function CertificationsForm({ data, client, saving }: CertificationsFormProps) {
  const [certifications, setCertifications] = useState<Certification[]>(data);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Certification>>({
    id: '',
    title: '',
    issuer: '',
    date: '',
    url: '',
  });

  useEffect(() => {
    setCertifications(data);
  }, [data]);

  const startEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setForm({
      id: cert.id,
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      url: cert.url || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ id: '', title: '', issuer: '', date: '', url: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cert = form as Certification;
      if (editingId) {
        await client.updateCertification(cert);
      } else {
        await client.createCertification(cert);
      }
      cancelEdit();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certification?')) return;
    try {
      await client.deleteCertification(id);
      setCertifications(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-surface-900">Certifications</h2>
        <button
          type="button"
          onClick={() => {
            setEditingId('new');
            setForm({ id: '', title: '', issuer: '', date: '', url: '' });
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          + Add Certification
        </button>
      </div>

      {editingId && (
        <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-surface-900">{editingId === 'new' ? 'Add' : 'Edit'} Certification</h3>
              <button type="button" onClick={cancelEdit} className="text-surface-500 hover:text-surface-700">Cancel</button>
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
                  placeholder="Machine Learning Operations (MLOps) with Vertex AI"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Issuer</label>
                <input
                  type="text"
                  value={form.issuer}
                  onChange={e => setForm(prev => ({ ...prev, issuer: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                  placeholder="DataCamp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Date</label>
                <input
                  type="text"
                  value={form.date}
                  onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                  placeholder="Aug 2026"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">URL (optional)</label>
                <input
                  type="url"
                  value={form.url || ''}
                  onChange={e => setForm(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="https://datacamp.com/..."
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
        {certifications.map(cert => (
          <div key={cert.id} className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-surface-900">{cert.title}</h3>
                <p className="text-primary-600 font-medium">{cert.issuer}</p>
                <p className="text-sm text-surface-500 mt-1">{cert.date}</p>
                {cert.url && (
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline mt-1 inline-block">
                    View Certificate →
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(cert)} className="px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200">Edit</button>
                <button onClick={() => handleDelete(cert.id)} className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}