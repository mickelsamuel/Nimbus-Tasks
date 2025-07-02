'use client'

import { useState } from 'react'
import { 
  Users, UserCheck, Calendar, MessageCircle, 
  Target, Clock, ArrowRight, CheckCircle
} from 'lucide-react'

interface MentorshipSession {
  id: string
  mentorName: string
  role: string
  date: Date
  duration: number
  topic: string
  status: 'scheduled' | 'completed' | 'cancelled'
  goals: string[]
  outcomes?: string[]
}

interface MentorshipGoal {
  id: string
  title: string
  description: string
  deadline: Date
  progress: number
  mentor: string
  status: 'active' | 'completed' | 'paused'
}


interface MentorshipTrackingProps {
  careerData?: unknown
  loading?: boolean
}

export function MentorshipTracking({ }: MentorshipTrackingProps) {
  const [activeTab, setActiveTab] = useState<'sessions' | 'goals'>('sessions')

  const sessions: MentorshipSession[] = [
    {
      id: '1',
      mentorName: 'Sarah Johnson',
      role: 'Senior Banking Director',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      duration: 60,
      topic: 'Leadership Development',
      status: 'scheduled',
      goals: ['Improve team communication', 'Develop strategic thinking']
    },
    {
      id: '2',
      mentorName: 'Michael Chen',
      role: 'Digital Innovation Lead',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      duration: 45,
      topic: 'Digital Transformation',
      status: 'completed',
      goals: ['Learn fintech trends', 'Digital strategy planning'],
      outcomes: ['Completed fintech assessment', 'Created 90-day digital roadmap']
    }
  ]

  const goals: MentorshipGoal[] = [
    {
      id: '1',
      title: 'Develop Public Speaking Skills',
      description: 'Build confidence in presenting to senior leadership',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      progress: 65,
      mentor: 'Sarah Johnson',
      status: 'active'
    },
    {
      id: '2',
      title: 'Master Risk Assessment Frameworks',
      description: 'Deep dive into advanced risk management methodologies',
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      progress: 30,
      mentor: 'Robert Kim',
      status: 'active'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
      case 'completed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'cancelled': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
  }

  return (
    <div className="dashboard-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white shadow-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Mentorship Program
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your professional development
            </p>
          </div>
        </div>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
          Find Mentors
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'sessions' 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Sessions
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'goals' 
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Goals
        </button>
      </div>

      {/* Content */}
      {activeTab === 'sessions' ? (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{session.mentorName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{session.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                  {session.status}
                </span>
              </div>
              
              <div className="mb-3">
                <p className="font-medium text-gray-900 dark:text-white mb-1">{session.topic}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {session.date.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {session.duration} min
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Session Goals:</p>
                <ul className="space-y-1">
                  {session.goals.map((goal, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Target className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
              
              {session.outcomes && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Outcomes:</p>
                  <ul className="space-y-1">
                    {session.outcomes.map((outcome, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {session.status === 'scheduled' && (
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Join Meeting
                  </button>
                  <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors">
                    Reschedule
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{goal.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{goal.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                  {goal.status}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <UserCheck className="w-4 h-4" />
                  Mentor: {goal.mentor}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  Due: {goal.deadline.toLocaleDateString()}
                </div>
              </div>
              
              <button className="w-full mt-3 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                Update Progress
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}