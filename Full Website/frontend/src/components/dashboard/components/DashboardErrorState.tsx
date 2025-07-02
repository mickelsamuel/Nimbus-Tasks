'use client'

import { AlertCircle, RefreshCw, MessageCircle, WifiOff } from 'lucide-react'

interface DashboardErrorStateProps {
  onRetry: () => void
}

export function DashboardErrorState({ onRetry }: DashboardErrorStateProps) {
  return (
    <div className="min-h-[600px] flex items-center justify-center p-8">
      <div className="text-center max-w-lg mx-auto">
        {/* Error icon with glassmorphism */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500/20 to-orange-600/20 blur-xl" />
          <div className="relative dashboard-card rounded-full p-6 border-red-200 dark:border-red-800">
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
          </div>
        </div>
        
        {/* Error message */}
        <div className="space-y-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Something went wrong
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We&apos;re having trouble loading your dashboard. Please try again.
          </p>
        </div>

        {/* Error details */}
        <div className="dashboard-card rounded-xl p-6 mb-8 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <WifiOff className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                Connection Issue
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Check your internet connection and try again
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={onRetry}
            className="dashboard-card-interactive inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          
          <button className="dashboard-card-interactive inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 font-medium">
            <MessageCircle className="w-4 h-4" />
            <span>Contact Support</span>
          </button>
        </div>

        {/* Additional tips */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Quick Fixes
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 text-left">
            <li>• Check your internet connection</li>
            <li>• Refresh the page</li>
            <li>• Clear browser cache</li>
            <li>• Try again in a few minutes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}