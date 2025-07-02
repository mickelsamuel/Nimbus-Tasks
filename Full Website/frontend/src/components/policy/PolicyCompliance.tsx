'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Scale } from 'lucide-react'

interface PolicyComplianceProps {
  className?: string
}

export const PolicyCompliance: React.FC<PolicyComplianceProps> = ({ className = '' }) => {
  return (
    <motion.div
      className={`mt-12 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6 md:p-8 border border-red-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <h2 className="text-xl md:text-2xl font-bold text-red-800 mb-6 flex items-center">
        <Scale className="h-6 w-6 mr-3" />
        Additional Banking Compliance Requirements
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-red-800 mb-3">Regulatory Compliance</h3>
          <ul className="space-y-2 text-red-700 text-sm md:text-base">
            <li>• Office of the Superintendent of Financial Institutions (OSFI) guidelines</li>
            <li>• Financial Transactions and Reports Analysis Centre (FINTRAC) requirements</li>
            <li>• Provincial securities regulations and consumer protection laws</li>
            <li>• International banking standards and cross-border compliance</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-red-800 mb-3">Professional Standards</h3>
          <ul className="space-y-2 text-red-700 text-sm md:text-base">
            <li>• Fiduciary duty and best interest obligations</li>
            <li>• Market integrity and fair dealing practices</li>
            <li>• Client confidentiality and privacy protection</li>
            <li>• Continuous professional development requirements</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default PolicyCompliance