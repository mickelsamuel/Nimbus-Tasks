'use client'

import React from 'react'
import { 
  Users, TrendingUp, Target, Award, 
  BarChart3, MessageSquare, Bell, Crown, Shield, Zap, Eye
} from 'lucide-react'
import { TeamMetrics } from './types'

interface ManagerHeaderProps {
  teamMetrics: TeamMetrics
}

export default function ManagerHeader({ teamMetrics }: ManagerHeaderProps) {
  return (
    <div className="manager-command-header">
      <div className="leadership-particles"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Manager Welcome Panel */}
        <div className="manager-welcome-panel">
          <div className="leadership-branding">
            <div className="executive-icon">
              <Crown className="w-16 h-16 text-green-400" />
            </div>
            <div className="leadership-title-section">
              <h1 className="leadership-title">Welcome Back, Executive Manager</h1>
              <p className="leadership-subtitle">
                Leading {teamMetrics.totalMembers} professionals across 4 departments • {teamMetrics.activeToday} active today • {teamMetrics.averagePerformance}% team performance
              </p>
              <div className="real-time-insights">
                <span className="insight-item">🎯 3 training completions today</span>
                <span className="insight-separator">•</span>
                <span className="insight-item">📈 Team satisfaction up 5%</span>
                <span className="insight-separator">•</span>
                <span className="insight-item">🏆 2 new achievements unlocked</span>
              </div>
            </div>
          </div>
          
          {/* Leadership Achievement Badges */}
          <div className="leadership-achievement-badges">
            <div className="achievement-badge gold">
              <Award className="w-4 h-4 mr-2 text-yellow-400" />
              <span>Team Excellence</span>
            </div>
            <div className="achievement-badge platinum">
              <Shield className="w-4 h-4 mr-2 text-purple-400" />
              <span>Leadership Authority</span>
            </div>
            <div className="achievement-badge diamond">
              <Crown className="w-4 h-4 mr-2 text-blue-400" />
              <span>Performance Leader</span>
            </div>
            <div className="achievement-badge emerald">
              <Target className="w-4 h-4 mr-2 text-green-400" />
              <span>Team Growth</span>
            </div>
          </div>
        </div>

        {/* Team Overview Capsule */}
        <div className="team-overview-capsule">
          <div className="quick-stats-grid">
            <div className="stat-capsule">
              <div className="stat-icon">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <div className="stat-info">
                <div className="stat-value">{teamMetrics.totalMembers}</div>
                <div className="stat-label">Team Members</div>
              </div>
              <div className="stat-trend positive">
                <TrendingUp className="w-4 h-4" />
                <span>+3</span>
              </div>
            </div>

            <div className="stat-capsule">
              <div className="stat-icon">
                <Target className="w-8 h-8 text-blue-400" />
              </div>
              <div className="stat-info">
                <div className="stat-value">{teamMetrics.completionRate}%</div>
                <div className="stat-label">Completion Rate</div>
              </div>
              <div className="stat-trend positive">
                <TrendingUp className="w-4 h-4" />
                <span>+5%</span>
              </div>
            </div>

            <div className="stat-capsule">
              <div className="stat-icon">
                <Award className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="stat-info">
                <div className="stat-value">{teamMetrics.averagePerformance}%</div>
                <div className="stat-label">Avg Performance</div>
              </div>
              <div className="stat-trend positive">
                <TrendingUp className="w-4 h-4" />
                <span>+2%</span>
              </div>
            </div>

            <div className="stat-capsule">
              <div className="stat-icon">
                <Eye className="w-8 h-8 text-purple-400" />
              </div>
              <div className="stat-info">
                <div className="stat-value">{teamMetrics.activeToday}</div>
                <div className="stat-label">Active Today</div>
              </div>
              <div className="stat-health-indicator online"></div>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="department-breakdown">
            <h4 className="breakdown-title">Department Overview</h4>
            <div className="department-grid">
              <div className="department-card">
                <div className="dept-info">
                  <span className="dept-name">Investment Banking</span>
                  <span className="dept-count">8 members</span>
                </div>
                <div className="dept-performance">95%</div>
              </div>
              <div className="department-card">
                <div className="dept-info">
                  <span className="dept-name">Wealth Management</span>
                  <span className="dept-count">6 members</span>
                </div>
                <div className="dept-performance">89%</div>
              </div>
              <div className="department-card">
                <div className="dept-info">
                  <span className="dept-name">Risk Management</span>
                  <span className="dept-count">5 members</span>
                </div>
                <div className="dept-performance">91%</div>
              </div>
              <div className="department-card">
                <div className="dept-info">
                  <span className="dept-name">Operations</span>
                  <span className="dept-count">5 members</span>
                </div>
                <div className="dept-performance">88%</div>
              </div>
            </div>
          </div>

          {/* Quick Action Command Center */}
          <div className="quick-action-command">
            <button className="command-btn primary">
              <Users className="w-5 h-5" />
              <span>Assign Training</span>
            </button>
            <button className="command-btn secondary">
              <MessageSquare className="w-5 h-5" />
              <span>Team Message</span>
            </button>
            <button className="command-btn tertiary">
              <BarChart3 className="w-5 h-5" />
              <span>Generate Report</span>
            </button>
            <button className="command-btn notification">
              <Bell className="w-5 h-5" />
              <span>Announcements</span>
            </button>
          </div>
        </div>

        {/* Team Health Dashboard */}
        <div className="team-health-dashboard">
          <div className="health-indicator-grid">
            <div className="health-metric">
              <div className="health-icon engagement">
                <Zap className="w-6 h-6" />
              </div>
              <div className="health-data">
                <span className="health-label">Team Engagement</span>
                <div className="health-bar">
                  <div className="health-fill" style={{ width: '94%' }}></div>
                </div>
                <span className="health-value">94% Excellent</span>
              </div>
            </div>

            <div className="health-metric">
              <div className="health-icon productivity">
                <Target className="w-6 h-6" />
              </div>
              <div className="health-data">
                <span className="health-label">Productivity Index</span>
                <div className="health-bar">
                  <div className="health-fill" style={{ width: '88%' }}></div>
                </div>
                <span className="health-value">88% Strong</span>
              </div>
            </div>

            <div className="health-metric">
              <div className="health-icon satisfaction">
                <Award className="w-6 h-6" />
              </div>
              <div className="health-data">
                <span className="health-label">Team Satisfaction</span>
                <div className="health-bar">
                  <div className="health-fill" style={{ width: '91%' }}></div>
                </div>
                <span className="health-value">91% High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}