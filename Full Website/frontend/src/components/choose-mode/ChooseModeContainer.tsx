'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Monitor, 
  Gamepad2, 
  BarChart3,
  Briefcase,
  Shield,
  TrendingUp,
  Trophy,
  Users,
  Target,
  Award,
  CheckCircle,
  ArrowRight,
  Building,
  Zap
} from 'lucide-react'

export const ChooseModeContainer: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<'standard' | 'gamified' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const { selectMode } = useAuth()

  const handleModeSelection = (mode: 'standard' | 'gamified') => {
    setSelectedMode(mode)
    setError(null)
  }

  const handleContinue = async () => {
    if (!selectedMode) return
    
    setIsLoading(true)
    setError(null)

    try {
      const result = await selectMode(selectedMode)
      
      if (result.success) {
        if (selectedMode === 'gamified') {
          router.push('/gamified')
        } else {
          router.push('/dashboard')
        }
      } else {
        setError(result.error || 'Failed to select mode. Please try again.')
        setIsLoading(false)
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const standardFeatures = [
    { icon: BarChart3, text: 'Professional Analytics' },
    { icon: Briefcase, text: 'Executive Dashboard' },
    { icon: Shield, text: 'Enterprise Security' },
    { icon: TrendingUp, text: 'Performance Metrics' }
  ]

  const gamifiedFeatures = [
    { icon: Trophy, text: 'Leaderboards' },
    { icon: Users, text: 'Team Collaboration' },
    { icon: Target, text: 'Progress Tracking' },
    { icon: Award, text: 'Achievements & Rewards' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #E01A1A 0%, transparent 50%), radial-gradient(circle at 75% 75%, #E01A1A 0%, transparent 50%)`
        }} />
      </div>

      {/* Error Notification */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Learning Experience
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Select the mode that best fits your learning preferences and professional goals.
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full mb-12">
          {/* Standard Mode Card */}
          <div 
            className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              selectedMode === 'standard' 
                ? 'border-blue-500 shadow-xl shadow-blue-500/20 scale-[1.02]' 
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-lg'
            }`}
            onClick={() => handleModeSelection('standard')}
          >
            {/* Selection Indicator */}
            {selectedMode === 'standard' && (
              <div className="absolute -top-3 -right-3 bg-blue-500 rounded-full p-2 shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            )}

            <div className="p-8">
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
                <Monitor className="h-8 w-8 text-white" />
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Professional Suite
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                A focused, executive-level experience designed for professional development and strategic learning.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {standardFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <feature.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-200 dark:border-blue-800 rounded-full">
                <Building className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">Executive Focus</span>
              </div>
            </div>
          </div>

          {/* Gamified Mode Card */}
          <div 
            className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              selectedMode === 'gamified' 
                ? 'border-purple-500 shadow-xl shadow-purple-500/20 scale-[1.02]' 
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:shadow-lg'
            }`}
            onClick={() => handleModeSelection('gamified')}
          >
            {/* Selection Indicator */}
            {selectedMode === 'gamified' && (
              <div className="absolute -top-3 -right-3 bg-purple-500 rounded-full p-2 shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            )}

            <div className="p-8">
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Banking Academy
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                An engaging, interactive experience with achievements, leaderboards, and collaborative learning features.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {gamifiedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <feature.icon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800 rounded-full">
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
                <span className="text-purple-700 dark:text-purple-300 font-semibold text-sm">Interactive Learning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        {selectedMode && (
          <button
            onClick={handleContinue}
            disabled={isLoading}
            className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedMode === 'standard'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-500/25'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-500/25'
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-top-transparent" />
            ) : (
              <>
                <span>
                  {selectedMode === 'standard' ? 'Enter Professional Suite' : 'Begin Banking Academy'}
                </span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p>© 2025 National Bank of Canada Training Platform</p>
        </div>
      </div>
    </div>
  )
}