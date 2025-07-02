'use client'

import { Suspense } from 'react'
import ProtectedLayout from '@/components/layout/ProtectedLayout'
import EnhancedGlobe from './EnhancedGlobe'
import { RotateCcw } from 'lucide-react'

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-slate-900">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4 text-white">
        <div className="flex items-center space-x-3">
          <RotateCcw className="h-6 w-6 text-blue-400 animate-spin" />
          <div className="text-lg">Loading 3D Globe...</div>
        </div>
      </div>
    </div>
  )
}

export default function GlobePage() {
  return (
    <ProtectedLayout>
      <div className="w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" style={{ height: 'calc(100vh - 72px)' }}>
        <Suspense fallback={<LoadingFallback />}>
          <EnhancedGlobe />
        </Suspense>
      </div>
    </ProtectedLayout>
  )
}