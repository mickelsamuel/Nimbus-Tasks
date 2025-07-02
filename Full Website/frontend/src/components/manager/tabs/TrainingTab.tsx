'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Target, Zap, Clock, Users, Eye, Crown
} from 'lucide-react'
import { TeamMember } from '../types'

interface TrainingTabProps {
  teamMembers: TeamMember[]
}

interface Module {
  _id: string
  title: string
  category: string
  difficulty: string
  estimatedDuration: number
  completionRate?: number
  recommended?: boolean
}

interface ProgressData {
  userId: string
  userName: string
  moduleId: string
  moduleTitle: string
  progress: number
  timeRemaining: string
  status: 'not-started' | 'in-progress' | 'completed'
}

export default function TrainingTab({ teamMembers }: TrainingTabProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModulesAndProgress()
  }, [teamMembers])

  const fetchModulesAndProgress = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

      // Fetch available modules
      const modulesResponse = await fetch(`${baseURL}/api/modules`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (modulesResponse.ok) {
        const modulesData = await modulesResponse.json()
        setModules(modulesData.data?.modules || [])
      }

      // Fetch team member progress
      const teamMemberIds = teamMembers.map(member => member.id)
      if (teamMemberIds.length > 0) {
        const progressResponse = await fetch(`${baseURL}/api/manager/team-progress`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userIds: teamMemberIds })
        })

        if (progressResponse.ok) {
          const progressDataResponse = await progressResponse.json()
          setProgressData(progressDataResponse.data || [])
        }
      }
    } catch (error) {
      console.error('Failed to fetch modules and progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, module: Module) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(module))
    e.currentTarget.classList.add('dragging')
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('drag-over')
    const moduleData = JSON.parse(e.dataTransfer.getData('text/plain'))
    alert(`Assigned "${moduleData.title}" to selected team members!`)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over')
  }

  return (
    <div 
      className="tab-content-section" 
      role="tabpanel" 
      id="tabpanel-training" 
      aria-labelledby="tab-training"
    >
      <div className="training-command-center">
        <div className="training-header">
          <h3 className="training-title">Training Command Center</h3>
          <p className="training-description">
            Intelligent module assignment and training orchestration system
          </p>
        </div>

        {/* Module Assignment Intelligence */}
        <div className="assignment-intelligence">
          <div className="assignment-header">
            <h4 className="assignment-title">Intelligent Module Assignment</h4>
            <button className="assignment-action-btn">
              <Target className="w-5 h-5 mr-2" />
              Auto-Assign Recommendations
            </button>
          </div>

          <div className="assignment-grid">
            {/* Available Modules */}
            <div className="modules-panel">
              <h5 className="panel-title">Available Training Modules</h5>
              <div className="modules-list">
                {loading ? (
                  <div className="loading-state">Loading modules...</div>
                ) : (
                  modules.map((module) => (
                    <div 
                      key={module._id} 
                      className={`module-card ${module.recommended ? 'recommended' : ''} draggable-module`}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, module)}
                      onDragEnd={handleDragEnd}
                    >
                      {module.recommended && (
                        <div className="recommendation-badge">
                          <Zap className="w-3 h-3 mr-1" />
                          AI Recommended
                        </div>
                      )}
                      <div className="module-header">
                        <h6 className="module-title">{module.title}</h6>
                        <span className="module-category">{module.category}</span>
                      </div>
                      <div className="module-details">
                        <div className="module-stats">
                          <span className="module-stat">
                            <Clock className="w-4 h-4 mr-1" />
                            {module.estimatedDuration} hours
                          </span>
                          <span className={`difficulty-tag ${module.difficulty.toLowerCase()}`}>
                            {module.difficulty}
                          </span>
                        </div>
                        <div className="completion-rate">
                          <span className="rate-label">Completion Rate</span>
                          <div className="rate-bar">
                            <div 
                              className="rate-fill"
                              style={{ width: `${module.completionRate}%` }}
                            ></div>
                          </div>
                          <span className="rate-value">{module.completionRate || 0}%</span>
                        </div>
                      </div>
                      <div className="module-actions">
                        <button className="assign-btn">
                          <Users className="w-4 h-4 mr-2" />
                          Assign to Team
                        </button>
                        <button className="preview-btn">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Assignment Target */}
            <div className="assignment-target">
              <h5 className="panel-title">Assignment Target</h5>
              <div className="target-selection">
                <div className="target-options">
                  <button className="target-option active">
                    <Users className="w-5 h-5 mr-2" />
                    Select Team Members
                  </button>
                  <button className="target-option">
                    <Crown className="w-5 h-5 mr-2" />
                    Department Leaders
                  </button>
                  <button className="target-option">
                    <Target className="w-5 h-5 mr-2" />
                    Performance Groups
                  </button>
                </div>

                <div 
                  className="selected-members drop-zone"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <h6 className="selection-title">
                    Selected Members (3) - Drop modules here to assign
                  </h6>
                  <div className="drop-indicator">
                    <Target className="w-6 h-6 text-green-400" />
                    <span>Drag training modules here to assign to selected members</span>
                  </div>
                  <div className="members-list">
                    {teamMembers.slice(0, 3).map((member) => (
                      <div key={member.id} className="selected-member">
                        <div className="relative member-avatar-small">
                          <Image 
                            src={member.avatar} 
                            alt={member.name} 
                            fill
                            className="object-cover" 
                          />
                        </div>
                        <div className="member-info-compact">
                          <span className="member-name-small">{member.name}</span>
                          <span className="member-role-small">{member.role}</span>
                        </div>
                        <button className="remove-member">×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="assignment-schedule">
                  <h6 className="schedule-title">Training Schedule</h6>
                  <div className="schedule-options">
                    <select className="schedule-select">
                      <option value="immediate">Start Immediately</option>
                      <option value="next-week">Next Week</option>
                      <option value="next-month">Next Month</option>
                      <option value="custom">Custom Date</option>
                    </select>
                    <div className="deadline-input">
                      <label>Completion Deadline</label>
                      <input type="date" className="deadline-date" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Summary */}
          <div className="assignment-summary">
            <div className="summary-content">
              <h6 className="summary-title">Assignment Summary</h6>
              <div className="summary-stats">
                <div className="summary-stat">
                  <span className="stat-label">Modules to Assign</span>
                  <span className="stat-value">2</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Target Members</span>
                  <span className="stat-value">3</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Estimated Time</span>
                  <span className="stat-value">6 hours</span>
                </div>
              </div>
            </div>
            <div className="summary-actions">
              <button className="execute-assignment-btn">
                <Zap className="w-5 h-5 mr-2" />
                Execute Assignment
              </button>
            </div>
          </div>
        </div>

        {/* Training Progress Monitor */}
        <div className="training-progress-monitor">
          <h4 className="monitor-title">Active Training Progress Monitor</h4>
          <div className="progress-overview">
            {loading ? (
              <div className="loading-state">Loading progress data...</div>
            ) : progressData.length === 0 ? (
              <div className="empty-state">No active training progress to display</div>
            ) : (
              progressData.map((progress, index) => (
                <div key={`${progress.userId}-${progress.moduleId}`} className="progress-item">
                  <div className="progress-member">
                    <div className="member-avatar-tiny">
                      {progress.userName.charAt(0)}
                    </div>
                    <div className="member-details">
                      <span className="member-name-tiny">{progress.userName}</span>
                      <span className="module-name-tiny">{progress.moduleTitle}</span>
                    </div>
                  </div>
                  <div className="progress-visualization">
                    <div className="progress-bar-container">
                      <div 
                        className={`progress-bar-fill ${progress.status}`}
                        style={{ width: `${progress.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-percentage">{progress.progress}%</span>
                  </div>
                  <div className="progress-status">
                    <span className="time-remaining">{progress.timeRemaining}</span>
                    <div className={`status-dot ${progress.status}`}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}