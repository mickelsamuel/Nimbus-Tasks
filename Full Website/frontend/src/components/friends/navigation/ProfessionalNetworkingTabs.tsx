'use client'

import { 
  Building2, Network, UserPlus, MessageSquare, Target, 
  BarChart3, Settings
} from 'lucide-react'
import { TabType } from '../types'

interface Tab {
  id: TabType
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

interface ProfessionalNetworkingTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export function ProfessionalNetworkingTabs({ activeTab, onTabChange }: ProfessionalNetworkingTabsProps) {
  const professionalTabs: Tab[] = [
    { 
      id: 'colleagues' as TabType, 
      label: 'Colleagues Hub', 
      icon: Building2,
      description: 'Department-based colleague discovery'
    },
    { 
      id: 'network' as TabType, 
      label: 'Professional Network', 
      icon: Network,
      description: 'Extended professional connections'
    },
    { 
      id: 'requests' as TabType, 
      label: 'Connection Requests', 
      icon: UserPlus,
      description: 'Manage professional connection requests'
    },
    { 
      id: 'chat' as TabType, 
      label: 'Professional Chat', 
      icon: MessageSquare,
      description: 'Secure banking communication'
    },
    { 
      id: 'mentorship' as TabType, 
      label: 'Mentorship Center', 
      icon: Target,
      description: 'Mentor/mentee matching and development'
    },
    { 
      id: 'analytics' as TabType, 
      label: 'Networking Analytics', 
      icon: BarChart3,
      description: 'Professional relationship insights'
    },
    { 
      id: 'settings' as TabType, 
      label: 'Privacy & Settings', 
      icon: Settings,
      description: 'Professional visibility preferences'
    }
  ]

  return (
    <div className="professional-networking-tabs mb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-2 bg-white/5 p-2 rounded-xl backdrop-blur-sm">
          {professionalTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-accent-teal text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-medium hidden sm:block">{tab.label}</span>
              <span className="font-medium sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}