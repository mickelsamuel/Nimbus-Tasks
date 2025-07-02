'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, Zap } from 'lucide-react'

export default function ForgotPasswordFeatures() {
  const features = [
    {
      icon: Lock,
      title: 'Bank-Grade Protection',
      description: 'Your account protected by banking-standard encryption',
      gradient: 'linear-gradient(145deg, #EF4444 0%, #DC2626 100%)',
      shadowColor: 'rgba(239,68,68,0.3)',
      animation: { rotateY: [0, 10, -10, 0] }
    },
    {
      icon: Mail,
      title: 'Verified Secure Delivery',
      description: 'Secure email delivery to verified banking addresses only',
      gradient: 'linear-gradient(145deg, #0D9488 0%, #0891B2 100%)',
      shadowColor: 'rgba(13,148,136,0.3)',
      animation: { scale: [1, 1.1, 1] }
    },
    {
      icon: Zap,
      title: 'Rapid Secure Recovery',
      description: 'Fast recovery without compromising security standards',
      gradient: 'linear-gradient(145deg, #3B82F6 0%, #1E40AF 100%)',
      shadowColor: 'rgba(59,130,246,0.3)',
      animation: { rotate: [0, 360] }
    }
  ]

  return (
    <motion.div
      className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.2 }}
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="group text-center p-6 rounded-2xl relative overflow-hidden backdrop-blur-sm"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.25)'
          }}
          whileHover={{ 
            scale: 1.08, 
            y: -8,
            boxShadow: '0 15px 40px rgba(255,255,255,0.1)'
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
        >
          {/* Dark mode overlay */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 dark:opacity-100"
            style={{
              background: 'linear-gradient(145deg, rgba(17,24,39,0.8) 0%, rgba(31,41,55,0.6) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)'
            }}
          />
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${15 + i * 25}%`
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.2 + i * 0.5
                }}
              />
            ))}
          </div>
          
          {/* Icon container */}
          <motion.div
            className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 z-10"
            style={{
              background: feature.gradient,
              boxShadow: `0 12px 30px ${feature.shadowColor}`
            }}
            animate={{
              ...feature.animation,
              boxShadow: [
                `0 12px 30px ${feature.shadowColor}`,
                `0 15px 40px ${feature.shadowColor.replace('0.3', '0.5')}`,
                `0 12px 30px ${feature.shadowColor}`
              ]
            }}
            transition={{ 
              duration: index === 2 ? 8 : index === 1 ? 4 : 5, 
              repeat: Infinity,
              ease: index === 2 ? 'linear' : 'easeInOut'
            }}
          >
            <feature.icon className="h-8 w-8 text-white relative z-10" />
            
            {/* Icon glow effect */}
            <motion.div
              className="absolute inset-2 rounded-xl border border-white/40"
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [0.9, 1.1, 0.9]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
          
          <motion.h3 
            className="text-base font-bold text-white dark:text-gray-100 mb-2 relative z-10"
            animate={{
              textShadow: [
                '0 2px 10px rgba(255,255,255,0.2)',
                '0 2px 15px rgba(255,255,255,0.4)',
                '0 2px 10px rgba(255,255,255,0.2)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
          >
            {feature.title}
          </motion.h3>
          
          <motion.p 
            className="text-sm text-white/90 dark:text-gray-300 leading-relaxed relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + index * 0.1 }}
          >
            {feature.description}
          </motion.p>
          
          {/* Shimmer effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, ease: 'linear' }}
          />
          
          {/* Bottom accent */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 1.6 + index * 0.2, duration: 0.8, ease: 'easeOut' }}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}