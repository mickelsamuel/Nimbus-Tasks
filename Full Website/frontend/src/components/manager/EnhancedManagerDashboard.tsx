'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, BarChart3, Target, Award, TrendingUp, Settings,
  Crown, Eye, MessageSquare, Bell, 
  Search, PlusCircle, ArrowUp
} from 'lucide-react'
import { TeamMember, TeamMetrics, ManagerTab } from './types'
import EnhancedAnalyticsTab from './EnhancedAnalyticsTab'
import EnhancedTrainingTab from './EnhancedTrainingTab'
import { useTheme } from '@/contexts/ThemeContext'

interface EnhancedManagerDashboardProps {
  teamMembers: TeamMember[]
  teamMetrics: TeamMetrics
  loading?: boolean
  error?: string
}

const tabs = [
  { id: 'overview', label: 'Executive Overview', icon: Crown, color: 'from-emerald-500 to-teal-600' },
  { id: 'analytics', label: 'Performance Analytics', icon: BarChart3, color: 'from-blue-500 to-indigo-600' },
  { id: 'training', label: 'Training Command', icon: Target, color: 'from-purple-500 to-violet-600' },
  { id: 'achievements', label: 'Achievement Center', icon: Award, color: 'from-yellow-500 to-orange-600' },
  { id: 'development', label: 'Career Development', icon: TrendingUp, color: 'from-pink-500 to-rose-600' },
  { id: 'settings', label: 'Team Settings', icon: Settings, color: 'from-gray-500 to-slate-600' }
] as const

export default function EnhancedManagerDashboard({ 
  teamMembers, 
  teamMetrics
}: EnhancedManagerDashboardProps) {
  const [activeTab, setActiveTab] = useState<ManagerTab>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const { isDark: darkMode } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Enhanced Header Section */}
      <div className={`relative overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900' 
          : 'bg-gradient-to-br from-white via-emerald-50 to-emerald-100'
      }`}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(5,150,105,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(34,197,94,0.1),transparent_50%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          {/* Executive Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className={`p-4 rounded-2xl border-2 ${
                darkMode 
                  ? 'bg-emerald-900/30 border-emerald-400/30' 
                  : 'bg-emerald-100 border-emerald-200'
              }`}>
                <Crown className={`w-12 h-12 ${
                  darkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`} />
              </div>
            </div>
            
            <h1 className={`text-4xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Executive Management Center
            </h1>
            
            <p className={`text-xl mb-6 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Leading {teamMetrics.totalMembers} professionals across 4 departments
            </p>

            {/* Real-time Insights */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className={`px-4 py-2 rounded-full border ${
                darkMode 
                  ? 'bg-emerald-900/20 border-emerald-400/30 text-emerald-400' 
                  : 'bg-emerald-100 border-emerald-200 text-emerald-700'
              }`}>
                🎯 {teamMetrics.activeToday} active today
              </span>
              <span className={`px-4 py-2 rounded-full border ${
                darkMode 
                  ? 'bg-blue-900/20 border-blue-400/30 text-blue-400' 
                  : 'bg-blue-100 border-blue-200 text-blue-700'
              }`}>
                📈 {teamMetrics.averagePerformance}% team performance
              </span>
              <span className={`px-4 py-2 rounded-full border ${
                darkMode 
                  ? 'bg-purple-900/20 border-purple-400/30 text-purple-400' 
                  : 'bg-purple-100 border-purple-200 text-purple-700'
              }`}>
                🏆 {teamMetrics.completionRate}% completion rate
              </span>
            </div>
          </motion.div>

          {/* Key Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {[
              { icon: Users, label: 'Team Members', value: teamMetrics.totalMembers, trend: '+3', color: 'emerald' },
              { icon: Target, label: 'Completion Rate', value: `${teamMetrics.completionRate}%`, trend: '+5%', color: 'blue' },
              { icon: TrendingUp, label: 'Avg Performance', value: `${teamMetrics.averagePerformance}%`, trend: '+2%', color: 'purple' },
              { icon: Eye, label: 'Active Today', value: teamMetrics.activeToday, trend: 'Live', color: 'orange' }
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className={`p-6 rounded-2xl border backdrop-blur-sm transition-all hover:scale-105 ${
                  darkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-white/80 border-white/50 hover:bg-white/90'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br from-${metric.color}-500 to-${metric.color}-600`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
                    <ArrowUp className="w-4 h-4" />
                    {metric.trend}
                  </div>
                </div>
                <div className={`text-3xl font-bold mb-1 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {metric.value}
                </div>
                <div className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Action Commands */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              { icon: PlusCircle, label: 'Assign Training', color: 'emerald' },
              { icon: MessageSquare, label: 'Team Message', color: 'blue' },
              { icon: BarChart3, label: 'Generate Report', color: 'purple' },
              { icon: Bell, label: 'Send Alert', color: 'orange' }
            ].map((action) => (
              <button
                key={action.label}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 shadow-lg bg-gradient-to-r from-${action.color}-500 to-${action.color}-600 text-white hover:shadow-xl`}
              >
                <action.icon className="w-5 h-5" />
                {action.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className={`sticky top-0 z-30 border-b backdrop-blur-sm ${
        darkMode 
          ? 'bg-gray-900/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ManagerTab)}
                className={`flex items-center gap-3 px-6 py-4 font-medium transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? darkMode 
                      ? 'text-emerald-400' 
                      : 'text-emerald-600'
                    : darkMode 
                      ? 'text-gray-400 hover:text-gray-300' 
                      : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className={`p-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : darkMode 
                      ? 'bg-gray-800 text-gray-400' 
                      : 'bg-gray-100 text-gray-600'
                }`}>
                  <tab.icon className="w-5 h-5" />
                </div>
                <span className="hidden sm:block">{tab.label}</span>
                
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-gradient-to-r ${tab.color}`}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <OverviewTabContent 
              teamMembers={teamMembers} 
              darkMode={darkMode}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
            />
          )}
          {activeTab === 'analytics' && (
            <EnhancedAnalyticsTab teamMetrics={teamMetrics} />
          )}
          {activeTab === 'training' && (
            <EnhancedTrainingTab teamMembers={teamMembers} />
          )}
          {activeTab === 'achievements' && (
            <AchievementsTabContent darkMode={darkMode} />
          )}
          {activeTab === 'development' && (
            <DevelopmentTabContent darkMode={darkMode} />
          )}
          {activeTab === 'settings' && (
            <SettingsTabContent darkMode={darkMode} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Overview Tab Content
function OverviewTabContent({ 
  teamMembers, 
  darkMode,
  searchTerm,
  setSearchTerm,
  selectedDepartment,
  setSelectedDepartment
}: {
  teamMembers: TeamMember[]
  darkMode: boolean
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedDepartment: string
  setSelectedDepartment: (dept: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Search and Filter Section */}
      <div className={`p-6 rounded-2xl border ${
        darkMode 
          ? 'bg-gray-800/50 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-semibold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Team Management Center
        </h3>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-3 w-5 h-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
            />
          </div>
          
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className={`px-4 py-3 rounded-xl border transition-all ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-400' 
                : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500'
            } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
          >
            <option value="all">All Departments</option>
            <option value="Risk Management">Risk Management</option>
            <option value="Investment Banking">Investment Banking</option>
            <option value="Wealth Management">Wealth Management</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {teamMembers.filter(member => 
          (selectedDepartment === 'all' || member.department === selectedDepartment) &&
          (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           member.role.toLowerCase().includes(searchTerm.toLowerCase()))
        ).map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-2xl border transition-all hover:scale-105 hover:shadow-xl ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
                : 'bg-white border-gray-200 hover:shadow-lg'
            }`}
          >
            {/* Member Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <Image
                  src={member.avatar}
                  alt={member.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/30"
                />
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 ${
                  darkMode ? 'border-gray-800' : 'border-white'
                } ${
                  member.status === 'active' ? 'bg-emerald-500' :
                  member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
              </div>
              
              <div className="flex-1">
                <h4 className={`font-semibold text-lg ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {member.name}
                </h4>
                <p className={`text-sm ${
                  darkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  {member.role}
                </p>
                <p className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {member.department}
                </p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Performance
                  </span>
                  <span className={`text-sm font-bold ${
                    member.performance >= 90 ? 'text-emerald-500' :
                    member.performance >= 80 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {member.performance}%
                  </span>
                </div>
                <div className={`h-2 rounded-full ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                    style={{ width: `${member.performance}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Training Progress
                  </span>
                  <span className={`text-sm font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {member.completedModules}/{member.totalModules}
                  </span>
                </div>
                <div className={`h-2 rounded-full ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                    style={{ width: `${(member.completedModules / member.totalModules) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Skills Tags */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {member.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      darkMode 
                        ? 'bg-blue-900/30 text-blue-400 border border-blue-400/30' 
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-6">
              <button className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                darkMode 
                  ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-400/30 hover:bg-emerald-900/50' 
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200'
              }`}>
                Assign Training
              </button>
              <button className={`py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}>
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Placeholder components for other tabs

function AchievementsTabContent({ darkMode }: { darkMode: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className={`p-8 rounded-2xl border text-center ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <Award className={`w-16 h-16 mx-auto mb-4 ${
          darkMode ? 'text-yellow-400' : 'text-yellow-600'
        }`} />
        <h3 className={`text-2xl font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Achievement Center
        </h3>
        <p className={`text-lg ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Achievement tracking system coming soon...
        </p>
      </div>
    </motion.div>
  )
}

function DevelopmentTabContent({ darkMode }: { darkMode: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className={`p-8 rounded-2xl border text-center ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <TrendingUp className={`w-16 h-16 mx-auto mb-4 ${
          darkMode ? 'text-pink-400' : 'text-pink-600'
        }`} />
        <h3 className={`text-2xl font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Career Development
        </h3>
        <p className={`text-lg ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Career development tools coming soon...
        </p>
      </div>
    </motion.div>
  )
}

function SettingsTabContent({ darkMode }: { darkMode: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className={`p-8 rounded-2xl border text-center ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <Settings className={`w-16 h-16 mx-auto mb-4 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`} />
        <h3 className={`text-2xl font-bold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Team Settings
        </h3>
        <p className={`text-lg ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Team configuration settings coming soon...
        </p>
      </div>
    </motion.div>
  )
}