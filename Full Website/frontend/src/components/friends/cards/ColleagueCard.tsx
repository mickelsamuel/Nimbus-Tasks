'use client'

import { useState } from 'react'
import { 
  UserPlus, MessageSquare, Eye, X, Network, Clock, Star, 
  Target, Briefcase, Award, Crown
} from 'lucide-react'
import { Colleague } from '../types'

interface ColleagueCardProps {
  colleague: Colleague
  onConnect?: (colleagueId: number) => void
  onMessage?: (colleagueId: number) => void
}

export default function ColleagueCard({ colleague, onConnect, onMessage }: ColleagueCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConnectionDetails, setShowConnectionDetails] = useState(false)

  const handleConnect = async () => {
    if (onConnect) {
      onConnect(colleague.id)
    }
  }

  const handleMessage = () => {
    if (onMessage) {
      onMessage(colleague.id)
    }
  }

  return (
    <div className={`colleague-card ${isExpanded ? 'expanded' : ''}`}>
      {/* Professional Achievement Badges */}
      <div className="absolute top-3 right-3 flex space-x-1">
        {colleague.mentorshipPotential === 'mentor' && (
          <div className="achievement-badge">
            <Crown className="h-3 w-3 text-white" />
          </div>
        )}
        <div className={`department-badge ${getDepartmentBadgeClass(colleague.department)}`}>
          {colleague.department.split(' ')[0]}
        </div>
      </div>

      {/* Avatar Section */}
      <div className="relative mb-4">
        <div className="w-20 h-20 mx-auto relative avatar-container">
          {/* Status Ring */}
          <div className={`absolute inset-0 rounded-full ring-2 ring-opacity-30 status-ring ${getStatusRingClass(colleague.status)}`}></div>
          
          {/* Professional Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-teal to-secondary-teal flex items-center justify-center relative z-10 avatar-sphere">
            <span className="text-white text-xl font-bold">
              {colleague.firstName[0]}{colleague.lastName[0]}
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-teal/30 to-secondary-teal/30 collaboration-glow"></div>
          </div>
          
          {/* Status Indicator */}
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white ${getStatusClass(colleague.status)}`}>
            <div className="w-full h-full rounded-full bg-current opacity-75 status-pulse"></div>
          </div>

          {/* Connection Strength Ring */}
          <ConnectionStrengthRing strength={colleague.collaborationHistory || 5} />
        </div>
      </div>

      {/* Professional Identity */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-white mb-1">
          {colleague.firstName} {colleague.lastName}
        </h3>
        <p className="text-white/70 text-sm mb-2">{colleague.role}</p>
        
        {/* Badges */}
        <div className="flex justify-center space-x-2 mb-3">
          <MentorshipBadge potential={colleague.mentorshipPotential} />
          {colleague.yearsExperience && (
            <ExperienceBadge years={colleague.yearsExperience} />
          )}
        </div>

        {/* Professional Certifications */}
        {colleague.professionalCertifications && (
          <div className="flex justify-center flex-wrap gap-1 mb-3">
            {colleague.professionalCertifications.slice(0, 2).map((cert, index) => (
              <span key={index} className="px-2 py-1 bg-accent-teal/20 text-accent-teal text-xs rounded-md border border-accent-teal/30">
                <Award className="h-2 w-2 inline mr-1" />
                {cert.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Skills Section */}
      <SkillsSection 
        skills={colleague.skills} 
        isExpanded={isExpanded} 
        onToggleExpand={() => setIsExpanded(!isExpanded)} 
      />

      {/* Collaboration Metrics */}
      <CollaborationMetrics colleague={colleague} />

      {/* Expanded Details */}
      {isExpanded && (
        <ExpandedDetails colleague={colleague} />
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 action-buttons">
        <button 
          onClick={handleConnect}
          className="flex-1 py-2.5 bg-accent-teal hover:bg-accent-teal/80 text-white text-sm font-medium rounded-lg transition-all duration-300 connect-button relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center">
            <UserPlus className="h-4 w-4 mr-1" />
            {colleague.isConnected ? 'Connected' : 'Connect'}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-accent-teal to-secondary-teal opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </button>
        
        <button 
          onClick={handleMessage}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
        >
          <MessageSquare className="h-4 w-4" />
        </button>
        
        <button 
          onClick={() => setShowConnectionDetails(!showConnectionDetails)}
          className="px-4 py-2.5 bg-secondary-teal/20 hover:bg-secondary-teal/30 text-secondary-teal rounded-lg transition-all duration-300"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      {/* Connection Details Modal */}
      {showConnectionDetails && (
        <ConnectionDetailsModal 
          colleague={colleague} 
          onClose={() => setShowConnectionDetails(false)} 
        />
      )}
    </div>
  )
}

// Helper Components
function ConnectionStrengthRing({ strength }: { strength: number }) {
  const circumference = 283
  const strokeDasharray = `${strength * 28.3} ${circumference}`
  
  return (
    <div className="absolute inset-0 rounded-full connection-strength-ring">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#connectionGradient)"
          strokeWidth="2"
          strokeDasharray={strokeDasharray}
          className="connection-progress"
        />
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#009688" />
            <stop offset="100%" stopColor="#4CAF50" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function MentorshipBadge({ potential }: { potential: string }) {
  const getBadgeClass = () => {
    switch (potential) {
      case 'mentor': return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
      case 'mentee': return 'bg-blue-500/20 text-blue-400 border-blue-400/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-400/30'
    }
  }

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getBadgeClass()}`}>
      <Target className="h-3 w-3 mr-1" />
      {potential}
    </div>
  )
}

function ExperienceBadge({ years }: { years: number }) {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-professional-highlight/20 text-professional-highlight border border-professional-highlight/30">
      <Briefcase className="h-3 w-3 mr-1" />
      {years}y exp
    </div>
  )
}

function SkillsSection({ skills, isExpanded, onToggleExpand }: {
  skills: string[]
  isExpanded: boolean
  onToggleExpand: () => void
}) {
  return (
    <div className="mb-4 skills-section">
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.slice(0, isExpanded ? skills.length : 3).map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-md skill-tag hover:bg-white/20 transition-colors">
            {skill}
          </span>
        ))}
        {skills.length > 3 && !isExpanded && (
          <button 
            onClick={onToggleExpand}
            className="px-2 py-1 bg-accent-teal/20 text-accent-teal text-xs rounded-md hover:bg-accent-teal/30 transition-colors"
          >
            +{skills.length - 3} more
          </button>
        )}
      </div>
    </div>
  )
}

function CollaborationMetrics({ colleague }: { colleague: Colleague }) {
  return (
    <div className="space-y-3 mb-4 collaboration-metrics">
      {/* Collaboration History */}
      <div className="collaboration-timeline">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/70 text-sm flex items-center">
            <Network className="h-4 w-4 mr-1" />
            Collaboration History
          </span>
          <span className="text-accent-teal text-sm font-semibold">{colleague.collaborationHistory} projects</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent-teal to-secondary-teal rounded-full collaboration-progress"
            style={{ width: `${Math.min((colleague.collaborationHistory || 0) * 8, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Professional Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="text-center p-2 bg-white/5 rounded-lg">
          <p className="text-white font-semibold">{colleague.projectsInCommon}</p>
          <p className="text-white/60 text-xs">Shared Projects</p>
        </div>
        <div className="text-center p-2 bg-white/5 rounded-lg">
          <p className="text-white font-semibold">{colleague.connectionStrength || 85}%</p>
          <p className="text-white/60 text-xs">Connection Strength</p>
        </div>
      </div>

      {/* Last Active */}
      <div className="text-xs text-white/50 flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        Last active: {colleague.lastActive}
      </div>
    </div>
  )
}

function ExpandedDetails({ colleague }: { colleague: Colleague }) {
  return (
    <div className="expanded-details mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/70">Location:</span>
          <span className="text-white">{colleague.location || 'Not specified'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">Joined:</span>
          <span className="text-white">{colleague.joinedAt ? new Date(colleague.joinedAt).getFullYear() : 'N/A'}</span>
        </div>
        {colleague.achievements && (
          <div>
            <span className="text-white/70 text-xs">Recent Achievements:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {colleague.achievements.slice(0, 2).map((achievement, index) => (
                <span key={index} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-md">
                  <Star className="h-2 w-2 inline mr-1" />
                  {achievement.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ConnectionDetailsModal({ colleague, onClose }: { colleague: Colleague, onClose: () => void }) {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-20 p-4 z-20 connection-modal">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 h-full overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-white font-semibold">Professional Profile</h4>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-white/70 mb-1">Department & Role</p>
            <p className="text-white">{colleague.department} - {colleague.role}</p>
          </div>
          
          {colleague.expertise && (
            <div>
              <p className="text-white/70 mb-1">Areas of Expertise</p>
              <div className="flex flex-wrap gap-1">
                {colleague.expertise.map((exp, index) => (
                  <span key={index} className="px-2 py-1 bg-professional-highlight/20 text-professional-highlight text-xs rounded-md">
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <p className="text-white/70 mb-1">Professional Network</p>
            <p className="text-white">{colleague.collaborationHistory} collaborative projects completed</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Functions
function getStatusClass(status: string) {
  switch (status) {
    case 'online': return 'bg-green-500'
    case 'away': return 'bg-yellow-500'
    case 'busy': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

function getStatusRingClass(status: string) {
  switch (status) {
    case 'online': return 'ring-green-400'
    case 'away': return 'ring-yellow-400'
    case 'busy': return 'ring-red-400'
    default: return 'ring-gray-400'
  }
}

function getDepartmentBadgeClass(department: string) {
  const colors = {
    'Investment Banking': 'bg-blue-500',
    'Risk Management': 'bg-red-500',
    'Technology': 'bg-purple-500',
    'Retail Banking': 'bg-green-500',
    'Human Resources': 'bg-orange-500'
  }
  return colors[department as keyof typeof colors] || 'bg-gray-500'
}