'use client'

import { useState } from 'react'
import { 
  Play, Clock, Target, 
  Users, 
  CheckCircle2, Star
} from 'lucide-react'

interface LearningObjective {
  id: string
  title: string
  description: string
  required: boolean
}

interface Scenario {
  id: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: number // in minutes
  category: string
  objectives: LearningObjective[]
  initialBalance: number
  marketConditions: string
  keyLearnings: string[]
  completed: boolean
  bestScore?: number
  participants?: number
}

interface LearningScenariosProps {
  scenarios: Scenario[]
  onStartScenario: (scenarioId: string) => void
}

export function LearningScenarios({ scenarios, onStartScenario }: LearningScenariosProps) {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'Advanced':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const filteredScenarios = filterDifficulty === 'all' 
    ? scenarios 
    : scenarios.filter(s => s.difficulty.toLowerCase() === filterDifficulty)

  const completedCount = scenarios.filter(s => s.completed).length

  return (
    <div className="dashboard-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white shadow-lg">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Learning Scenarios
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {completedCount}/{scenarios.length} scenarios completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {Math.round((completedCount / scenarios.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / scenarios.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredScenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`p-5 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
              scenario.completed 
                ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600'
            } hover:shadow-lg`}
            onClick={() => setSelectedScenario(scenario)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {scenario.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {scenario.description}
                </p>
              </div>
              {scenario.completed && (
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(scenario.difficulty)}`}>
                {scenario.difficulty}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                {scenario.category}
              </span>
              {scenario.bestScore && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                  Best: {scenario.bestScore}%
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{scenario.duration} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{scenario.objectives.length} objectives</span>
              </div>
              {scenario.participants && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{scenario.participants}</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onStartScenario(scenario.id)
              }}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                scenario.completed
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              <Play className="w-4 h-4" />
              {scenario.completed ? 'Retry Scenario' : 'Start Scenario'}
            </button>
          </div>
        ))}
      </div>

      {/* Scenario Detail Modal */}
      {selectedScenario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedScenario(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedScenario.title}
              </h2>
              <button
                onClick={() => setSelectedScenario(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Overview */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Scenario Overview</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedScenario.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Initial Balance</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    ${selectedScenario.initialBalance.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Market Conditions</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {selectedScenario.marketConditions}
                  </div>
                </div>
              </div>

              {/* Learning Objectives */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Learning Objectives</h3>
                <div className="space-y-2">
                  {selectedScenario.objectives.map((objective) => (
                    <div key={objective.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className={`w-4 h-4 mt-0.5 rounded-full ${objective.required ? 'bg-red-500' : 'bg-blue-500'}`} />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {objective.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {objective.description}
                        </div>
                        {objective.required && (
                          <span className="text-xs text-red-600 dark:text-red-400 font-medium">Required</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Learnings */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">What You&apos;ll Learn</h3>
                <div className="space-y-2">
                  {selectedScenario.keyLearnings.map((learning, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{learning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  onStartScenario(selectedScenario.id)
                  setSelectedScenario(null)
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <Play className="w-5 h-5" />
                Start This Scenario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}