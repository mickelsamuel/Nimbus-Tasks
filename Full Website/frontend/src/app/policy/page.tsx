'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import '@/styles/policy-animations.css'
import '@/styles/policy-responsive.css'
import {
  PolicyBackground,
  PolicyHeader,
  PolicyHero,
  PolicyNotice,
  PolicyCard,
  PolicyCompliance,
  PolicyProgress,
  PolicyAcceptance,
  PolicyConfirmation,
  type PolicyAcceptanceState
} from '@/components/policy'
import { policyItems } from '@/components/policy/policyData'

export default function PolicyPage() {
  // State management
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [acceptedPolicies, setAcceptedPolicies] = useState<PolicyAcceptanceState>({
    codeOfConduct: false,
    dataPrivacy: false,
    platformUsage: false,
    bankingSecurity: false
  })
  const [isAccepting, setIsAccepting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Hooks
  const router = useRouter()
  const { user, isLoading, acceptPolicy, checkUserFlow } = useAuth()

  // Computed values
  const allPoliciesAccepted = Object.values(acceptedPolicies).every(accepted => accepted)

  // Effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = document.documentElement.scrollTop
      const clientHeight = document.documentElement.clientHeight
      
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setHasScrolledToBottom(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check if user is authenticated when not loading
  useEffect(() => {
    if (!isLoading && !user) {
      // User is not authenticated, redirect to home or login
      router.push('/login?redirect=/policy')
    }
  }, [user, isLoading, router])

  // Event handlers
  const handlePolicyChange = (policy: keyof PolicyAcceptanceState) => {
    setAcceptedPolicies(prev => ({
      ...prev,
      [policy]: !prev[policy]
    }))
  }

  const handleAcceptAll = async () => {
    if (!allPoliciesAccepted || !hasScrolledToBottom) return
    
    setIsAccepting(true)
    
    try {
      const result = await acceptPolicy()
      
      if (result.success) {
        setIsAccepting(false)
        setShowConfirmation(true)
        
        // Check flow status to determine next step
        setTimeout(async () => {
          const flowStatus = await checkUserFlow()
          if (flowStatus.needsModeSelection) {
            router.push('/choose-mode')
          } else {
            // User has completed flow, redirect to their selected mode
            if (flowStatus.selectedMode === 'gamified') {
              router.push('/gamified')
            } else {
              router.push('/dashboard')
            }
          }
        }, 3000)
      } else {
        setIsAccepting(false)
        alert(result.error || 'Failed to accept policy. Please try again.')
      }
    } catch (error) {
      setIsAccepting(false)
      console.error('Policy acceptance error:', error)
      alert('An error occurred. Please try again.')
    }
  }

  // Render confirmation screen
  if (showConfirmation) {
    return <PolicyConfirmation />
  }

  // Render main policy page
  return (
    <PolicyBackground>
      <PolicyHeader />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <PolicyHero />
        <PolicyNotice />

        {/* Policy Sections */}
        <div className="space-y-8 md:space-y-10">
          {policyItems.map((policy, index) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              index={index}
              isAccepted={acceptedPolicies[policy.id as keyof PolicyAcceptanceState]}
              onToggle={() => handlePolicyChange(policy.id as keyof PolicyAcceptanceState)}
            />
          ))}
        </div>

        <PolicyCompliance />
        <PolicyProgress hasScrolledToBottom={hasScrolledToBottom} />
        
        {/* Only show acceptance section for authenticated users */}
        {user && (
          <PolicyAcceptance
            acceptedPolicies={acceptedPolicies}
            allPoliciesAccepted={allPoliciesAccepted}
            hasScrolledToBottom={hasScrolledToBottom}
            isAccepting={isAccepting}
            onAcceptAll={handleAcceptAll}
          />
        )}
        
        {/* Show login prompt for unauthenticated users */}
        {!user && !isLoading && (
          <motion.div
            className="mt-12 p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-gray-700 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Account Required
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please create an account or sign in to accept the policies and continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        )}

        {/* Footer - matching homepage/login/help pattern */}
        <motion.footer 
          className="py-8 px-4 border-t border-gray-200/20 dark:border-gray-800/50 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/help" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Help Center
              </Link>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <Link href="/login" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Sign In
              </Link>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                Home
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              © 2025 National Bank of Canada. All rights reserved.
            </p>
          </div>
        </motion.footer>
      </div>
    </PolicyBackground>
  )
}