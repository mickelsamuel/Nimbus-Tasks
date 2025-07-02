'use client'

import React from 'react'
import Image from 'next/image'
import { 
  Search, Filter, BarChart3, Calendar, Target, TrendingUp, 
  Users, MessageSquare, Crown, Eye, Clock
} from 'lucide-react'
import { TeamMember, TeamMetrics } from '../types'

interface OverviewTabProps {
  teamMembers: TeamMember[]
  teamMetrics: TeamMetrics
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedDepartment: string
  setSelectedDepartment: (dept: string) => void
}

const getTimeAgo = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function OverviewTab({ 
  teamMembers, 
  teamMetrics, 
  searchTerm, 
  setSearchTerm, 
  selectedDepartment, 
  setSelectedDepartment 
}: OverviewTabProps) {
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment
    
    return matchesSearch && matchesDepartment
  })

  return (
    <div 
      className="tab-content-section" 
      role="tabpanel" 
      id="tabpanel-overview" 
      aria-labelledby="tab-overview"
    >
      {/* Team Search Command */}
      <div className="team-search-command">
        <div className="search-header">
          <h3 className="search-title">Team Management Intelligence</h3>
          <div className="search-stats">
            <span>{teamMembers.length} team members</span>
            <span>•</span>
            <span>{teamMembers.filter(m => m.status === 'active').length} active now</span>
          </div>
        </div>

        <div className="search-controls">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search team members, departments, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-enhanced"
            />
          </div>

          <div className="filter-controls">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="department-filter"
            >
              <option value="all">All Departments</option>
              <option value="Investment Banking">Investment Banking</option>
              <option value="Wealth Management">Wealth Management</option>
              <option value="Risk Management">Risk Management</option>
              <option value="Operations">Operations</option>
            </select>

            <button className="filter-advanced-btn">
              <Filter className="w-4 h-4" />
              <span>Advanced Filters</span>
            </button>
          </div>
        </div>

        <div className="filter-pills-container">
          <div className="filter-pill active">
            <span>All Members</span>
            <button className="pill-close">×</button>
          </div>
          <div className="filter-pill">
            <span>High Performers</span>
          </div>
          <div className="filter-pill">
            <span>Training Due</span>
          </div>
          <div className="filter-pill">
            <span>Recently Active</span>
          </div>
        </div>
      </div>

      {/* Performance Intelligence Dashboard */}
      <div className="performance-intelligence-theater">
        <div className="theater-header">
          <h3 className="theater-title">Performance Intelligence Dashboard</h3>
          <div className="theater-controls">
            <button className="theater-btn">
              <BarChart3 className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button className="theater-btn">
              <Calendar className="w-4 h-4" />
              <span>Schedule Review</span>
            </button>
          </div>
        </div>

        <div className="intelligence-grid">
          <div className="performance-intelligence-card completion-rate">
            <div className="card-header">
              <div className="card-icon">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="card-title">Training Completion</h4>
            </div>
            <div className="performance-meter">
              <svg className="meter-svg" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                <circle 
                  cx="60" cy="60" r="50" fill="none" 
                  className="meter-progress"
                  strokeDasharray={`${teamMetrics.completionRate * 3.14} 314`}
                  strokeDashoffset="78.5"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="meter-center">
                <span className="meter-value">{teamMetrics.completionRate}%</span>
                <span className="meter-label">Complete</span>
              </div>
            </div>
            <div className="completion-details">
              <div className="detail-item">
                <span className="detail-label">On Track</span>
                <span className="detail-value">18 members</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Needs Attention</span>
                <span className="detail-value">6 members</span>
              </div>
            </div>
          </div>

          <div className="performance-intelligence-card engagement-analytics">
            <div className="card-header">
              <div className="card-icon">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="card-title">Team Engagement</h4>
            </div>
            <div className="engagement-chart">
              <div className="chart-bars">
                {[85, 92, 88, 94, 90, 87, 91].map((value, index) => (
                  <div key={index} className="chart-bar">
                    <div 
                      className="bar-fill" 
                      style={{ height: `${value}%` }}
                    ></div>
                    <span className="bar-label">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="engagement-stats">
                <div className="stat-item">
                  <span className="stat-value">89%</span>
                  <span className="stat-label">Avg Weekly</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value trend-positive">+3%</span>
                  <span className="stat-label">vs Last Week</span>
                </div>
              </div>
            </div>
          </div>

          <div className="performance-intelligence-card activity-feed">
            <div className="card-header">
              <div className="card-icon">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="card-title">Live Activity Feed</h4>
            </div>
            <div className="activity-stream">
              <div className="activity-item priority-high">
                <div className="activity-avatar">
                  <Target className="w-4 h-4" />
                </div>
                <div className="activity-content">
                  <span className="activity-text">Sarah Chen completed Advanced Risk Assessment</span>
                  <span className="activity-time">2 min ago</span>
                </div>
              </div>
              <div className="activity-item priority-medium">
                <div className="activity-avatar">
                  <Crown className="w-4 h-4" />
                </div>
                <div className="activity-content">
                  <span className="activity-text">Marcus Johnson achieved Team Leadership badge</span>
                  <span className="activity-time">15 min ago</span>
                </div>
              </div>
              <div className="activity-item priority-low">
                <div className="activity-avatar">
                  <Users className="w-4 h-4" />
                </div>
                <div className="activity-content">
                  <span className="activity-text">Elena Rodriguez joined weekly standup</span>
                  <span className="activity-time">32 min ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Management System */}
      <div className="employee-management-system">
        <div className="employee-grid">
          {filteredMembers.map((member) => (
            <div key={member.id} className="employee-management-card">
              <div className="employee-professional-header">
                <div className="professional-identity">
                  <div className="professional-avatar-container">
                    <Image 
                      src={member.avatar} 
                      alt={`${member.name} avatar`}
                      fill
                      className="professional-avatar object-cover"
                    />
                    <div className={`status-indicator ${member.status}`}></div>
                  </div>
                  <div className="professional-details">
                    <h4 className="professional-name">{member.name}</h4>
                    <p className="professional-role">{member.role}</p>
                    <p className="professional-department">{member.department}</p>
                  </div>
                </div>
                <div className="professional-actions">
                  <button className="action-btn primary">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button className="action-btn secondary">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="performance-heat-signature">
                <div className="performance-score">
                  <span className="score-value">{member.performance}%</span>
                  <span className="score-label">Performance</span>
                </div>
                <div className="performance-bar">
                  <div 
                    className="performance-fill" 
                    style={{ width: `${member.performance}%` }}
                  ></div>
                </div>
              </div>

              <div className="training-progress-visualization">
                <div className="progress-header">
                  <span className="progress-title">Training Progress</span>
                  <span className="progress-percentage">
                    {Math.round((member.completedModules / member.totalModules) * 100)}%
                  </span>
                </div>
                <div className="module-completion-dots">
                  {Array.from({ length: member.totalModules }).map((_, index) => (
                    <div
                      key={index}
                      className={`completion-dot ${index < member.completedModules ? 'completed' : 'pending'}`}
                    ></div>
                  ))}
                </div>
                <div className="progress-details">
                  <span>{member.completedModules} of {member.totalModules} modules complete</span>
                </div>
              </div>

              <div className="skills-development-showcase">
                <div className="skills-header">
                  <span className="skills-title">Key Skills</span>
                </div>
                <div className="skills-grid">
                  {member.skills.slice(0, 3).map((skill, index) => (
                    <div key={index} className="skill-tag">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div className="activity-timestamp">
                <Clock className="w-4 h-4" />
                <span>Last active {getTimeAgo(member.lastActive)}</span>
              </div>

              <div className="quick-actions-overlay">
                <button className="quick-action-btn">
                  <Target className="w-4 h-4" />
                  <span>Assign Training</span>
                </button>
                <button className="quick-action-btn">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Meeting</span>
                </button>
                <button className="quick-action-btn">
                  <Eye className="w-4 h-4" />
                  <span>View Profile</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}