import React, { useState, useEffect } from 'react';
import type { ContactContent } from '../types';

interface ContactFormProps {
  data: ContactContent;
  onSave: (data: ContactContent) => void;
  saving: boolean;
}

export function ContactForm({ data, onSave, saving }: ContactFormProps) {
  const [form, setForm] = useState<ContactContent>({
    email: data.email,
    phone: data.phone,
    availability: data.availability,
    accessKey: data.accessKey,
  });

  useEffect(() => {
    setForm(data);
  }, [data]);

  const handleChange = (field: keyof ContactContent, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-surface-900">Contact Information</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Availability</label>
          <textarea
            value={form.availability}
            onChange={e => handleChange('availability', e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Open to remote opportunities worldwide. Freelance, Contract, Full-time."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1">Web3Forms Access Key (for contact form)</label>
          <input
            type="text"
            value={form.accessKey || ''}
            onChange={e => handleChange('accessKey', e.target.value)}
            className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="YOUR_WEB3FORMS_KEY"
          />
          <p className="mt-1 text-xs text-surface-500">Get your key at <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">web3forms.com</a></p>
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