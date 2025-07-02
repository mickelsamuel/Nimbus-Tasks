'use client'

import { Users, TrendingUp, Award } from 'lucide-react'
import { NetworkingAnalytics } from '../types'

interface ProfessionalNetworkHeaderProps {
  analytics: NetworkingAnalytics | undefined
}

export default function ProfessionalNetworkHeader({ analytics }: ProfessionalNetworkHeaderProps) {
  return (
    <div className="social-hub-header mb-8">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="networking-title mb-4">
              Professional Network
            </h1>
            <p className="text-xl text-white/80 font-medium">
              Elite Social Connection Hub - National Bank Professional Networking
            </p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-accent-teal" />
                <span className="text-white/90">{analytics?.totalConnections || 0} Connections</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-secondary-teal" />
                <span className="text-white/90">+{analytics?.networkingGrowth || 0}% Growth</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-professional-highlight" />
                <span className="text-white/90">Level {analytics?.professionalInfluence || 1} Influence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}