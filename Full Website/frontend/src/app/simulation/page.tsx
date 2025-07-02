'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { SessionHistory } from '@/components/simulation/SessionHistory'
import { LearningScenarios } from '@/components/simulation/LearningScenarios'
import { PerformanceInsights } from '@/components/simulation/PerformanceInsights'
import { useSimulationData } from '@/hooks/useSimulationData'
import api from '@/lib/api/client'
import { 
  TrendingUp, Target, Award, BookOpen, 
  Play, Clock, AlertTriangle, RefreshCw
} from 'lucide-react'

export default function SimulationPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('scenarios')
  const { portfolio, marketData, error, refreshData } = useSimulationData()
  const [scenarios, setScenarios] = useState([])
  const [sessions, setSessions] = useState([])
  const [userPerformance, setUserPerformance] = useState(null)
  const [insights, setInsights] = useState([])
  const [, setLoadingData] = useState(false)

  // Fetch all simulation data from API
  useEffect(() => {
    const fetchSimulationData = async () => {
      try {
        setLoadingData(true)
        
        // Fetch all simulation data in parallel
        const [scenariosRes, sessionsRes, performanceRes, insightsRes] = await Promise.all([
          api.get('/simulation/challenges'),
          api.get('/simulation/sessions'),
          api.get('/simulation/performance'),
          api.get('/simulation/insights')
        ])
        
        if (scenariosRes.data.success) {
          // Transform challenges to scenarios format
          const challenges = scenariosRes.data.challenges || []
          const transformedScenarios = challenges.map((challenge: any) => ({
            id: challenge.id?.toString() || Math.random().toString(),
            title: challenge.title || 'Trading Challenge',
            description: challenge.description || 'Practice your trading skills',
            difficulty: 'Intermediate' as const,
            duration: 30,
            category: 'Trading',
            objectives: [],
            initialBalance: 100000,
            marketConditions: 'Normal',
            keyLearnings: [],
            completed: challenge.status === 'completed',
            bestScore: challenge.status === 'completed' ? 85 : undefined,
            participants: challenge.participants || 0
          }))
          setScenarios(transformedScenarios)
        }
        
        if (sessionsRes.data.success) {
          // Transform sessions to expected format
          const sessions = sessionsRes.data.sessions || []
          const transformedSessions = sessions.map((session: any) => ({
            ...session,
            id: session.id?.toString() || Math.random().toString(),
            date: new Date(session.startTime || Date.now()),
            scenario: session.scenario || 'Trading Practice',
            initialBalance: session.performance?.initialValue || 100000,
            finalBalance: session.performance?.finalValue || 100000,
            totalTrades: session.performance?.trades || 0,
            successfulTrades: Math.floor((session.performance?.trades || 0) * 0.6),
            objectives: [],
            learningPoints: []
          }))
          setSessions(transformedSessions)
        }
        
        if (performanceRes.data.success) {
          setUserPerformance(performanceRes.data.performance || {
            totalSessions: 0,
            averageReturn: 0,
            winRate: 0,
            riskScore: 0,
            learningProgress: 0
          })
        }
        
        if (insightsRes.data.success) {
          setInsights(insightsRes.data.insights || [])
        }
      } catch (error) {
        console.error('Simulation data fetch error:', error)
        // Fallback to empty state if API is not available
        setScenarios([])
        setSessions([])
        setUserPerformance({
          totalSessions: 0,
          averageReturn: 0,
          winRate: 0,
          riskScore: 0,
          learningProgress: 0
        })
        setInsights([])
      } finally {
        setLoadingData(false)
      }
    }
    
    fetchSimulationData()
  }, [])



  // Default benchmarks - could also come from API
  const benchmarks = {
    marketReturn: 8.5,
    peerAverageReturn: 2.8,
    peerWinRate: 58
  }

  const handleStartScenario = (scenarioId: string) => {
    // Navigate to simulation interface
    router.push(`/simulation/scenario/${scenarioId}`)
  }

  const overviewStats = {
    totalHours: sessions.length > 0 ? Math.round(sessions.reduce((acc, session) => acc + (session.duration || 0), 0) / 60 * 10) / 10 : 0,
    scenariosCompleted: scenarios.filter(s => s.completed).length,
    averageGrade: sessions.length > 0 ? sessions.reduce((acc, session) => {
      const gradePoints = { A: 4, B: 3, C: 2, D: 1, F: 0 }
      return acc + (gradePoints[session.grade] || 0)
    }, 0) / sessions.length : 0,
    skillLevel: userPerformance?.learningProgress >= 80 ? 'Advanced' : 
                 userPerformance?.learningProgress >= 60 ? 'Intermediate' : 'Beginner'
  }

  // Show error state if simulation API fails
  if (error && !portfolio && !marketData) {
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
                  Simulation System Unavailable
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {error} - Showing offline content below.
                </p>
                <button 
                  onClick={refreshData} 
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
        {/* Header */}
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Trading Simulation Lab
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Practice trading strategies in a safe environment. Learn through guided scenarios and track your progress.
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
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Practice Time</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {overviewStats.totalHours}h
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
                  <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Scenarios Done</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {overviewStats.scenariosCompleted}/{scenarios.length}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="dashboard-card rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Average Grade</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {overviewStats.averageGrade.toFixed(1)}/4.0
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="dashboard-card rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Skill Level</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {overviewStats.skillLevel}
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
                  { id: 'scenarios', label: 'Learning Scenarios', icon: Target },
                  { id: 'history', label: 'Session History', icon: Clock },
                  { id: 'insights', label: 'Performance Insights', icon: TrendingUp },
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
            {activeTab === 'scenarios' && (
              <LearningScenarios 
                scenarios={scenarios} 
                onStartScenario={handleStartScenario} 
              />
            )}
            {activeTab === 'history' && (
              <SessionHistory sessions={sessions} />
            )}
            {activeTab === 'insights' && userPerformance && (
              <PerformanceInsights 
                userPerformance={userPerformance}
                benchmarks={benchmarks}
                insights={insights}
              />
            )}
          </motion.div>

          {/* Quick Start CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <div className="dashboard-card rounded-xl p-8 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Ready to Practice?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start with a beginner scenario or jump into an advanced challenge. Each scenario teaches specific trading skills.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => handleStartScenario('basic-trading')}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors shadow-lg"
                  >
                    <Play className="w-5 h-5" />
                    Start Beginner Scenario
                  </button>
                  <button 
                    onClick={() => setActiveTab('scenarios')}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
                  >
                    <BookOpen className="w-5 h-5" />
                    Browse All Scenarios
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedLayout>
  )
}