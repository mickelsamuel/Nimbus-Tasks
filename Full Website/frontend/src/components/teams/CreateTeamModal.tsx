'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Globe, Check } from 'lucide-react';
import { useTeamCategories } from '@/lib/api/teamCategories';

interface CreateTeamData {
  name: string;
  description: string;
  category: string;
  maxMembers: number;
  privacy: 'public' | 'private';
  tags: string[];
  avatar: string;
}

interface CreateTeamModalProps {
  isDark: boolean;
  onClose: () => void;
  onCreateTeam: (teamData: CreateTeamData) => void;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isDark, onClose, onCreateTeam }) => {
  const [step, setStep] = useState(1);
  const [teamData, setTeamData] = useState<CreateTeamData>({
    name: '',
    description: '',
    category: 'Trading',
    maxMembers: 8,
    privacy: 'public',
    tags: [] as string[],
    avatar: '🚀'
  });
  const [tagInput, setTagInput] = useState('');

  const { categories: categoryData, loading: categoriesLoading } = useTeamCategories();
  const categories = categoriesLoading ? ['Trading', 'Learning', 'Innovation', 'Research', 'Networking'] : categoryData.map(cat => cat.name);
  const avatarOptions = ['🚀', '🏆', '🎯', '💎', '⚡', '🔥', '🌟', '🎨', '🧠', '🎪'];
  const maxSteps = 3;

  const handleAddTag = () => {
    if (tagInput.trim() && !teamData.tags.includes(tagInput.trim())) {
      setTeamData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTeamData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleNext = () => {
    if (step < maxSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    onCreateTeam(teamData);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return teamData.name.length >= 3 && teamData.description.length >= 10;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl backdrop-blur-xl border shadow-2xl ${
            isDark 
              ? 'bg-slate-900/90 border-slate-700/50' 
              : 'bg-white/90 border-slate-200/50'
          }`}
        >
          
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDark ? 'border-slate-700/50' : 'border-slate-200/50'
          }`}>
            <div>
              <h2 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Create New Team
              </h2>
              <p className={`text-sm mt-1 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Step {step} of {maxSteps}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                isDark 
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-white' 
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              }`}
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className={`h-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: '33%' }}
              animate={{ width: `${(step / maxSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className={`text-xl font-semibold mb-4 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Basic Information
                    </h3>
                  </div>

                  {/* Team Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Team Name *
                    </label>
                    <input
                      type="text"
                      value={teamData.name}
                      onChange={(e) => setTeamData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your team name..."
                      className={`w-full p-4 rounded-xl border backdrop-blur-xl transition-colors ${
                        isDark 
                          ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 focus:border-blue-500' 
                          : 'bg-white/70 border-slate-200/50 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Description *
                    </label>
                    <textarea
                      value={teamData.description}
                      onChange={(e) => setTeamData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your team's mission and goals..."
                      rows={4}
                      className={`w-full p-4 rounded-xl border backdrop-blur-xl transition-colors resize-none ${
                        isDark 
                          ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 focus:border-blue-500' 
                          : 'bg-white/70 border-slate-200/50 text-slate-900 placeholder-slate-500 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Category
                    </label>
                    <select
                      value={teamData.category}
                      onChange={(e) => setTeamData(prev => ({ ...prev, category: e.target.value }))}
                      className={`w-full p-4 rounded-xl border backdrop-blur-xl ${
                        isDark 
                          ? 'bg-slate-800/50 border-slate-700/50 text-white' 
                          : 'bg-white/70 border-slate-200/50 text-slate-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Settings */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className={`text-xl font-semibold mb-4 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Team Settings
                    </h3>
                  </div>

                  {/* Max Members */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Maximum Members
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="3"
                        max="20"
                        value={teamData.maxMembers}
                        onChange={(e) => setTeamData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className={`font-semibold min-w-[3rem] text-center ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {teamData.maxMembers}
                      </span>
                    </div>
                  </div>

                  {/* Privacy */}
                  <div>
                    <label className={`block text-sm font-medium mb-4 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Privacy Setting
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setTeamData(prev => ({ ...prev, privacy: 'public' }))}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          teamData.privacy === 'public'
                            ? 'border-blue-500 bg-blue-500/10'
                            : isDark
                              ? 'border-slate-700/50 hover:border-slate-600'
                              : 'border-slate-200/50 hover:border-slate-300'
                        }`}
                      >
                        <Globe className={`w-8 h-8 mx-auto mb-2 ${
                          teamData.privacy === 'public' ? 'text-blue-500' : isDark ? 'text-slate-400' : 'text-slate-600'
                        }`} />
                        <div className={`font-medium ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          Public
                        </div>
                        <div className={`text-xs mt-1 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          Anyone can join
                        </div>
                      </button>

                      <button
                        onClick={() => setTeamData(prev => ({ ...prev, privacy: 'private' }))}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          teamData.privacy === 'private'
                            ? 'border-blue-500 bg-blue-500/10'
                            : isDark
                              ? 'border-slate-700/50 hover:border-slate-600'
                              : 'border-slate-200/50 hover:border-slate-300'
                        }`}
                      >
                        <Lock className={`w-8 h-8 mx-auto mb-2 ${
                          teamData.privacy === 'private' ? 'text-blue-500' : isDark ? 'text-slate-400' : 'text-slate-600'
                        }`} />
                        <div className={`font-medium ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          Private
                        </div>
                        <div className={`text-xs mt-1 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          Invite only
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Avatar Selection */}
                  <div>
                    <label className={`block text-sm font-medium mb-4 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Team Avatar
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {avatarOptions.map(avatar => (
                        <button
                          key={avatar}
                          onClick={() => setTeamData(prev => ({ ...prev, avatar }))}
                          className={`p-4 rounded-xl border-2 text-2xl transition-all duration-200 hover:scale-105 ${
                            teamData.avatar === avatar
                              ? 'border-blue-500 bg-blue-500/10'
                              : isDark
                                ? 'border-slate-700/50 hover:border-slate-600'
                                : 'border-slate-200/50 hover:border-slate-300'
                          }`}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Tags and Review */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className={`text-xl font-semibold mb-4 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Final Details
                    </h3>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Tags (Optional)
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        placeholder="Add tags..."
                        className={`flex-1 p-3 rounded-xl border backdrop-blur-xl ${
                          isDark 
                            ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400' 
                            : 'bg-white/70 border-slate-200/50 text-slate-900 placeholder-slate-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                      />
                      <button
                        onClick={handleAddTag}
                        className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                      >
                        Add
                      </button>
                    </div>
                    
                    {teamData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {teamData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 ${
                              isDark 
                                ? 'bg-slate-700/50 text-slate-300' 
                                : 'bg-slate-200/50 text-slate-700'
                            }`}
                          >
                            #{tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className={`hover:text-red-400 transition-colors ${
                                isDark ? 'text-slate-400' : 'text-slate-500'
                              }`}
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Review */}
                  <div className={`p-4 rounded-xl border ${
                    isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-100/50 border-slate-200/50'
                  }`}>
                    <h4 className={`font-semibold mb-3 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Review Your Team
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Name:</span>
                        <span className={isDark ? 'text-white' : 'text-slate-900'}>{teamData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Category:</span>
                        <span className={isDark ? 'text-white' : 'text-slate-900'}>{teamData.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Max Members:</span>
                        <span className={isDark ? 'text-white' : 'text-slate-900'}>{teamData.maxMembers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Privacy:</span>
                        <span className={isDark ? 'text-white' : 'text-slate-900'}>{teamData.privacy}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-between p-6 border-t ${
            isDark ? 'border-slate-700/50' : 'border-slate-200/50'
          }`}>
            <button
              onClick={step === 1 ? onClose : handleBack}
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                isDark 
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            <button
              onClick={step === maxSteps ? handleSubmit : handleNext}
              disabled={!isStepValid()}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                isStepValid()
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-105'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {step === maxSteps ? (
                <>
                  <Check size={18} />
                  Create Team
                </>
              ) : (
                'Next'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateTeamModal;