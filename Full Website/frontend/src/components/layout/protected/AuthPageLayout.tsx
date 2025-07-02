'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface AuthPageLayoutProps {
  children: React.ReactNode
}

export default function AuthPageLayout({ children }: AuthPageLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}