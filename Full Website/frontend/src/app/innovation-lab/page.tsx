'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedLayout from '@/components/layout/ProtectedLayout';
import InnovationLabHero from '@/components/innovation-lab/InnovationLabHero';
import ChallengeSubmissionForm from '@/components/innovation-lab/ChallengeSubmissionForm';
import PublishedChallenges from '@/components/innovation-lab/PublishedChallenges';
import MyChallenges from '@/components/innovation-lab/MyChallenges';
import { Sparkles, BarChart3 } from 'lucide-react';

export default function InnovationLabPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshChallenges, setRefreshChallenges] = useState(0);
  const [activeTab, setActiveTab] = useState('explore');

  const handleChallengeSubmitted = () => {
    setShowForm(false);
    setRefreshChallenges(prev => prev + 1);
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-blue-950 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Hero Section */}
        <InnovationLabHero onCreateChallenge={() => setShowForm(true)} showButton={!showForm} />

        {/* Challenge Submission Section */}
        <AnimatePresence mode="wait">
          {showForm && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative z-10 py-16 px-4 sm:px-6 lg:px-8"
            >
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                    Submit Your Innovation Challenge
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
                <ChallengeSubmissionForm onSubmit={handleChallengeSubmitted} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        {!showForm && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative z-10 py-8 px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 flex">
                  <button
                    onClick={() => setActiveTab('explore')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      activeTab === 'explore'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 inline mr-2" />
                    Explore Challenges
                  </button>
                  <button
                    onClick={() => setActiveTab('manage')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      activeTab === 'manage'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-5 h-5 inline mr-2" />
                    My Challenges
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Content Based on Active Tab */}
        {!showForm && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-sm"
          >
            <div className="max-w-7xl mx-auto">
              {activeTab === 'explore' ? (
                <>
                  <h2 className="text-3xl font-bold text-white mb-8 text-center">
                    Active Innovation Challenges
                  </h2>
                  <PublishedChallenges key={refreshChallenges} />
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-white mb-8 text-center">
                    Your Challenge Dashboard
                  </h2>
                  <MyChallenges />
                </>
              )}
            </div>
          </motion.section>
        )}
      </div>
    </ProtectedLayout>
  );
}