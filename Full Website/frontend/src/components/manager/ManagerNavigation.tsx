'use client'

import React from 'react'
import { 
  Users, BarChart3, Target, Award, TrendingUp, Settings
} from 'lucide-react'
import { ManagerTab } from './types'

interface ManagerNavigationProps {
  activeTab: ManagerTab
  setActiveTab: (tab: ManagerTab) => void
}

const tabs = [
  { id: 'overview', label: 'Team Overview', icon: Users, description: 'Comprehensive team dashboard' },
  { id: 'analytics', label: 'Performance Analytics', icon: BarChart3, description: 'Advanced team insights' },
  { id: 'training', label: 'Training Management', icon: Target, description: 'Module assignment center' },
  { id: 'achievements', label: 'Achievement Center', icon: Award, description: 'Team accomplishments' },
  { id: 'development', label: 'Development Planning', icon: TrendingUp, description: 'Career progression' },
  { id: 'settings', label: 'Team Settings', icon: Settings, description: 'Configuration panel' }
] as const

export default function ManagerNavigation({ activeTab, setActiveTab }: ManagerNavigationProps) {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % tabs.length
      setActiveTab(tabs[nextIndex].id as ManagerTab)
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + tabs.length) % tabs.length
      setActiveTab(tabs[prevIndex].id as ManagerTab)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20" id="manager-navigation">
      <div className="management-tabs">
        <div 
          className="tabs-container" 
          role="tablist" 
          aria-label="Manager Dashboard Navigation"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ManagerTab)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`management-tab ${activeTab === tab.id ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              aria-describedby={`tab-desc-${tab.id}`}
            >
              <div className="tab-icon" aria-hidden="true">
                <tab.icon className="w-6 h-6" />
              </div>
              <div className="tab-content">
                <span className="tab-label">{tab.label}</span>
                <span className="tab-description" id={`tab-desc-${tab.id}`}>
                  {tab.description}
                </span>
              </div>
              {activeTab === tab.id && (
                <div className="tab-active-indicator" aria-hidden="true"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}