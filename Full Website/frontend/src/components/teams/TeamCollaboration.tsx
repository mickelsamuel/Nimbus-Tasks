'use client'

import { useState } from 'react'
import { 
  MessageSquare, Calendar, Video, FileText, 
  Clock, Users, Plus,
  CheckCircle, Clock3, AlertCircle, Loader2
} from 'lucide-react'
import { useTeamCollaboration } from '../../hooks/useTeamCollaboration'

interface TeamCollaborationProps {
  teamId?: string
}

export function TeamCollaboration({ teamId }: TeamCollaborationProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'meetings' | 'discussions'>('projects')
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showScheduleMeeting, setShowScheduleMeeting] = useState(false)
  const [showStartDiscussion, setShowStartDiscussion] = useState(false)
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null)

  // Use the custom hook for team collaboration data
  const {
    projects,
    meetings,
    discussions,
    isLoading,
    error,
    hasError,
    createProject,
    createMeeting,
    createDiscussion
  } = useTeamCollaboration(teamId || '')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
      case 'in-progress': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'
      case 'review': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30'
      case 'completed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
  }

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case 'standup': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
      case 'planning': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30'
      case 'review': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'retrospective': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
    }
  }

  return (
    <div className="dashboard-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Team Collaboration
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage projects, meetings, and team discussions
            </p>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-lg border ${
          notification.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* No Team ID Warning */}
      {!teamId && (
        <div className="mb-6 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>Please select a team to view collaboration data.</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && teamId && (
        <div className="mb-6 p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error loading collaboration data</span>
          </div>
          {error.projects && <p className="text-sm">Projects: {error.projects}</p>}
          {error.meetings && <p className="text-sm">Meetings: {error.meetings}</p>}
          {error.discussions && <p className="text-sm">Discussions: {error.discussions}</p>}
          {error.general && <p className="text-sm">{error.general}</p>}
        </div>
      )}

      {/* Loading State */}
      {isLoading && teamId && (
        <div className="mb-6 p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading collaboration data...</span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="dashboard-card rounded-xl p-2">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'projects', label: 'Projects', icon: FileText, count: projects.length },
              { id: 'meetings', label: 'Meetings', icon: Calendar, count: meetings.length },
              { id: 'discussions', label: 'Discussions', icon: MessageSquare, count: discussions.length },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'projects' | 'meetings' | 'discussions')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-indigo-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Projects</h3>
            <button 
              onClick={() => setShowCreateProject(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
          
          {projects.length > 0 ? projects.map((project) => (
            <div key={project.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status.replace('-', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                    {project.priority}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {project.dueDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{project.assignees.length} assignees</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{project.completion}% complete</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${project.completion}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.assignees.slice(0, 3).map((assignee, index) => (
                    <div key={index} className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-800">
                      {assignee.charAt(0)}
                    </div>
                  ))}
                  {project.assignees.length > 3 && (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-medium border-2 border-white dark:border-gray-800">
                      +{project.assignees.length - 3}
                    </div>
                  )}
                </div>
                <button 
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Projects Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first project to start collaborating with your team.</p>
              <button 
                onClick={() => setShowCreateProject(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'meetings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Meetings</h3>
            <button 
              onClick={() => setShowScheduleMeeting(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Schedule Meeting
            </button>
          </div>
          
          {meetings.length > 0 ? meetings.map((meeting) => (
            <div key={meeting.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{meeting.title}</h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{meeting.date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{meeting.time} ({meeting.duration}min)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{meeting.attendees.length} attendees</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMeetingTypeColor(meeting.type)}`}>
                    {meeting.type}
                  </span>
                  {meeting.recurring && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      Recurring
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {meeting.attendees.join(', ')}
                </div>
                <div className="flex gap-2">
                  {meeting.link && (
                    <button 
                      onClick={() => window.open(meeting.link, '_blank')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <Video className="w-4 h-4" />
                      Join
                    </button>
                  )}
                  <button 
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Meetings Scheduled</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Schedule your first team meeting to start collaborating.</p>
              <button 
                onClick={() => setShowScheduleMeeting(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Schedule Meeting
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'discussions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Discussions</h3>
            <button 
              onClick={() => setShowStartDiscussion(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Start Discussion
            </button>
          </div>
          
          {discussions.length > 0 ? discussions.map((discussion) => (
            <div key={discussion.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{discussion.title}</h4>
                    {discussion.isPinned && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                        Pinned
                      </span>
                    )}
                    {discussion.isResolved && (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>by {discussion.author}</span>
                    <span>{discussion.replies} replies</span>
                    <span>Last reply {discussion.lastReply.toLocaleTimeString()}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  discussion.category === 'announcement' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                  discussion.category === 'project' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                  discussion.category === 'help' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                  'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}>
                  {discussion.category}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock3 className="w-4 h-4" />
                  <span>Last activity: {discussion.lastReply.toLocaleDateString()}</span>
                </div>
                <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors">
                  View Thread
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Discussions Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Start your first discussion to engage with your team.</p>
              <button 
                onClick={() => setShowStartDiscussion(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Start Discussion
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Project</h3>
            <form onSubmit={async (e) => {
              e.preventDefault()
              try {
                const formData = new FormData(e.target as HTMLFormElement)
                const projectData = {
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  dueDate: formData.get('dueDate') as string,
                  priority: 'medium'
                }
                
                await createProject(projectData)
                setNotification({message: 'Project created successfully!', type: 'success'})
                setShowCreateProject(false)
              } catch (error) {
                console.error('Failed to create project:', error)
                setNotification({message: 'Failed to create project. Please try again.', type: 'error'})
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Project description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateProject(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Meeting Modal */}
      {showScheduleMeeting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Schedule Meeting</h3>
            <form onSubmit={async (e) => {
              e.preventDefault()
              try {
                const formData = new FormData(e.target as HTMLFormElement)
                const meetingData = {
                  title: formData.get('title') as string,
                  date: formData.get('date') as string,
                  time: formData.get('time') as string,
                  duration: parseInt(formData.get('duration') as string)
                }
                
                await createMeeting(meetingData)
                setNotification({message: 'Meeting scheduled successfully!', type: 'success'})
                setShowScheduleMeeting(false)
              } catch (error) {
                console.error('Failed to schedule meeting:', error)
                setNotification({message: 'Failed to schedule meeting. Please try again.', type: 'error'})
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Meeting Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter meeting title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (minutes)
                  </label>
                  <select name="duration" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowScheduleMeeting(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Start Discussion Modal */}
      {showStartDiscussion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Start Discussion</h3>
            <form onSubmit={async (e) => {
              e.preventDefault()
              try {
                const formData = new FormData(e.target as HTMLFormElement)
                const discussionData = {
                  title: formData.get('title') as string,
                  category: formData.get('category') as string,
                  message: formData.get('message') as string
                }
                
                await createDiscussion(discussionData)
                setNotification({message: 'Discussion started successfully!', type: 'success'})
                setShowStartDiscussion(false)
              } catch (error) {
                console.error('Failed to start discussion:', error)
                setNotification({message: 'Failed to start discussion. Please try again.', type: 'error'})
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Discussion Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter discussion title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select name="category" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="general">General</option>
                    <option value="project">Project</option>
                    <option value="help">Help</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Initial Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Start the discussion..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowStartDiscussion(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Start Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}