'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePlatformStats } from '@/services/platformStats'
import { 
  Shield, 
  Award, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Sparkles,
  Crown,
  Lock,
  TrendingUp,
  Users,
  Heart,
  ArrowUp
} from 'lucide-react'

export function FooterSection() {
  const prefersReducedMotion = useReducedMotion()
  const [isMounted, setIsMounted] = useState(false)
  const { stats, loading } = usePlatformStats()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 py-20 overflow-hidden">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0">
        {/* Static gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-red-500/5 to-purple-500/5 dark:from-red-500/10 dark:to-purple-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-blue-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:to-cyan-500/10 blur-3xl" />

        {/* Animated orbs only if mounted */}
        {isMounted && !prefersReducedMotion && (
          <>
            <motion.div
              className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-red-500/5 to-purple-500/5 dark:from-red-500/10 dark:to-purple-500/10 blur-3xl"
              animate={{
                x: [0, 25, 0],
                y: [0, -15, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-blue-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:to-cyan-500/10 blur-3xl"
              animate={{
                x: [0, -20, 0],
                y: [0, 15, 0],
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}

        {/* Simple geometric pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(224,26,26,0.15)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]" />

        {/* Reduced floating particles */}
        {isMounted && !prefersReducedMotion && Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-red-500/30 to-purple-500/30 dark:from-red-400/40 dark:to-purple-400/40 rounded-full"
            style={{
              left: `${25 + i * 20}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Enhanced Company Info */}
          <div className="md:col-span-2 space-y-8">
            {/* Enhanced Logo */}
            <div className="flex items-center gap-5">
              <motion.div
                className="relative flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-700 dark:from-red-600 dark:via-red-500 dark:to-red-400" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20" />
                {isMounted && !prefersReducedMotion && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: [-100, 100] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <span className="relative text-2xl font-black text-white z-10">BNC</span>
              </motion.div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">National Bank of Canada</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Professional Development Platform
                </p>
              </div>
            </div>
            
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-md">
              Supporting banking professionals worldwide with comprehensive education, 
              personalized learning, and valuable industry connections since 1864.
            </p>

            {/* Enhanced Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, text: 'Bank-Grade Security', color: 'text-green-600 dark:text-green-400' },
                { icon: Award, text: 'Globally Certified', color: 'text-yellow-600 dark:text-yellow-400' },
                { icon: Lock, text: 'ISO 27001 Compliant', color: 'text-blue-600 dark:text-blue-400' },
                { icon: Star, text: '4.9★ User Rating', color: 'text-purple-600 dark:text-purple-400' }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/5 dark:bg-white/5 backdrop-blur-sm border border-gray-900/10 dark:border-white/10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Platform
            </h4>
            <div className="space-y-3">
              {[
                { href: '/modules', label: 'Training Modules' },
                { href: '/teams', label: 'Team Management' },
                { href: '/simulation', label: 'Trading Simulator' },
                { href: '/career', label: 'Career Center' },
                { href: '/innovation-lab', label: 'Innovation Lab' }
              ].map((link, index) => (
                <Link key={index} href={link.href}>
                  <motion.span 
                    className="block text-gray-900 dark:text-gray-300 hover:text-red-600 dark:hover:text-white hover:translate-x-2 transition-all duration-200 font-medium cursor-pointer"
                    whileHover={{ x: 8 }}
                  >
                    {link.label}
                  </motion.span>
                </Link>
              ))}
            </div>
          </div>

          {/* Enhanced Support & Contact */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
              Support
            </h4>
            <div className="space-y-4">
              {[
                { icon: MapPin, text: '600 De La Gauchetière West\nMontreal, QC H3B 4L2', color: 'text-blue-600 dark:text-blue-400' },
                { icon: Phone, text: '1-888-NBC-LEARN\n(Business hours support)', color: 'text-green-600 dark:text-green-400' },
                { icon: Mail, text: 'training@nbc.ca\nResponse within 1 hour', color: 'text-purple-600 dark:text-purple-400' },
                { icon: Globe, text: 'Available Worldwide\n15+ Languages', color: 'text-yellow-600 dark:text-yellow-400' }
              ].map((contact, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-xl bg-gray-900/5 dark:bg-white/5 backdrop-blur-sm border border-gray-900/10 dark:border-white/10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <contact.icon className={`h-5 w-5 ${contact.color} mt-0.5 flex-shrink-0`} />
                  <div className="text-sm">
                    {contact.text.split('\n').map((line, lineIndex) => (
                      <div key={lineIndex} className={lineIndex === 0 ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-600 dark:text-gray-400'}>
                        {line}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Enhanced Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 p-8 rounded-2xl bg-gradient-to-r from-gray-900/5 dark:from-white/5 to-gray-900/10 dark:to-white/10 backdrop-blur-xl border border-gray-900/10 dark:border-white/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {[
            { icon: Users, value: loading ? '50,000+' : (stats?.activeProfessionals || '50,000+'), label: 'Active Professionals', color: 'text-blue-600 dark:text-blue-400' },
            { icon: TrendingUp, value: loading ? '95%' : (stats?.successRate || '95%'), label: 'Success Rate', color: 'text-green-600 dark:text-green-400' },
            { icon: Award, value: loading ? '25+' : (stats?.totalCertifications || '25+'), label: 'Certifications', color: 'text-yellow-600 dark:text-yellow-400' },
            { icon: Globe, value: loading ? '150+' : (stats?.countries || '150+'), label: 'Countries', color: 'text-purple-600 dark:text-purple-400' }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
              <div className="text-2xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Enhanced Bottom Section */}
        <motion.div 
          className="pt-8 border-t border-gray-300/50 dark:border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                © 2025 National Bank of Canada. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900/10 dark:bg-white/10">
                  <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Trusted since {loading ? '1864' : (stats?.foundedYear || '1864')}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900/10 dark:bg-white/10">
                  <span className="text-lg">🇨🇦</span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Proudly Canadian</span>
                </div>
              </div>
            </div>
            
            {/* Scroll to Top Button */}
            <motion.button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-purple-500 dark:from-red-600 dark:to-purple-600 hover:from-red-600 hover:to-purple-600 dark:hover:from-red-500 dark:hover:to-purple-500 text-white font-bold transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowUp className="h-5 w-5" />
              <span>Back to Top</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}