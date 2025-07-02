'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Users, 
  Settings, 
  MessageCircle, 
  Target,
  Award,
  BarChart3,
  Plus
} from 'lucide-react'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { useTeams } from '@/hooks/useTeams'
import { useAuth } from '@/contexts/AuthContext'

export default function TeamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { getTeamById, joinTeam, leaveTeam } = useTeams()
  const [team, setTeam] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const teamId = params.id as string

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setIsLoading(true)
        const teamData = await getTeamById(teamId)
        setTeam(teamData)
      } catch (err) {
        setError('Failed to load team details')
        console.error('Error fetching team:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (teamId) {
      fetchTeam()
    }
  }, [teamId, getTeamById])

  const handleJoinTeam = async () => {
    try {
      await joinTeam(teamId)
      // Refresh team data
      const updatedTeam = await getTeamById(teamId)
      setTeam(updatedTeam)
    } catch (err) {
      setError('Failed to join team')
    }
  }

  const handleLeaveTeam = async () => {
    try {
      await leaveTeam(teamId)
      router.push('/teams')
    } catch (err) {
      setError('Failed to leave team')
    }
  }

  const isTeamMember = team?.members?.some(member => member._id === user?.id || member.id === user?.id)
  const isTeamLeader = team?.leader?._id === user?.id || team?.leader?.id === user?.id

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  if (error || !team) {
    return (
      <ProtectedLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Team Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error || 'The team you\'re looking for doesn\'t exist or you don\'t have access to it.'}
            </p>
            <button
              onClick={() => router.push('/teams')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Teams
            </button>
          </div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {team.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {team.description}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {!isTeamMember ? (
                <button
                  onClick={handleJoinTeam}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Join Team
                </button>
              ) : (
                <>
                  {isTeamLeader && (
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Manage
                    </button>
                  )}
                  <button
                    onClick={handleLeaveTeam}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Leave Team
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Members</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {team.members?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Goals</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {team.goals?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {team.achievements?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Team Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {team.stats?.totalScore || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-8">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'members', label: 'Members', icon: Users },
                { id: 'goals', label: 'Goals', icon: Target },
                { id: 'activity', label: 'Activity', icon: MessageCircle }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Team Description
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {team.description || 'No description available.'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Recent Activity
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Team activity feed will be displayed here.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'members' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Team Members
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {team.members?.map(member => (
                      <div key={member._id || member.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {(member.firstName?.[0] || member.name?.[0] || 'U').toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {member.firstName && member.lastName 
                                ? `${member.firstName} ${member.lastName}`
                                : member.name || 'Unknown User'
                              }
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {member.role || 'Member'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'goals' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Team Goals
                    </h3>
                    {isTeamMember && (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Goal
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {team.goals?.length > 0 ? (
                      team.goals.map(goal => (
                        <div key={goal._id || goal.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            {goal.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            {goal.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Due: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}
                            </span>
                            <span className={`text-sm px-2 py-1 rounded ${
                              goal.completed 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              {goal.completed ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300">No goals set yet.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Team Activity
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Team activity and communication will be displayed here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}