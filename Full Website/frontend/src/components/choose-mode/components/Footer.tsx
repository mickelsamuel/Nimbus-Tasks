import React from 'react'
import { motion, Variants } from 'framer-motion'
import { Shield } from 'lucide-react'
import { ThemeType } from '../types'

interface FooterProps {
  theme: ThemeType
  enterpriseText: string
  copyrightText: string
  itemVariants: Variants
}

export const Footer: React.FC<FooterProps> = ({
  theme,
  enterpriseText,
  copyrightText,
  itemVariants
}) => {
  const isDark = theme === 'dark'

  return (
    <motion.div
      className="mt-12 text-center"
      variants={itemVariants}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Shield className={`h-4 w-4 ${isDark ? 'text-white/70' : 'text-gray-600'}`} aria-hidden="true" />
        <span className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
          {enterpriseText}
        </span>
      </div>
      <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
        {copyrightText}
      </p>
    </motion.div>
  )
}