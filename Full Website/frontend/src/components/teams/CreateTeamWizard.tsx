'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CreateTeamData } from '../../types/team';
import { useTeams } from '../../hooks/useTeams';

interface CreateTeamWizardProps {
  onClose: () => void;
}

const CreateTeamWizard: React.FC<CreateTeamWizardProps> = ({ onClose }) => {
  const [submitting, setSubmitting] = useState(false);
  const { createTeam } = useTeams();
  const [formData, setFormData] = useState<CreateTeamData>({
    name: '',
    description: '',
    department: '',
    category: 'Learning Group',
    isPublic: true,
    maxMembers: 20
  });

  const departments = [
    'Customer Service',
    'IT',
    'Human Resources',
    'Finance',
    'Marketing',
    'Operations',
    'Sales',
    'Risk Management',
    'Investment Banking',
    'Retail Banking'
  ];

  const categories = [
    'Project',
    'Learning Group',
    'Social',
    'Competition',
    'Department'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await createTeam(formData);
      onClose();
    } catch (error) {
      console.error('Error creating team:', error);
      // Error is handled by the hook
    } finally {
      setSubmitting(false);
    }
  };

  const updateFormData = (field: keyof CreateTeamData, value: CreateTeamData[keyof CreateTeamData]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Create New Team</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Team Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter team name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your team's purpose"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Department
              </label>
              <select
                required
                value={formData.department}
                onChange={(e) => updateFormData('department', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateFormData('category', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Max Members
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={formData.maxMembers}
                onChange={(e) => updateFormData('maxMembers', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => updateFormData('isPublic', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="isPublic" className="ml-2 text-sm text-white/80">
                Make this team public
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating...' : 'Create Team'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamWizard;