'use client'

import { Settings, Building2, Target, Briefcase, UserPlus, MessageSquare, Star, Crown } from 'lucide-react'
import { Colleague } from '../types'

interface ColleagueDiscoveryCarouselProps {
  recommendedConnections: Colleague[]
}

export default function ColleagueDiscoveryCarousel({ recommendedConnections }: ColleagueDiscoveryCarouselProps) {
  return (
    <div className="colleague-discovery-carousel">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Smart Colleague Discovery</h3>
          <button className="text-accent-teal hover:text-accent-teal/80 transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>
        
        {/* Discovery Categories */}
        <div className="space-y-4">
          {/* Department Matches */}
          <div className="discovery-category">
            <div className="flex items-center space-x-2 mb-3">
              <Building2 className="h-4 w-4 text-accent-teal" />
              <span className="text-white/80 text-sm font-medium">Department Matches</span>
            </div>
            <div className="space-y-2">
              {recommendedConnections.slice(0, 2).map((colleague) => (
                <div key={colleague.id} className="colleague-discovery-card">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-teal to-secondary-teal flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {colleague.firstName[0]}{colleague.lastName[0]}
                        </span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {colleague.firstName} {colleague.lastName}
                      </p>
                      <p className="text-white/70 text-xs truncate">{colleague.department}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-yellow-500 text-xs">94% Match</span>
                      </div>
                    </div>
                    <button className="p-1 bg-accent-teal/20 hover:bg-accent-teal/30 text-accent-teal rounded-md transition-colors">
                      <UserPlus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mentorship Opportunities */}
          <div className="discovery-category">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="h-4 w-4 text-secondary-teal" />
              <span className="text-white/80 text-sm font-medium">Mentorship Opportunities</span>
            </div>
            <div className="space-y-2">
              <div className="colleague-discovery-card">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-teal to-professional-highlight flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">DW</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">Dr. Patricia Wong</p>
                    <p className="text-white/70 text-xs">CTO • Technology</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Crown className="h-3 w-3 text-yellow-500" />
                      <span className="text-yellow-500 text-xs">Mentor Available</span>
                    </div>
                  </div>
                  <button className="p-1 bg-secondary-teal/20 hover:bg-secondary-teal/30 text-secondary-teal rounded-md transition-colors">
                    <MessageSquare className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Project Collaborators */}
          <div className="discovery-category">
            <div className="flex items-center space-x-2 mb-3">
              <Briefcase className="h-4 w-4 text-professional-highlight" />
              <span className="text-white/80 text-sm font-medium">Project Collaborators</span>
            </div>
            <div className="space-y-2">
              <div className="colleague-discovery-card">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-professional-highlight to-accent-teal flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">JR</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">James Rodriguez</p>
                    <p className="text-white/70 text-xs">EVP • Investment Banking</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Briefcase className="h-3 w-3 text-professional-highlight" />
                      <span className="text-professional-highlight text-xs">Project Match</span>
                    </div>
                  </div>
                  <button className="p-1 bg-professional-highlight/20 hover:bg-professional-highlight/30 text-professional-highlight rounded-md transition-colors">
                    <UserPlus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}