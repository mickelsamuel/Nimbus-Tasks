'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function LoginFooter() {
  return (
    <motion.div
      className="mt-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Shield className="h-4 w-4 text-white/70" />
        <span className="text-sm text-white/70 font-medium">Bank-Grade Security</span>
      </div>
      
      {/* Keyboard Shortcuts Hint */}
      <div className="mb-3 text-xs text-white/50">
        <p>Keyboard shortcuts: Alt+E (Employee) • Alt+A (Admin) • Alt+L (Login) • Alt+R (Register)</p>
      </div>
      
      <p className="text-sm text-white/60">
        © 2025 National Bank of Canada. All rights reserved.
      </p>
    </motion.div>
  )
}