'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Shield, AlertTriangle } from 'lucide-react'

interface RoleProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: ('employee' | 'manager' | 'admin')[]
  fallbackPath?: string
}

export default function RoleProtectedRoute({ 
  children, 
  allowedRoles, 
  fallbackPath = '/dashboard' 
}: RoleProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      const userRole = user.role?.toLowerCase() as 'employee' | 'manager' | 'admin'
      
      if (!allowedRoles.includes(userRole)) {
        console.warn(`Access denied: User role "${userRole}" not in allowed roles:`, allowedRoles)
        router.push(fallbackPath)
      }
    }
  }, [user, isLoading, allowedRoles, fallbackPath, router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying access permissions...</p>
        </div>
      </div>
    )
  }

  // Check if user has required role
  if (user) {
    const userRole = user.role?.toLowerCase() as 'employee' | 'manager' | 'admin'
    
    if (!allowedRoles.includes(userRole)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don&apos;t have permission to access this page. This page requires one of the following roles: {allowedRoles.join(', ')}.
            </p>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Current Role: {user.role}</span>
              </div>
            </div>
            
            <button
              onClick={() => router.push(fallbackPath)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )
    }
  }

  // User has required role, render children
  return <>{children}</>
}