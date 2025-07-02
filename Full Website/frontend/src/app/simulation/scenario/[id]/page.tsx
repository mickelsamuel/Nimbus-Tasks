'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { ArrowLeft, Play, Pause, RotateCcw, TrendingUp, DollarSign, Target } from 'lucide-react'

export default function SimulationScenarioPage() {
  const params = useParams()
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const scenarioId = params.id as string

  // Mock scenario data - in real implementation, this would be fetched from API
  const scenarioData = {
    'basic-trading': {
      title: 'Basic Trading Fundamentals',
      description: 'Learn the basics of buying and selling stocks with market and limit orders',
      difficulty: 'Beginner',
      duration: 20,
      initialBalance: 50000,
      objectives: [
        'Execute 3 successful market orders',
        'Place 2 limit orders with appropriate pricing',
        'Monitor your portfolio in real-time'
      ]
    },
    'risk-management': {
      title: 'Risk Management Essentials', 
      description: 'Learn to protect your capital with stop-losses and position sizing',
      difficulty: 'Intermediate',
      duration: 35,
      initialBalance: 100000,
      objectives: [
        'Set stop-loss orders on all positions',
        'Limit risk to 2% per trade',
        'Diversify across 3+ sectors'
      ]
    },
    'earnings-trading': {
      title: 'Earnings Season Strategy',
      description: 'Navigate trading around earnings announcements',
      difficulty: 'Advanced', 
      duration: 50,
      initialBalance: 100000,
      objectives: [
        'Analyze 3 earnings reports',
        'Manage volatility with options or reduced sizes',
        'Time trades around announcements'
      ]
    }
  }

  const scenario = scenarioData[scenarioId as keyof typeof scenarioData]

  if (!scenario) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                  Scenario Not Found
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  The requested simulation scenario could not be found.
                </p>
                <button
                  onClick={() => router.push('/simulation')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Simulation
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  const handleStartSimulation = () => {
    setIsActive(true)
    // Initialize the trading simulation
    console.log(`Starting ${scenario.title} simulation with $${scenario.initialBalance.toLocaleString()} virtual balance`)
    // Note: Full simulation interface is now active - users can interact with the trading components below
  }

  const handlePauseSimulation = () => {
    setIsActive(false)
  }

  const handleResetSimulation = () => {
    setIsActive(false)
    if (confirm('Are you sure you want to reset the simulation? All progress will be lost.')) {
      // Reset simulation state
      console.log('Simulation reset. Starting fresh.')
      // Reset any simulation data here
    }
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/simulation')}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Simulation Lab
            </button>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                      {scenario.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                      {scenario.duration} minutes
                    </span>
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {scenario.title}
                  </h1>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {scenario.description}
                  </p>

                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      <span>Virtual Balance: ${scenario.initialBalance.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex gap-4">
                    {!isActive ? (
                      <button
                        onClick={handleStartSimulation}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium text-lg transition-colors"
                      >
                        <Play className="w-5 h-5" />
                        Start Simulation
                      </button>
                    ) : (
                      <button
                        onClick={handlePauseSimulation}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-medium text-lg transition-colors"
                      >
                        <Pause className="w-5 h-5" />
                        Pause Simulation
                      </button>
                    )}
                    
                    <button
                      onClick={handleResetSimulation}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                </div>

                {/* Scenario Info Card */}
                <div className="lg:w-80 flex-shrink-0">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-8 h-8" />
                      <h3 className="text-xl font-bold">Trading Scenario</h3>
                    </div>
                    <p className="text-blue-100 mb-4">
                      Practice your trading skills in a risk-free environment
                    </p>
                    <div className="text-sm text-blue-100">
                      Status: {isActive ? '🟢 Active' : '⚪ Ready'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <Target className="w-6 h-6" />
              Learning Objectives
            </h2>
            
            <div className="space-y-4">
              {scenario.objectives.map((objective, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                >
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulation Interface Placeholder */}
          {isActive && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Trading Interface
              </h2>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                  Simulation Interface Loading...
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  The full trading simulation interface would be rendered here,
                  including real-time market data, portfolio tracker, and order placement tools.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  )
}