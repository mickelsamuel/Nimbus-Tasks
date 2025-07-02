'use client'

import Link from 'next/link'
import { motion, Variants, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { usePlatformStats } from '@/services/platformStats'
import { 
  ArrowRight, 
  Star, 
  Users, 
  Award, 
  Sparkles, 
  Zap, 
  Crown, 
  TrendingUp,
  Shield,
  Target,
  Rocket
} from 'lucide-react'

interface CTASectionProps {
  itemVariants: Variants
}

export function CTASection({ itemVariants }: CTASectionProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isMounted, setIsMounted] = useState(false)
  const { stats, loading } = usePlatformStats()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 dark:from-gray-800 dark:via-gray-900 dark:to-black">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0">
        {/* Static geometric pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[length:80px_80px]" />

        {/* Static orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-white/10 to-yellow-300/10 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gradient-to-r from-blue-300/10 to-purple-300/10 blur-3xl" />

        {/* Animated elements only if mounted and motion allowed */}
        {isMounted && !prefersReducedMotion && (
          <>
            <motion.div
              className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gradient-to-r from-white/10 to-yellow-300/10 blur-3xl scroll-optimized"
              animate={{
                x: [0, 15, 0], // Further reduced movement
                y: [0, -8, 0], // Further reduced movement
              }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear", type: "tween" }}
              style={{
                willChange: 'transform',
                contain: 'layout style paint',
                transform: 'translateZ(0)'
              }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gradient-to-r from-blue-300/10 to-purple-300/10 blur-3xl scroll-optimized"
              animate={{
                x: [0, -12, 0], // Further reduced movement
                y: [0, 10, 0], // Further reduced movement
              }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear", type: "tween" }}
              style={{
                willChange: 'transform',
                contain: 'layout style paint',
                transform: 'translateZ(0)'
              }}
            />

            {/* Further reduced floating particles */}
            {Array.from({ length: 1 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-white/20 rounded-full scroll-optimized"
                style={{
                  left: `${20 + i * 40}%`,
                  top: `${25 + i * 30}%`,
                  willChange: 'transform, opacity',
                  contain: 'layout style paint',
                  transform: 'translateZ(0)'
                }}
                animate={{
                  y: [0, -5, 0], // Further reduced movement
                  opacity: [0.2, 0.4, 0.2], // Further reduced opacity range
                }}
                transition={{
                  duration: 8 + i * 2, // Much slower animation
                  repeat: Infinity,
                  ease: "linear", // Linear for better performance
                  delay: i * 1
                }}
              />
            ))}
          </>
        )}
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Enhanced Professional Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-gray-900/15 dark:bg-white/15 backdrop-blur-xl rounded-full px-8 py-4 mb-12 border border-gray-900/20 dark:border-white/20 shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={isMounted && !prefersReducedMotion ? { rotate: 360 } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </motion.div>
            <span className="text-white font-bold text-lg">Professional Banking Development</span>
            <Sparkles className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
          </motion.div>

          {/* Enhanced Headline */}
          <motion.div className="space-y-6 mb-12">
            <motion.h2 
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight"
              variants={itemVariants}
            >
              <span className="block">Ready to Advance</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 mt-2 supports-[background-clip:text]:text-transparent supports-[background-clip:text]:bg-gradient-to-r supports-[background-clip:text]:from-yellow-300 supports-[background-clip:text]:via-orange-300 supports-[background-clip:text]:to-pink-300 [&:not([style*='background-clip'])]:text-yellow-300">
                Your Banking Career?
              </span>
            </motion.h2>
          </motion.div>
          
          <motion.p 
            className="text-2xl text-white/95 mb-16 max-w-4xl mx-auto leading-relaxed font-medium"
            variants={itemVariants}
          >
            Join thousands of National Bank of Canada professionals who have advanced their careers through our comprehensive training platform. 
            <span className="text-yellow-600 dark:text-yellow-300 font-bold">Your professional development starts here.</span>
          </motion.p>
          
          {/* Enhanced CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
            variants={itemVariants}
          >
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500 group-hover:duration-200" />
              <Link
                href="/login"
                className="relative inline-flex items-center gap-4 px-10 py-5 rounded-2xl font-black text-xl text-white dark:text-red-600 bg-red-600 dark:bg-white hover:bg-red-700 dark:hover:bg-gray-50 shadow-2xl transition-all duration-200 overflow-hidden"
              >
                {isMounted && !prefersReducedMotion && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                )}
                <Rocket className="h-6 w-6 relative z-10" />
                <span className="relative z-10">Begin Your Development</span>
                <ArrowRight className="h-6 w-6 relative z-10" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="#features"
                className="inline-flex items-center gap-4 px-10 py-5 rounded-2xl font-bold text-xl text-white border-3 border-white/40 hover:border-white/70 hover:bg-white/15 backdrop-blur-sm transition-all duration-200 shadow-xl"
              >
                <Zap className="h-6 w-6" />
                Explore Training Features
              </Link>
            </motion.div>
          </motion.div>

          {/* Enhanced Trust Indicators */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {[
              { icon: Users, value: loading ? '50,000+' : (stats?.activeProfessionals || '50,000+'), label: 'Elite Professionals', sublabel: 'Trust our platform', gradient: 'from-blue-400 to-cyan-400' },
              { icon: TrendingUp, value: loading ? '95%' : (stats?.successRate || '95%'), label: 'Success Rate', sublabel: 'Career advancement', gradient: 'from-green-400 to-emerald-400' },
              { icon: Star, value: loading ? '4.9/5' : `${stats?.userRating || '4.9'}${stats?.ratingScale || '/5'}`, label: 'User Rating', sublabel: 'Outstanding reviews', gradient: 'from-yellow-400 to-orange-400' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="group relative"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                custom={index}
              >
                <div className="relative bg-gray-900/10 dark:bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-gray-900/20 dark:border-white/20 shadow-xl">
                  <div className="flex items-center gap-6">
                    <motion.div 
                      className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <div className="text-left">
                      <motion.div 
                        className="text-4xl font-black text-white mb-1"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-lg font-bold text-white/90">{stat.label}</div>
                      <div className="text-sm text-white/70">{stat.sublabel}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Trust Elements */}
          <motion.div 
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/80"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {[
              { icon: Shield, text: 'Bank-Grade Security' },
              { icon: Award, text: 'Industry Certified' },
              { icon: Target, text: 'Guaranteed Results' }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <item.icon className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}