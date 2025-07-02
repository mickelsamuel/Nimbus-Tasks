'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { MentorshipTracking } from '@/components/career/MentorshipTracking'
import { SkillGapAnalysis } from '@/components/career/SkillGapAnalysis'
import { CareerPathPlanning } from '@/components/career/CareerPathPlanning'
import { useCareerData } from '@/hooks/career/useCareerData'
import { 
  MapPin, Users, TrendingUp, 
  Clock, Briefcase, AlertTriangle, RefreshCw
} from 'lucide-react'

export default function CareerPage() {
  const [activeTab, setActiveTab] = useState('planning')
  const { careerData, loading, error, refetchData } = useCareerData()

  // Use real data if available, fallback to mock data
  const careerOverview = careerData ? {
    currentRole: careerData.profile?.currentRole || 'Banking Professional',
    yearsOfService: careerData.profile?.yearsOfService || 0,
    nextReview: careerData.profile?.nextReview ? new Date(careerData.profile.nextReview) : new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    skillsCompleted: (careerData.skills as any)?.completed || 0,
    totalSkills: (careerData.skills as any)?.total || 0,
    mentoringSessions: (careerData.mentorship as any)?.sessionsCompleted || 0,
    careerGoalsProgress: careerData.goals?.overallProgress || 0
  } : {
    currentRole: 'Loading...',
    yearsOfService: 0,
    nextReview: new Date(),
    skillsCompleted: 0,
    totalSkills: 0,
    mentoringSessions: 0,
    careerGoalsProgress: 0
  }

  // Show error state if career API fails
  if (error && !careerData) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
          <div className="container mx-auto px-4 lg:px-6 py-12">
            <div className="max-w-2xl mx-auto">
              <div className="dashboard-card rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                  Unable to Load Career Data
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error} - Using offline content below.
                </p>
                <button 
                  onClick={refetchData} 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    )
  }


  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="container mx-auto px-4 lg:px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Professional Development Center
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Plan your career growth, develop skills, and connect with mentors
            </p>
          </motion.div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="dashboard-card rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Role</span>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {careerOverview.currentRole}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {careerOverview.yearsOfService} years
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="dashboard-card rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Skills Progress</span>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {careerOverview.skillsCompleted as number}/{careerOverview.totalSkills as number}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {Math.round(((careerOverview.skillsCompleted as number)/(careerOverview.totalSkills as number)) * 100)}% complete
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="dashboard-card rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Mentoring</span>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {careerOverview.mentoringSessions as number}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                sessions completed
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="dashboard-card rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Next Review</span>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {Math.ceil((careerOverview.nextReview.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {careerOverview.nextReview.toLocaleDateString()}
              </div>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <div className="dashboard-card rounded-xl p-2">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'planning', label: 'Career Planning', icon: MapPin },
                  { id: 'skills', label: 'Skill Development', icon: TrendingUp },
                  { id: 'mentorship', label: 'Mentorship', icon: Users },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'planning' && <CareerPathPlanning careerData={careerData} loading={loading} />}
            {activeTab === 'skills' && <SkillGapAnalysis careerData={careerData} loading={loading} />}
            {activeTab === 'mentorship' && <MentorshipTracking careerData={careerData} loading={loading} />}
          </motion.div>
        </div>
      </div>
    </ProtectedLayout>
  )
}