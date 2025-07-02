'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Shield, 
  Bell, 
  Eye, 
  Activity,
  BarChart3,
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react'

interface SettingsSection {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  color: string
  gradient: string
}

interface SettingsNavigationProps {
  activeSection: string
  onSectionChange: (sectionId: string) => void
}

const settingsSections: SettingsSection[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    icon: <User className="h-6 w-6" />,
    description: 'Manage your profile, avatar, and personal details',
    color: '#E01A1A',
    gradient: 'from-red-600 to-red-700'
  },
  {
    id: 'accessibility',
    title: 'Accessibility & Display',
    icon: <Eye className="h-6 w-6" />,
    description: 'Customize themes, language, and accessibility options',
    color: '#D4AF37',
    gradient: 'from-yellow-600 to-yellow-700'
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: <Shield className="h-6 w-6" />,
    description: 'Manage password, 2FA, and privacy settings',
    color: '#0A1628',
    gradient: 'from-slate-700 to-slate-800'
  },
  {
    id: 'activity',
    title: 'Activity & Sessions',
    icon: <Activity className="h-6 w-6" />,
    description: 'View login history and manage active sessions',
    color: '#E01A1A',
    gradient: 'from-red-500 to-red-600'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: <Bell className="h-6 w-6" />,
    description: 'Configure notification preferences and delivery',
    color: '#D4AF37',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'analytics',
    title: 'Personal Analytics',
    icon: <BarChart3 className="h-6 w-6" />,
    description: 'View your learning progress and statistics',
    color: '#0A1628',
    gradient: 'from-slate-600 to-slate-700'
  }
]

const SettingsNavigation: React.FC<SettingsNavigationProps> = ({
  activeSection,
  onSectionChange
}) => {
  return (
    <div className="sticky top-4 lg:top-8">
      <div 
        className="rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          Settings Categories
        </h2>
        <nav className="space-y-2">
          {settingsSections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-300 ${
                activeSection === section.id
                  ? 'bg-gradient-to-r ' + section.gradient + ' text-white shadow-lg transform scale-105'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:transform hover:scale-102'
              }`}
              whileHover={{ scale: activeSection === section.id ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                activeSection === section.id
                  ? 'bg-white/20 shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                {section.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium">{section.title}</div>
                <div className={`text-sm transition-all duration-300 ${
                  activeSection === section.id
                    ? 'text-white/80'
                    : 'text-gray-500'
                }`}>
                  {section.description}
                </div>
              </div>
              <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${
                activeSection === section.id ? 'rotate-90' : ''
              }`} />
            </motion.button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default SettingsNavigation