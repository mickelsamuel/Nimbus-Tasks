'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  Save, 
  RotateCcw, 
  Download, 
  Upload,
  XCircle
} from 'lucide-react'

interface SettingsHeaderProps {
  hasChanges: boolean
  isLoading: boolean
  error: string | null
  preferencesError: string | null
  onSaveChanges: () => void
  onResetChanges: () => void
  onExportSettings: () => void
  onImportSettings: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClearError: () => void
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  hasChanges,
  isLoading,
  error,
  preferencesError,
  onSaveChanges,
  onResetChanges,
  onExportSettings,
  onImportSettings,
  onClearError
}) => {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Glassmorphism Header Background */}
      <div 
        className="absolute inset-0 h-32"
        style={{
          background: 'linear-gradient(135deg, rgba(224,26,26,0.08) 0%, rgba(212,175,55,0.06) 50%, rgba(255,255,255,0.4) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(224,26,26,0.2)',
          boxShadow: '0 8px 32px rgba(224,26,26,0.08), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}
      />
      
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-600 to-red-700 shadow-lg" style={{
              boxShadow: '0 8px 24px rgba(224,26,26,0.3), 0 2px 8px rgba(224,26,26,0.2)'
            }}>
              <SettingsIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Executive Personal Dashboard & Professional Identity Center
              </p>
            </div>
          </div>
          
          {/* Enhanced Error Display */}
          {(error || preferencesError) && (
            <motion.div 
              className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                backdropFilter: 'blur(12px)',
                background: 'rgba(254, 242, 242, 0.8)'
              }}
            >
              <XCircle className="h-5 w-5" />
              <span>{error || preferencesError}</span>
              <button 
                onClick={onClearError}
                className="ml-auto text-red-500 hover:text-red-700 transition-colors"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </motion.div>
          )}
          
          {/* Enhanced Quick Actions */}
          <div className="flex items-center gap-3 mt-4 flex-wrap lg:flex-nowrap">
            {hasChanges && (
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={onSaveChanges}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                  style={{
                    boxShadow: '0 4px 16px rgba(224,26,26,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(224,26,26,0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(224,26,26,0.3)'
                  }}
                >
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </button>
                <button
                  onClick={onResetChanges}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </motion.div>
            )}
            
            <button
              onClick={onExportSettings}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
              style={{
                boxShadow: '0 4px 16px rgba(59,130,246,0.3)'
              }}
            >
              <Download className="h-4 w-4" />
              Export Settings
            </button>
            
            <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer">
              <Upload className="h-4 w-4" />
              Import Settings
              <input
                type="file"
                accept=".json"
                onChange={onImportSettings}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SettingsHeader