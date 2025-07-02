'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, TrendingUp, Target, 
  Award, Clock, Activity, Zap
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { TeamMetrics } from './types'

interface EnhancedAnalyticsTabProps {
  teamMetrics: TeamMetrics
}

export default function EnhancedAnalyticsTab({ }: EnhancedAnalyticsTabProps) {
  const { isDark: darkMode } = useTheme()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('performance')

  // Mock analytics data
  const performanceData = [
    { period: 'Week 1', value: 82, target: 85 },
    { period: 'Week 2', value: 85, target: 85 },
    { period: 'Week 3', value: 88, target: 85 },
    { period: 'Week 4', value: 91, target: 85 },
  ]

  const departmentData = [
    { name: 'Investment Banking', performance: 95, trend: '+5%', members: 8 },
    { name: 'Risk Management', performance: 91, trend: '+2%', members: 5 },
    { name: 'Wealth Management', performance: 89, trend: '+3%', members: 6 },
    { name: 'Operations', performance: 88, trend: '+1%', members: 5 }
  ]

  const insights = [
    {
      type: 'success',
      title: 'Outstanding Performance',
      description: 'Investment Banking team exceeded targets by 10%',
      priority: 'high',
      icon: Award
    },
    {
      type: 'info',
      title: 'Training Completion Surge',
      description: '15% increase in module completions this week',
      priority: 'medium',
      icon: TrendingUp
    },
    {
      type: 'warning',
      title: 'Attention Required',
      description: '3 team members approaching deadline',
      priority: 'high',
      icon: Clock
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Analytics Header */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Performance Analytics
            </h2>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Comprehensive insights into team performance and productivity trends
            </p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`px-4 py-2 rounded-xl border transition-all ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-400' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg">
              <BarChart3 className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Team Productivity', 
            value: '94%', 
            change: '+5%', 
            trend: 'up',
            icon: Activity,
            color: 'emerald'
          },
          { 
            label: 'Engagement Score', 
            value: '4.8/5', 
            change: '+0.3', 
            trend: 'up',
            icon: Zap,
            color: 'blue'
          },
          { 
            label: 'Training Velocity', 
            value: '2.4x', 
            change: '+0.6x', 
            trend: 'up',
            icon: TrendingUp,
            color: 'purple'
          },
          { 
            label: 'Goal Achievement', 
            value: '87%', 
            change: '+12%', 
            trend: 'up',
            icon: Target,
            color: 'orange'
          }
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-2xl border transition-all hover:scale-105 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70' 
                : 'bg-white border-gray-200 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br from-${kpi.color}-500 to-${kpi.color}-600`}>
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`text-sm font-medium flex items-center gap-1 ${
                kpi.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
              }`}>
                <TrendingUp className="w-4 h-4" />
                {kpi.change}
              </div>
            </div>
            
            <div className={`text-3xl font-bold mb-1 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {kpi.value}
            </div>
            
            <div className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {kpi.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Chart & Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend Chart */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Performance Trend
            </h3>
            <div className="flex gap-2">
              {['performance', 'engagement', 'productivity'].map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    selectedMetric === metric
                      ? 'bg-emerald-500 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Chart Visualization */}
          <div className="space-y-4">
            {performanceData.map((data, index) => (
              <div key={data.period} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {data.period}
                  </span>
                  <span className={`text-sm font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {data.value}%
                  </span>
                </div>
                
                <div className="relative">
                  <div className={`h-3 rounded-full ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.value}%` }}
                      transition={{ delay: index * 0.2, duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                    />
                  </div>
                  
                  {/* Target Line */}
                  <div 
                    className="absolute top-0 h-3 w-1 bg-red-500 rounded-full opacity-70"
                    style={{ left: `${data.target}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-gradient-to-r from-emerald-500 to-emerald-600" />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Current Performance
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-red-500 rounded" />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Target (85%)
              </span>
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className={`p-6 rounded-2xl border ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-xl font-semibold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Department Rankings
          </h3>
          
          <div className="space-y-4">
            {departmentData.map((dept, index) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border transition-all hover:scale-105 ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/70' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                      index === 2 ? 'bg-gradient-to-r from-orange-600 to-red-500' :
                      'bg-gradient-to-r from-emerald-500 to-teal-600'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className={`font-semibold text-sm ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {dept.name}
                      </div>
                      <div className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {dept.members} members
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {dept.performance}%
                    </div>
                    <div className="text-emerald-500 text-xs font-medium">
                      {dept.trend}
                    </div>
                  </div>
                </div>
                
                <div className={`h-2 rounded-full ${
                  darkMode ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.performance}%` }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights & Recommendations */}
      <div className={`p-6 rounded-2xl border ${
        darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-semibold mb-6 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          AI-Powered Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border-l-4 transition-all hover:scale-105 ${
                insight.type === 'success' ? 'border-l-emerald-500' :
                insight.type === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-500'
              } ${
                darkMode 
                  ? 'bg-gray-700/50 border-r border-t border-b border-gray-600' 
                  : 'bg-gray-50 border-r border-t border-b border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  insight.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                  insight.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 
                  'bg-blue-100 text-blue-600'
                } ${darkMode && insight.type === 'success' ? 'bg-emerald-900/30 text-emerald-400' : ''}
                  ${darkMode && insight.type === 'warning' ? 'bg-yellow-900/30 text-yellow-400' : ''}
                  ${darkMode && insight.type === 'info' ? 'bg-blue-900/30 text-blue-400' : ''}`}>
                  <insight.icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {insight.title}
                  </h4>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {insight.description}
                  </p>
                  
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      insight.priority === 'high' 
                        ? darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
                        : darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {insight.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}