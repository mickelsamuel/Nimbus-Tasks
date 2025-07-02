'use client'

import React from 'react'
import { 
  BarChart3, TrendingUp, Zap, Bell, Target
} from 'lucide-react'

const departmentData = [
  { dept: 'Investment Banking', score: 94, change: '+5%' },
  { dept: 'Wealth Management', score: 89, change: '+2%' },
  { dept: 'Risk Management', score: 91, change: '+7%' },
  { dept: 'Operations', score: 87, change: '+3%' }
]

const performanceData = [88, 92, 85, 94, 89, 96, 93]

export default function AnalyticsTab() {
  return (
    <div 
      className="tab-content-section" 
      role="tabpanel" 
      id="tabpanel-analytics" 
      aria-labelledby="tab-analytics"
    >
      <div className="analytics-theater">
        <h3 className="theater-title">Advanced Team Analytics</h3>
        <p className="theater-description">
          Comprehensive performance insights and predictive analytics for strategic decision making
        </p>
        
        {/* Performance Trends Chart */}
        <div className="analytics-grid">
          <div className="analytics-chart-card">
            <div className="chart-header">
              <h4 className="chart-title">Team Performance Trends</h4>
              <div className="chart-controls">
                <select className="chart-period-select">
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
              </div>
            </div>
            <div className="performance-chart">
              <div className="chart-visualization">
                {performanceData.map((value, index) => (
                  <div key={index} className="chart-bar">
                    <div 
                      className="bar-fill"
                      style={{ height: `${value}%` }}
                    ></div>
                    <span className="bar-label">D{index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color performance"></div>
                  <span>Team Performance</span>
                </div>
              </div>
            </div>
          </div>

          <div className="analytics-insight-card">
            <h4 className="insight-title">AI-Powered Insights</h4>
            <div className="insights-list">
              <div className="insight-item ai-prediction">
                <Zap className="w-5 h-5 text-purple-400" />
                <div className="insight-content">
                  <span className="insight-metric">98% prediction</span>
                  <span className="insight-description">team will exceed Q4 targets</span>
                  <span className="ai-badge">AI Forecast</span>
                </div>
              </div>
              <div className="insight-item benchmark">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <div className="insight-content">
                  <span className="insight-metric">23% above org avg</span>
                  <span className="insight-description">performance vs company benchmark</span>
                  <span className="benchmark-badge">Top 10%</span>
                </div>
              </div>
              <div className="insight-item trending">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <div className="insight-content">
                  <span className="insight-metric">+15% improvement</span>
                  <span className="insight-description">completion rates vs last month</span>
                </div>
              </div>
              <div className="insight-item alert-insight">
                <Bell className="w-5 h-5 text-orange-400" />
                <div className="insight-content">
                  <span className="insight-metric">2 members at risk</span>
                  <span className="insight-description">require intervention this week</span>
                  <span className="priority-badge">Action Needed</span>
                </div>
              </div>
              <div className="insight-item recommendation">
                <Target className="w-5 h-5 text-cyan-400" />
                <div className="insight-content">
                  <span className="insight-metric">Leadership module</span>
                  <span className="insight-description">recommended for 5 high performers</span>
                  <span className="ai-badge">AI Recommendation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Comparison */}
        <div className="department-comparison">
          <h4 className="comparison-title">Department Performance Comparison</h4>
          <div className="comparison-grid">
            {departmentData.map((dept, index) => (
              <div key={index} className="department-card">
                <div className="dept-header">
                  <span className="dept-name">{dept.dept}</span>
                  <span className="dept-change positive">{dept.change}</span>
                </div>
                <div className="dept-score-container">
                  <div className="dept-score">{dept.score}%</div>
                  <div className="dept-progress-ring">
                    <svg className="ring-svg" viewBox="0 0 36 36">
                      <circle 
                        cx="18" cy="18" r="16" 
                        fill="none" 
                        stroke="rgba(255,255,255,0.1)" 
                        strokeWidth="2"
                      />
                      <circle 
                        cx="18" cy="18" r="16" 
                        fill="none" 
                        className="dept-progress-circle"
                        strokeDasharray={`${dept.score} 100`}
                        strokeDashoffset="25"
                        transform="rotate(-90 18 18)"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}