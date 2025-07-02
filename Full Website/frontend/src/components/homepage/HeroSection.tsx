'use client'

import React, { memo } from 'react'
import Link from 'next/link'
import { motion, Variants, useReducedMotion } from 'framer-motion'
import { usePlatformStats } from '@/services/platformStats'
import { useDashboardPreview } from '@/lib/api/public'
import { useInViewport } from '@/hooks/usePerformance'
import { 
  ArrowRight, 
  Building2,
  Users,
  TrendingUp,
  Award,
  Sparkles,
  Star,
  Zap,
  Target,
  Shield,
  Brain
} from 'lucide-react'

interface HeroSectionProps {
  containerVariants: Variants
  itemVariants: Variants
}

// Memoized benefit card component
const BenefitCard = memo(({ benefit, index }: { benefit: any; index: number }) => (
  <motion.div 
    className="flex items-center gap-3 p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 perf-hover perf-isolated"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
      <benefit.icon className={`h-5 w-5 ${benefit.color}`} />
    </div>
    <span className="font-medium text-gray-700 dark:text-gray-300">{benefit.text}</span>
  </motion.div>
))
BenefitCard.displayName = 'BenefitCard'

// Memoized stat card component
const StatCard = memo(({ stat, loading }: { stat: any; loading: boolean }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 perf-isolated">
    <stat.icon className={`h-5 w-5 ${stat.color}`} />
    <div>
      <div className="font-bold text-gray-900 dark:text-white">{loading ? stat.value : stat.getValue()}</div>
      <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
    </div>
  </div>
))
StatCard.displayName = 'StatCard'

export function HeroSection({ containerVariants, itemVariants }: HeroSectionProps): JSX.Element {
  const { stats, loading } = usePlatformStats()
  const { preview, loading: previewLoading } = useDashboardPreview()
  const shouldReduceMotion = useReducedMotion()
  const { ref: dashboardRef, hasBeenInView } = useInViewport({ threshold: 0.3 })

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
      {/* Simplified Background - No animations or blur */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-r from-red-400/10 to-orange-400/10" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(224,26,26,0.1)_1px,transparent_1px)] bg-[length:60px_60px]" />
        </div>
      </div>

      <motion.div 
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full"
        variants={shouldReduceMotion ? {} : containerVariants}
        initial={shouldReduceMotion ? {} : "hidden"}
        animate={shouldReduceMotion ? {} : "visible"}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Content */}
          <motion.div 
            className="text-left space-y-8"
            variants={itemVariants}
          >
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-4"
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -30 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-700">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20" />
                <span className="relative text-3xl font-black text-white z-10">BNC</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">National Bank of Canada</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Professional Training Platform</p>
              </div>
            </motion.div>
            
            {/* Headline */}
            <motion.div className="space-y-6">
              <div className="space-y-4">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                  initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Next-Generation Banking Education</span>
                </motion.div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                  <span className="text-gray-900 dark:text-white">Elevate Your</span>
                  <span className="block bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mt-2">
                    Banking Career
                  </span>
                </h1>
              </div>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                National Bank of Canada&apos;s comprehensive professional development platform. Master advanced banking technologies, 
                earn industry-recognized certifications, and connect with senior professionals in our immersive learning environment.
              </p>
            </motion.div>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Award, text: 'Professional certifications', color: 'text-yellow-500' },
                { icon: Brain, text: 'Personalized learning paths', color: 'text-purple-500' },
                { icon: Target, text: 'Banking-focused case studies', color: 'text-blue-500' },
                { icon: Shield, text: 'Enterprise-grade security', color: 'text-green-500' }
              ].map((benefit, index) => (
                <BenefitCard key={index} benefit={benefit} index={index} />
              ))}
            </div>
            
            {/* CTAs */}
            <motion.div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 perf-shadow-md transition-all duration-200 hover:perf-shadow-lg"
              >
                <Zap className="h-5 w-5" />
                Access Platform
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link
                href="#features"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 perf-shadow-md"
              >
                Explore Features
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div className="pt-8">
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {[
                  { 
                    icon: Users, 
                    value: '50,000+', 
                    getValue: () => stats?.activeProfessionals || '50,000+',
                    label: 'Active Professionals', 
                    color: 'text-blue-500' 
                  },
                  { 
                    icon: Award, 
                    value: '95%', 
                    getValue: () => stats?.successRate || '95%',
                    label: 'Success Rate', 
                    color: 'text-green-500' 
                  },
                  { 
                    icon: Star, 
                    value: '4.9/5', 
                    getValue: () => `${stats?.userRating || '4.9'}${stats?.ratingScale || '/5'}`,
                    label: 'User Rating', 
                    color: 'text-yellow-500' 
                  }
                ].map((stat, index) => (
                  <StatCard key={index} stat={stat} loading={loading} />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Dashboard Preview */}
          {!hasBeenInView ? (
            <div ref={dashboardRef as any} className="relative hidden lg:block h-[600px]">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl h-full animate-pulse" />
            </div>
          ) : (
          <motion.div 
            ref={dashboardRef as any}
            className="relative hidden lg:block"
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              {/* Main Dashboard */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl perf-shadow-lg p-8 border border-gray-200 dark:border-gray-700">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Dashboard</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Your personalized progress hub</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">Live</span>
                    </div>
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="h-6 w-6 text-blue-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Progress</span>
                      </div>
                      <div className="text-3xl font-black text-gray-900 dark:text-white">
                        {previewLoading ? '78%' : `${preview?.stats.overallProgress || 78}%`}
                      </div>
                      <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" 
                          style={{ width: `${previewLoading ? 78 : (preview?.stats.overallProgress || 78)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-5 border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-3 mb-3">
                        <Award className="h-6 w-6 text-yellow-500" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Certificates</span>
                      </div>
                      <div className="text-3xl font-black text-gray-900 dark:text-white">
                        {previewLoading ? '25+' : `${preview?.stats.certificationsEarned || 25}+`}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">Earned this year</div>
                    </div>
                  </div>
                  
                  {/* Course List */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">Current Learning Path</h4>
                    {(previewLoading ? [
                      { name: 'Advanced Risk Management', progress: 85, color: 'bg-green-500' },
                      { name: 'Digital Banking Innovation', progress: 60, color: 'bg-blue-500' },
                      { name: 'Regulatory Compliance', progress: 30, color: 'bg-purple-500' }
                    ] : preview?.courses || []).slice(0, 3).map((course, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{course.name}</span>
                          <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full ${course.color} rounded-full transition-all duration-500`} style={{ width: `${course.progress}%` }} />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-4">{course.progress}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Cards - No animation on mount */}
              <div className="absolute -top-8 -right-8 bg-white dark:bg-gray-800 rounded-2xl perf-shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                    <Building2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {previewLoading ? 'Enterprise Ready' : (preview?.features.enterpriseReady.title || 'Enterprise Ready')}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {previewLoading ? 'Trusted by 500+ institutions' : (preview?.features.enterpriseReady.subtitle || 'Trusted by 500+ institutions')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl perf-shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                    <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {previewLoading ? 'AI-Powered' : (preview?.features.aiPowered.title || 'AI-Powered')}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {previewLoading ? 'Personalized learning' : (preview?.features.aiPowered.subtitle || 'Personalized learning paths')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  )
}