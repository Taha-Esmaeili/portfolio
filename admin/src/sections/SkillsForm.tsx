import React, { useState, useEffect } from 'react';
import type { SkillCategory, Skill } from '../types';

interface SkillsFormProps {
  data: SkillCategory[];
  onSave: (data: SkillCategory[]) => void;
  saving: boolean;
}

export function SkillsForm({ data, onSave, saving }: SkillsFormProps) {
  const [categories, setCategories] = useState<SkillCategory[]>(data);

  useEffect(() => {
    setCategories(data);
  }, [data]);

  const addSkill = (catIndex: number) => {
    setCategories(cats => cats.map((cat, i) =>
      i === catIndex ? { ...cat, skills: [...cat.skills, { id: '', name: '', category: cat.key, icon: '', proficiency: 3, yearsExperience: 1, description: '' }] } : cat
    ));
  };

  const removeSkill = (catIndex: number, skillIndex: number) => {
    setCategories(cats => cats.map((cat, i) =>
      i === catIndex ? { ...cat, skills: cat.skills.filter((_, si) => si !== skillIndex) } : cat
    ));
  };

  const updateSkill = (catIndex: number, skillIndex: number, field: keyof Skill, value: any) => {
    setCategories(cats => cats.map((cat, i) =>
      i === catIndex ? {
        ...cat,
        skills: cat.skills.map((skill, si) =>
          si === skillIndex ? { ...skill, [field]: value } : skill
        )
      } : cat
    ));
  };

  const addCategory = () => {
    setCategories([...categories, { key: 'tools', label: '', icon: 'mdi:tag', skills: [] }]);
  };

  const removeCategory = (index: number) => {
    setCategories(cats => cats.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, field: 'key' | 'label' | 'icon', value: string) => {
    setCategories(cats => cats.map((cat, i) =>
      i === index ? { ...cat, [field]: field === 'key' ? (value as SkillCategory['key']) : value } : cat
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(categories);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {categories.map((category, catIndex) => (
        <div key={catIndex} className="bg-white rounded-xl shadow-sm border border-surface-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-surface-900">Category {catIndex + 1}</h3>
            <button
              type="button"
              onClick={() => removeCategory(catIndex)}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Remove Category
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Key (unique ID)</label>
              <input
                type="text"
                value={category.key}
                onChange={e => updateCategory(catIndex, 'key', e.target.value)}
                className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., frontend"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Label</label>
              <input
                type="text"
                value={category.label}
                onChange={e => updateCategory(catIndex, 'label', e.target.value)}
                className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Frontend Development"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Icon</label>
              <input
                type="text"
                value={category.icon}
                onChange={e => updateCategory(catIndex, 'icon', e.target.value)}
                className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., logos:react"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-surface-900">Skills</h4>
              <button
                type="button"
                onClick={() => addSkill(catIndex)}
                className="px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
              >
                + Add Skill
              </button>
            </div>
            {category.skills.map((skill, skillIndex) => (
              <div key={skillIndex} className="bg-surface-50 rounded-lg p-4 space-y-3 border border-surface-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-surface-900">Skill {skillIndex + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(catIndex, skillIndex)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={e => updateSkill(catIndex, skillIndex, 'name', e.target.value)}
                      className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="React"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Icon</label>
                    <input
                      type="text"
                      value={skill.icon}
                      onChange={e => updateSkill(catIndex, skillIndex, 'icon', e.target.value)}
                      className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="logos:react"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Proficiency (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={skill.proficiency}
                      onChange={e => updateSkill(catIndex, skillIndex, 'proficiency', parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      value={skill.yearsExperience}
                      onChange={e => updateSkill(catIndex, skillIndex, 'yearsExperience', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={skill.description || ''}
                      onChange={e => updateSkill(catIndex, skillIndex, 'description', e.target.value)}
                      className="w-full px-4 py-2.5 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Optional description"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={addCategory}
          className="px-6 py-3 border-2 border-dashed border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
        >
          + Add Category
        </button>
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