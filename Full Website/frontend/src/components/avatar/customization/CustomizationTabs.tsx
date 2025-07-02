'use client'

import { User, Crown, Shirt, Target, Settings } from 'lucide-react'

interface Tab {
  id: 'face' | 'hair' | 'clothing' | 'pose' | 'environment'
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

interface CustomizationTabsProps {
  activeTab: 'face' | 'hair' | 'clothing' | 'pose' | 'environment'
  onTabChange: (tab: 'face' | 'hair' | 'clothing' | 'pose' | 'environment') => void
}

const TABS: Tab[] = [
  { id: 'face', label: 'Face', icon: User, description: 'Facial features and expressions' },
  { id: 'hair', label: 'Hair', icon: Crown, description: 'Hairstyles and grooming' },
  { id: 'clothing', label: 'Attire', icon: Shirt, description: 'Professional clothing' },
  { id: 'pose', label: 'Pose', icon: Target, description: 'Posture and gestures' },
  { id: 'environment', label: 'Studio', icon: Settings, description: 'Background and lighting' }
]

export default function CustomizationTabs({ activeTab, onTabChange }: CustomizationTabsProps) {
  return (
    <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`group flex-1 flex flex-col items-center justify-center py-4 px-3 transition-all duration-200 relative ${
              activeTab === tab.id
                ? 'text-white bg-gradient-to-b from-purple-600/20 to-blue-600/20 border-b-2 border-purple-500'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <tab.icon className={`w-5 h-5 mb-2 transition-all duration-200 ${
              activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
            }`} />
            <span className="text-sm font-semibold mb-1">{tab.label}</span>
            <span className="text-xs opacity-70 text-center">{tab.description}</span>
            
            {/* Active indicator */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}