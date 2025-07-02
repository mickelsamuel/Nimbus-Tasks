'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

export function DashboardLoadingState() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    'Fetching your data...',
    'Analyzing your progress...',
    'Generating insights...',
    'Preparing your dashboard...'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 1500)
    return () => clearInterval(interval)
  }, [steps.length])

  return (
    <div className="min-h-[600px] flex items-center justify-center p-8">
      <div className="text-center max-w-md mx-auto">
        {/* Animated loader with glassmorphism */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500/20 to-purple-600/20 blur-xl animate-pulse" />
          <div className="relative dashboard-card rounded-full p-6">
            <Sparkles className="w-20 h-20 text-primary-500 animate-spin" />
          </div>
        </div>
        
        {/* Loading text */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Loading Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Please wait while we prepare your personalized dashboard
        </p>

        {/* Loading steps with animated progress */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-500
                ${index === currentStep 
                  ? 'bg-primary-50 dark:bg-primary-900/20 scale-105' 
                  : 'bg-gray-50 dark:bg-gray-800/50'
                }
              `}
            >
              <div className="relative">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index === currentStep 
                    ? 'bg-primary-500 text-white' 
                    : index < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                {index === currentStep && (
                  <div className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-75" />
                )}
              </div>
              <span className={`
                text-sm font-medium
                ${index === currentStep 
                  ? 'text-primary-700 dark:text-primary-300' 
                  : 'text-gray-600 dark:text-gray-400'
                }
              `}>
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-8 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-1500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}