'use client'

import { useState } from 'react'
import { 
  Clock, TrendingUp, TrendingDown,
  Award, AlertCircle
} from 'lucide-react'

interface SimulationSession {
  id: string
  date: Date
  duration: number // in minutes
  scenario: string
  initialBalance: number
  finalBalance: number
  totalTrades: number
  successfulTrades: number
  objectives: {
    name: string
    completed: boolean
    score?: number
  }[]
  learningPoints: string[]
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
}

interface SessionHistoryProps {
  sessions: SimulationSession[]
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  const [selectedSession, setSelectedSession] = useState<SimulationSession | null>(null)

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'B': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
      case 'C': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
      case 'D': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'
      case 'F': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  const getPerformanceChange = (session: SimulationSession) => {
    const change = session.finalBalance - session.initialBalance
    const changePercent = (change / session.initialBalance) * 100
    return { change, changePercent }
  }

  const averageGrade = sessions.length > 0 ? 
    sessions.reduce((acc, session) => {
      const gradePoints = { A: 4, B: 3, C: 2, D: 1, F: 0 }
      return acc + gradePoints[session.grade]
    }, 0) / sessions.length : 0

  const totalObjectives = sessions.reduce((acc, session) => acc + session.objectives.length, 0)
  const completedObjectives = sessions.reduce((acc, session) => 
    acc + session.objectives.filter(obj => obj.completed).length, 0)

  return (
    <div className="dashboard-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Simulation History
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {sessions.length} sessions completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Avg: {averageGrade.toFixed(1)}/4.0
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {Math.round((completedObjectives / totalObjectives) * 100)}%
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">Objectives Met</div>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {sessions.reduce((acc, s) => acc + s.duration, 0)}m
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Total Practice</div>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {sessions.reduce((acc, s) => acc + s.totalTrades, 0)}
          </div>
          <div className="text-sm text-purple-700 dark:text-purple-300">Total Trades</div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.slice(0, 5).map((session) => {
          const { change, changePercent } = getPerformanceChange(session)
          const successRate = Math.round((session.successfulTrades / session.totalTrades) * 100)

          return (
            <div
              key={session.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedSession(session)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-sm font-bold ${getGradeColor(session.grade)}`}>
                    {session.grade}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {session.scenario}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {session.date.toLocaleDateString()} • {formatDuration(session.duration)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {change >= 0 ? '+' : ''}${change.toLocaleString()}
                  </div>
                  <div className={`text-sm ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {change >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <span>{session.totalTrades} trades</span>
                  <span>{successRate}% success rate</span>
                  <span>{session.objectives.filter(obj => obj.completed).length}/{session.objectives.length} objectives</span>
                </div>
                {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              </div>
            </div>
          )
        })}
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSession(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Session Details
              </h2>
              <button
                onClick={() => setSelectedSession(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Session Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Scenario</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedSession.scenario}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Performance</h3>
                  <div className={`text-lg font-bold ${getPerformanceChange(selectedSession).change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    Grade: {selectedSession.grade}
                  </div>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Learning Objectives</h3>
                <div className="space-y-2">
                  {selectedSession.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${objective.completed ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <span className="text-gray-900 dark:text-white">{objective.name}</span>
                      </div>
                      {objective.score && (
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {objective.score}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Points */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Key Learning Points</h3>
                <div className="space-y-2">
                  {selectedSession.learningPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-2 p-2">
                      <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}