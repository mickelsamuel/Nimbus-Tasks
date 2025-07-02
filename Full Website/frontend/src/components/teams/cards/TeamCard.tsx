'use client'

import React, { memo } from 'react'
import { 
  Eye,
  UserPlus,
  UserMinus,
  Settings
} from 'lucide-react'
import Image from 'next/image'

interface Team {
  id: string
  name: string
  description: string
  memberCount: number
  maxMembers: number
  category: string
  status: 'active' | 'recruiting' | 'inactive'
  performance: number
  achievements: number
  avatar: string
  members: Array<{
    id: string
    name: string
    avatar: string
    role: string
    isOnline: boolean
  }>
  recentActivity: Array<{
    id: string
    type: string
    message: string
    timestamp: string
  }>
  tags: string[]
  isJoined: boolean
  isOwner: boolean
}

interface TeamCardProps {
  team: Team
  isDark: boolean
  onJoin?: (teamId: string) => void
  onLeave?: (teamId: string) => void
  onView?: (teamId: string) => void
  isJoining?: boolean
}

const TeamCard = memo(function TeamCard({ team, onJoin, onLeave, onView }: TeamCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'recruiting': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const onlineMembers = team.members.filter(member => member.isOnline).length
  const onlinePercentage = team.memberCount > 0 ? Math.round((onlineMembers / team.memberCount) * 100) : 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              {team.avatar ? (
                <Image 
                  src={team.avatar} 
                  alt={team.name} 
                  width={48}
                  height={48}
                  className="w-full h-full rounded-lg object-cover" 
                />
              ) : (
                team.name.substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{team.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{team.category}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(team.status)}`}>
              {team.status}
            </span>
            {team.isOwner && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                Owner
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        
        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {team.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center group relative cursor-help">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {team.memberCount}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Members</div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              {team.memberCount} of {team.maxMembers} members
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
            </div>
          </div>
          <div className="text-center group relative cursor-help">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {team.performance}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Performance</div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              Team performance score
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
            </div>
          </div>
          <div className="text-center group relative cursor-help">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {team.achievements}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Achievements</div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              Total achievements earned
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
            </div>
          </div>
        </div>

        {/* Members */}
        {team.members.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Active Members
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {onlinePercentage}% online
              </span>
            </div>
            <div className="flex -space-x-2">
              {team.members.slice(0, 5).map((member) => (
                <div key={member.id} className="relative group">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover cursor-pointer hover:scale-110 transition-transform duration-200"
                    title={`${member.name} (${member.role}) - ${member.isOnline ? 'Online' : 'Offline'}`}
                  />
                  {member.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {member.name} ({member.role})
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                  </div>
                </div>
              ))}
              {team.members.length > 5 && (
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    +{team.members.length - 5}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {team.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {team.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {team.tags.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                  +{team.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {team.recentActivity.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-xs font-medium text-gray-900 dark:text-white mb-1">
              Latest Activity
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {team.recentActivity[0].message}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {team.recentActivity[0].timestamp}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <button
          onClick={() => onView?.(team.id)}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg flex-1 justify-center"
        >
          <Eye size={14} />
          View
        </button>
        
        {team.isJoined ? (
          <>
            {team.isOwner && (
              <button className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg">
                <Settings size={14} />
                Manage
              </button>
            )}
            <button
              onClick={() => onLeave?.(team.id)}
              className="flex items-center gap-1 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 rounded-lg"
            >
              <UserMinus size={14} />
              Leave
            </button>
          </>
        ) : (
          <button
            onClick={() => onJoin?.(team.id)}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex-1 justify-center"
          >
            <UserPlus size={14} />
            Join Team
          </button>
        )}
      </div>
    </div>
  )
})

export default TeamCard