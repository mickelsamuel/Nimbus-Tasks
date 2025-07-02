'use client'

import { User, Shield } from 'lucide-react'

interface AvatarStudioHeaderProps {
  userCurrency: {
    coins: number
    tokens: number
  }
  error?: string
  onErrorDismiss: () => void
}

export default function AvatarStudioHeader({ userCurrency, error, onErrorDismiss }: AvatarStudioHeaderProps) {
  return (
    <>
      {/* Hero Section - Digital Identity Studio Header */}
      <div className="hero-studio-header bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Premium Digital Identity Studio
                </h1>
                <p className="text-lg text-purple-200">
                  Professional Avatar Workshop & Character Design Center
                </p>
              </div>
            </div>
            
            {/* Currency Display & Standards Badge */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4 bg-black/20 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🪙</span>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{userCurrency.coins.toLocaleString()}</div>
                    <div className="text-xs text-purple-200">Coins</div>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">💎</span>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{userCurrency.tokens.toLocaleString()}</div>
                    <div className="text-xs text-purple-200">Tokens</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-green-400/30">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm font-semibold text-green-100">Banking Industry Compliant</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-transparent rounded-full blur-3xl" />
      </div>
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 backdrop-blur-sm border-l-4 border-red-500 px-6 py-4 mx-6 mt-4 rounded-r-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-400 text-sm">⚠</span>
              </div>
              <p className="text-red-300 font-medium">{error}</p>
            </div>
            <button 
              onClick={onErrorDismiss}
              className="text-red-400 hover:text-red-300 transition-colors text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}