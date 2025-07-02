'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Calendar, Users, Target, Award, FileText, Tag } from 'lucide-react';

interface ChallengeSubmissionFormProps {
  onSubmit: () => void;
}

export default function ChallengeSubmissionForm({ onSubmit }: ChallengeSubmissionFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    category: '',
    difficulty: '',
    deadline: '',
    teamSize: '',
    rewards: '',
    prizePool: '',
    successCriteria: '',
    tags: '',
    isPublic: true,
    requirements: '',
    evaluationCriteria: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Process Improvement',
    'Technology Innovation',
    'Sustainability',
    'Employee Experience',
    'Customer Success',
    'Product Development',
    'Cost Optimization',
    'Data & Analytics'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to create challenges');
        return;
      }

      const payload = {
        ...formData,
        maxTeamSize: parseInt(formData.teamSize) || 1,
        prizePool: parseFloat(formData.prizePool) || 0,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        evaluationCriteria: formData.evaluationCriteria.split('\n').map(line => {
          const [criteria, weight] = line.split(':').map(s => s.trim());
          return { criteria, weight: parseInt(weight) || 0 };
        }).filter(ec => ec.criteria)
      };

      const response = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to create challenge');
      }

      const result = await response.json();
      alert('Challenge created successfully!');
      onSubmit();
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('Failed to create challenge. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-white text-sm font-medium mb-2">
            Challenge Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="Enter an engaging title for your challenge"
            required
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-white text-sm font-medium mb-2">
            <FileText className="inline w-4 h-4 mr-2" />
            Challenge Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="Describe the challenge, its goals, and why it matters..."
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            <Target className="inline w-4 h-4 mr-2" />
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
            required
          >
            <option value="" className="bg-gray-900">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Difficulty Level
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
            required
          >
            <option value="" className="bg-gray-900">Select difficulty</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff} className="bg-gray-900">{diff}</option>
            ))}
          </select>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            <Calendar className="inline w-4 h-4 mr-2" />
            Submission Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
            required
          />
        </div>

        {/* Team Size */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            <Users className="inline w-4 h-4 mr-2" />
            Max Team Size
          </label>
          <input
            type="number"
            name="teamSize"
            value={formData.teamSize}
            onChange={handleChange}
            min="1"
            max="10"
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="e.g., 4"
            required
          />
        </div>

        {/* Rewards */}
        <div className="md:col-span-2">
          <label className="block text-white text-sm font-medium mb-2">
            <Award className="inline w-4 h-4 mr-2" />
            Rewards & Recognition
          </label>
          <input
            type="text"
            name="rewards"
            value={formData.rewards}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="e.g., $5,000 prize pool, mentorship opportunities, implementation support"
            required
          />
        </div>

        {/* Success Criteria */}
        <div className="md:col-span-2">
          <label className="block text-white text-sm font-medium mb-2">
            Success Criteria
          </label>
          <textarea
            name="successCriteria"
            value={formData.successCriteria}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="Define what success looks like for this challenge..."
            required
          />
        </div>

        {/* Prize Pool */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Prize Pool ($)
          </label>
          <input
            type="number"
            name="prizePool"
            value={formData.prizePool}
            onChange={handleChange}
            min="0"
            step="100"
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="e.g., 5000"
          />
        </div>

        {/* Make Public */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Visibility
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="w-5 h-5 rounded"
              />
              <span className="text-white">Make this challenge public</span>
            </label>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="md:col-span-2">
          <label className="block text-white text-sm font-medium mb-2">
            Detailed Description (Optional)
          </label>
          <textarea
            name="detailedDescription"
            value={formData.detailedDescription}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="Provide additional details, background, or context..."
          />
        </div>

        {/* Requirements */}
        <div className="md:col-span-2">
          <label className="block text-white text-sm font-medium mb-2">
            Requirements (One per line)
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="Must have 3+ years experience&#10;Knowledge of React required&#10;..."
          />
        </div>

        {/* Evaluation Criteria */}
        <div className="md:col-span-2">
          <label className="block text-white text-sm font-medium mb-2">
            Evaluation Criteria (Format: Criteria: Weight)
          </label>
          <textarea
            name="evaluationCriteria"
            value={formData.evaluationCriteria}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="Innovation: 30&#10;Technical Implementation: 40&#10;Business Impact: 30"
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="block text-white text-sm font-medium mb-2">
            <Tag className="inline w-4 h-4 mr-2" />
            Tags
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
            placeholder="Enter tags separated by commas (e.g., AI, automation, remote-work)"
          />
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={submitting}
        className="mt-8 w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: submitting ? 1 : 1.02 }}
        whileTap={{ scale: submitting ? 1 : 0.98 }}
      >
        {submitting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Innovation Challenge
          </>
        )}
      </motion.button>
    </motion.form>
  );
}