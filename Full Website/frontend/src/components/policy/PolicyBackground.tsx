'use client'

import React from 'react'

interface PolicyBackgroundProps {
  children: React.ReactNode
  className?: string
}

export const PolicyBackground: React.FC<PolicyBackgroundProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 ${className}`}>
      {/* Clean background elements - no animations */}
      <div className="absolute inset-0">
        {/* Static gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 opacity-30" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-r from-red-400/10 to-orange-400/10 opacity-30" />
        
        {/* Simple pattern overlay */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(224,26,26,0.1)_1px,transparent_1px)] bg-[length:60px_60px]" />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  )
}

export default PolicyBackground