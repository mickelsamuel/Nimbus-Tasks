'use client'

import React, { useState } from 'react'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import SettingsHeader from '@/components/settings/SettingsHeader'
import SettingsNavigation from '@/components/settings/SettingsNavigation'
import SettingsProvider from '@/components/settings/SettingsProvider'
import PersonalInformationSection from '@/components/settings/PersonalInformationSection'
import SecurityPrivacySection from '@/components/settings/SecurityPrivacySection'
import NotificationsSection from '@/components/settings/NotificationsSection'
import AccessibilityDisplaySection from '@/components/settings/AccessibilityDisplaySection'
import ActivitySessionsSection from '@/components/settings/ActivitySessionsSection'
import AnalyticsSection from '@/components/settings/AnalyticsSection'

// Internal component that uses the settings context
function SettingsPageContent() {
  const [activeSection, setActiveSection] = useState('personal')
  const [hasChanges, setHasChanges] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preferencesError, setPreferencesError] = useState<string | null>(null)

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true)
      // Settings context will handle the actual save
      setHasChanges(false)
    } catch (error) {
      console.error('Error saving settings:', error)
      setError('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetChanges = async () => {
    try {
      // Settings context will handle the reset
      setHasChanges(false)
    } catch (error) {
      console.error('Error resetting settings:', error)
      setError('Failed to reset settings')
    }
  }

  const handleExportSettings = async () => {
    try {
      const response = await fetch('/api/user/settings/export', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `settings-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting settings:', error)
    }
  }

  const handleImportSettings = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    try {
      const text = await file.text()
      const importedSettings = JSON.parse(text)
      
      const response = await fetch('/api/user/settings/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(importedSettings)
      })
      
      if (response.ok) {
        const updatedSettings = await response.json()
        // Settings context will handle the updated data
        setHasChanges(false)
      }
    } catch (error) {
      console.error('Error importing settings:', error)
    }
  }

  const handleClearError = () => {
    setError(null)
    setPreferencesError(null)
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInformationSection />
      case 'security':
        return <SecurityPrivacySection />
      case 'notifications':
        return <NotificationsSection />
      case 'accessibility':
        return <AccessibilityDisplaySection />
      case 'activity':
        return <ActivitySessionsSection />
      case 'analytics':
        return <AnalyticsSection />
      default:
        return <PersonalInformationSection />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SettingsHeader 
        hasChanges={hasChanges}
        isLoading={isLoading}
        error={error}
        preferencesError={preferencesError}
        onSaveChanges={handleSaveChanges}
        onResetChanges={handleResetChanges}
        onExportSettings={handleExportSettings}
        onImportSettings={handleImportSettings}
        onClearError={handleClearError}
      />
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <SettingsNavigation 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>
        
        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main settings page component
export default function SettingsPage() {
  return (
    <ProtectedLayout>
      <SettingsProvider>
        <SettingsPageContent />
      </SettingsProvider>
    </ProtectedLayout>
  )
}