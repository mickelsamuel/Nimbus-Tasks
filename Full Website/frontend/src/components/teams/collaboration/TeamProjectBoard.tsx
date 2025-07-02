'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  Plus, MoreHorizontal, Calendar,
  CheckCircle, AlertCircle, Circle,
  Search, FileText, MessageSquare, Paperclip,
  Eye, Target
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: {
    id: string
    name: string
    avatar: string
  }
  reporter: {
    id: string
    name: string
    avatar: string
  }
  dueDate: string
  createdAt: string
  updatedAt: string
  labels: string[]
  attachments: number
  comments: number
  subtasks: {
    completed: number
    total: number
  }
  estimatedHours: number
  timeSpent: number
  project: string
}

interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'on-hold' | 'completed' | 'archived'
  progress: number
  dueDate: string
  teamMembers: Array<{
    id: string
    name: string
    avatar: string
    role: string
  }>
  tasks: {
    todo: number
    inProgress: number
    review: number
    done: number
  }
}

interface TeamProjectBoardProps {
  teamId: string
  teamName: string
}

export function TeamProjectBoard({ teamId }: TeamProjectBoardProps) {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'calendar'>('board')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterAssignee, setFilterAssignee] = useState<string>('all')
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(`/api/teams/${teamId}/projects`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
        if (data.projects?.length > 0 && !selectedProject) {
          setSelectedProject(data.projects[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }, [teamId, selectedProject])

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/teams/${teamId}/tasks?project=${selectedProject || ''}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }, [teamId, selectedProject])

  useEffect(() => {
    fetchProjects()
    fetchTasks()
  }, [teamId, fetchProjects, fetchTasks])

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        ))
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return Circle
      case 'in-progress': return AlertCircle
      case 'review': return Eye
      case 'done': return CheckCircle
      default: return Circle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'text-gray-500'
      case 'in-progress': return 'text-blue-500'
      case 'review': return 'text-yellow-500'
      case 'done': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesAssignee = filterAssignee === 'all' || task.assignee.id === filterAssignee
    
    return matchesSearch && matchesStatus && matchesAssignee
  })

  const tasksByStatus = {
    todo: filteredTasks.filter(task => task.status === 'todo'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    review: filteredTasks.filter(task => task.status === 'review'),
    done: filteredTasks.filter(task => task.status === 'done')
  }

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== newStatus) {
      updateTaskStatus(draggedTask.id, newStatus)
    }
    setDraggedTask(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    if (diffDays > 0) return `In ${diffDays} days`
    return `${Math.abs(diffDays)} days ago`
  }

  const TaskCard = ({ task }: { task: Task }) => {
    const StatusIcon = getStatusIcon(task.status)
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done'
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        draggable
        onDragStart={() => handleDragStart(task)}
        className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-move group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
              {task.title}
            </h4>
          </div>
          <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-opacity">
            <MoreHorizontal className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.labels.slice(0, 3).map((label, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full"
              >
                {label}
              </span>
            ))}
            {task.labels.length > 3 && (
              <span className="text-xs text-gray-500">+{task.labels.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-3">
            {task.subtasks.total > 0 && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>{task.subtasks.completed}/{task.subtasks.total}</span>
              </div>
            )}
            {task.comments > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{task.comments}</span>
              </div>
            )}
            {task.attachments > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                <span>{task.attachments}</span>
              </div>
            )}
          </div>
          <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
            <Calendar className="h-3 w-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Image
            src={task.assignee.avatar || '/avatars/default.jpg'}
            alt={task.assignee.name}
            width={24}
            height={24}
            className="w-6 h-6 rounded-full"
            title={task.assignee.name}
          />
          <div className="flex items-center gap-1">
            <StatusIcon className={`h-4 w-4 ${getStatusColor(task.status)}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {task.status.replace('-', ' ')}
            </span>
          </div>
        </div>
      </motion.div>
    )
  }

  const Column = ({ status, title, tasks }: { status: Task['status'], title: string, tasks: Task[] }) => (
    <div
      className="flex-1 min-w-0"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
    >
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
              {tasks.length}
            </span>
          </div>
          <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
            <Plus className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-3 min-h-[200px]">
          <AnimatePresence>
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6" />
          <div className="grid grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Team Projects & Tasks
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Collaborate on projects and track progress together
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { mode: 'board', icon: Target, label: 'Board' },
              { mode: 'list', icon: FileText, label: 'List' },
              { mode: 'calendar', icon: Calendar, label: 'Calendar' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Project Selector */}
      {projects.length > 0 && (
        <div className="flex items-center gap-4">
          <select
            value={selectedProject || ''}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          
          {selectedProject && (
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>
                Progress: {projects.find(p => p.id === selectedProject)?.progress || 0}%
              </span>
              <span>
                Tasks: {tasks.length}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
          
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Assignees</option>
            <option value={user?.id}>My Tasks</option>
          </select>
        </div>
      </div>

      {/* Board View */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Column
            status="todo"
            title="To Do"
            tasks={tasksByStatus.todo}
          />
          <Column
            status="in-progress"
            title="In Progress"
            tasks={tasksByStatus['in-progress']}
          />
          <Column
            status="review"
            title="Review"
            tasks={tasksByStatus.review}
          />
          <Column
            status="done"
            title="Done"
            tasks={tasksByStatus.done}
          />
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTasks.map(task => {
                  const StatusIcon = getStatusIcon(task.status)
                  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done'
                  
                  return (
                    <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`h-4 w-4 ${getStatusColor(task.status)}`} />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {task.title}
                            </div>
                            {task.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {task.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          task.status === 'done' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          task.status === 'review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {task.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Image
                            src={task.assignee.avatar || '/avatars/default.jpg'}
                            alt={task.assignee.name}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {task.assignee.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${isOverdue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                          {formatDate(task.dueDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {task.priority}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Calendar View
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Calendar view will be implemented with a date picker library for better UX.
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && !loading && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Tasks Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || filterStatus !== 'all' || filterAssignee !== 'all'
              ? 'No tasks match your current filters. Try adjusting your search criteria.'
              : 'Get started by creating your first task or project.'}
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
            Create Task
          </button>
        </div>
      )}
    </div>
  )
}