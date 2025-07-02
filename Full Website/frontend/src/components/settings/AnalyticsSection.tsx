'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useSettingsContext } from '@/components/settings/SettingsProvider'
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  BookOpen, 
  Trophy, 
  Target, 
  Award,
  Star,
  Download,
  Filter,
  RefreshCw,
  Clock
} from 'lucide-react'




const AnalyticsSection: React.FC = () => {
  const { analytics, loadAnalytics, analyticsLoading, isLoading } = useSettingsContext()
  const [selectedTimeframe, setSelectedTimeframe] = useState('month')
  
  const onLoadAnalytics = (timeframe?: string) => {
    loadAnalytics(timeframe)
  }
  
  // Show loading state if analytics aren't loaded yet
  if (analyticsLoading && !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const timeframeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ]

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe)
    onLoadAnalytics(timeframe)
  }

  if (analyticsLoading) {
    return (
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            Personal Analytics
          </h2>
          <p className="text-gray-600">View your learning progress and performance analytics</p>
        </motion.div>

        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin h-12 w-12 border-4 border-slate-600 border-t-transparent rounded-full"></div>
            <div className="text-gray-600 text-lg">Loading your analytics...</div>
            <div className="text-gray-400 text-sm">This may take a moment</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          Personal Analytics
        </h2>
        <p className="text-gray-600">View your learning progress and performance analytics</p>
      </motion.div>

      <div className="space-y-8">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Timeframe:</span>
            </div>
            <select
              value={selectedTimeframe}
              onChange={(e) => handleTimeframeChange(e.target.value)}
              disabled={isLoading}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500"
            >
              {timeframeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLoadAnalytics(selectedTimeframe)}
              disabled={analyticsLoading || isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${analyticsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-2 bg-slate-600 text-white text-sm rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </motion.div>

        {analytics ? (
          <>
            {/* Learning Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-200 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-700" />
                  </div>
                  <div className="text-sm font-medium text-blue-700">Total Hours</div>
                </div>
                <div className="text-3xl font-bold text-blue-900 mb-1">
                  {analytics.learningProgress?.totalHours || 0}
                </div>
                <div className="text-sm text-blue-600">Learning time</div>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-200 rounded-lg">
                    <BookOpen className="h-5 w-5 text-green-700" />
                  </div>
                  <div className="text-sm font-medium text-green-700">Modules</div>
                </div>
                <div className="text-3xl font-bold text-green-900 mb-1">
                  {analytics.learningProgress?.modulesCompleted || 0}
                </div>
                <div className="text-sm text-green-600">Completed</div>
              </div>

              <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-yellow-200 rounded-lg">
                    <Target className="h-5 w-5 text-yellow-700" />
                  </div>
                  <div className="text-sm font-medium text-yellow-700">Average Score</div>
                </div>
                <div className="text-3xl font-bold text-yellow-900 mb-1">
                  {analytics.learningProgress?.averageScore || 0}%
                </div>
                <div className="text-sm text-yellow-600">Performance</div>
              </div>

              <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-200 rounded-lg">
                    <Trophy className="h-5 w-5 text-red-700" />
                  </div>
                  <div className="text-sm font-medium text-red-700">Current Streak</div>
                </div>
                <div className="text-3xl font-bold text-red-900 mb-1">
                  {analytics.learningProgress?.streak || 0}
                </div>
                <div className="text-sm text-red-600">Days</div>
              </div>
            </motion.div>

            {/* Skill Development */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="h-5 w-5 text-slate-600" />
                <h4 className="text-lg font-semibold text-gray-900">Skill Development</h4>
              </div>

              <div className="space-y-4">
                {analytics.learningProgress?.skillDevelopment?.map((skill: any) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                      <span className="text-sm text-gray-600">{skill.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div 
                        className="bg-gradient-to-r from-slate-500 to-slate-600 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.progress}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-6 text-gray-500">
                    No skill development data available
                  </div>
                )}
              </div>
            </motion.div>

            {/* Peer Comparison */}
            {analytics.peerComparison && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <PieChart className="h-5 w-5 text-slate-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Department Comparison</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      #{analytics.peerComparison.departmentRank}
                    </div>
                    <div className="text-sm text-gray-600">Department Rank</div>
                    <div className="text-xs text-gray-500 mt-1">
                      out of {analytics.peerComparison.totalInDepartment}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {analytics.peerComparison.scoreVsAverage > 0 ? '+' : ''}
                      {analytics.peerComparison.scoreVsAverage}%
                    </div>
                    <div className="text-sm text-gray-600">vs Average</div>
                    <div className="text-xs text-gray-500 mt-1">
                      department performance
                    </div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      +{analytics.peerComparison.improvementRate}%
                    </div>
                    <div className="text-sm text-gray-600">Improvement</div>
                    <div className="text-xs text-gray-500 mt-1">
                      this period
                    </div>
                  </div>

                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor((analytics.peerComparison?.scoreVsAverage || 0) / 20) 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">Performance</div>
                    <div className="text-xs text-gray-500 mt-1">
                      overall rating
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Career Analytics */}
            {analytics.careerAnalytics && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Award className="h-5 w-5 text-slate-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Career Development</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Promotion Readiness</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Overall Score</span>
                        <span className="text-sm font-medium">{analytics.careerAnalytics.promotionReadiness}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${analytics.careerAnalytics.promotionReadiness}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Skill Gaps</h5>
                    <div className="space-y-2">
                      {analytics.careerAnalytics.skillGaps?.map((skill: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      )) || (
                        <div className="text-sm text-gray-500">No skill gaps identified</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600 mb-1">
                      ${analytics.careerAnalytics.trainingROI}k
                    </div>
                    <div className="text-sm text-gray-600">Training ROI</div>
                    <div className="text-xs text-gray-500 mt-1">annual value</div>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">
                      ${analytics.careerAnalytics.marketValue}k
                    </div>
                    <div className="text-sm text-gray-600">Market Value</div>
                    <div className="text-xs text-gray-500 mt-1">estimated salary</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Predictive Insights */}
            {analytics.predictiveInsights && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-200 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-700" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Predictive Insights</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {new Date(analytics.predictiveInsights.likelyCompletionDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1">Projected Completion</div>
                    <div className="text-xs text-gray-600">current learning path</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600 mb-2">
                      {analytics.predictiveInsights.confidenceScore}%
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1">Confidence Score</div>
                    <div className="text-xs text-gray-600">prediction accuracy</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-3">Recommended Modules</div>
                    <div className="space-y-2">
                      {analytics.predictiveInsights.recommendedModules?.slice(0, 3).map((module: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                          <span className="text-gray-700">{module}</span>
                        </div>
                      )) || (
                        <div className="text-sm text-gray-500">No recommendations available</div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">No analytics data available</div>
            <div className="text-gray-400 text-sm mb-4">Start learning to see your progress analytics</div>
            <button
              onClick={() => onLoadAnalytics(selectedTimeframe)}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all"
            >
              Refresh Analytics
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AnalyticsSection