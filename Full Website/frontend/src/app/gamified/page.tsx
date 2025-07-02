'use client'

import React from 'react'
import ProtectedLayout from '@/components/layout/ProtectedLayout'

export default function GamifiedDashboard() {
  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Social Hub</h1>
          <p className="text-xl text-gray-300">Social hub will be here</p>
        </div>
      </div>
    </ProtectedLayout>
  )
}