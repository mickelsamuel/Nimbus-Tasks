'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

interface DemoAccountsProps {
  isAdminMode?: boolean
}

export default function DemoAccounts({ isAdminMode = false }: DemoAccountsProps) {
  // Get demo credentials from environment variables
  const demoCredentials = {
    admin: {
      email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || 'admin@bnc.ca',
      password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || 'admin123'
    },
    deptAdmin: {
      email: process.env.NEXT_PUBLIC_DEMO_DEPT_ADMIN_EMAIL || 'dept.admin@bnc.ca',
      password: process.env.NEXT_PUBLIC_DEMO_DEPT_ADMIN_PASSWORD || 'admin123'
    },
    manager: {
      email: process.env.NEXT_PUBLIC_DEMO_MANAGER_EMAIL || 'sarah.johnson@bnc.ca',
      password: process.env.NEXT_PUBLIC_DEMO_MANAGER_PASSWORD || 'password123'
    },
    employee: {
      email: process.env.NEXT_PUBLIC_DEMO_EMPLOYEE_EMAIL || 'john.smith@bnc.ca',
      password: process.env.NEXT_PUBLIC_DEMO_EMPLOYEE_PASSWORD || 'password123'
    }
  };

  // Don't show demo accounts in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  return (
    <motion.div 
      className="mt-8 p-4 rounded-xl border"
      style={{
        background: isAdminMode 
          ? 'linear-gradient(145deg, rgba(139,0,0,0.1) 0%, rgba(139,0,0,0.05) 100%)'
          : 'linear-gradient(145deg, rgba(30,64,175,0.1) 0%, rgba(30,64,175,0.05) 100%)',
        borderColor: isAdminMode ? 'rgba(139,0,0,0.2)' : 'rgba(30,64,175,0.2)'
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Shield className={`h-4 w-4 ${isAdminMode ? 'text-red-600' : 'text-blue-600'}`} />
        <h3 className={`text-sm font-bold ${isAdminMode ? 'text-red-900 dark:text-red-300' : 'text-blue-900 dark:text-blue-300'}`}>
          {isAdminMode ? 'Administrative Test Accounts' : 'Executive Demo Accounts'}
        </h3>
      </div>
      <div className="space-y-3 text-xs">
        {isAdminMode ? (
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="font-semibold text-red-800 dark:text-red-300">Super Admin:</div>
              <div className="text-red-700 dark:text-red-400 font-mono">{demoCredentials.admin.email} / {demoCredentials.admin.password}</div>
            </div>
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <div className="font-semibold text-orange-800 dark:text-orange-300">Department Admin:</div>
              <div className="text-orange-700 dark:text-orange-400 font-mono">{demoCredentials.deptAdmin.email} / {demoCredentials.deptAdmin.password}</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="font-semibold text-blue-800 dark:text-blue-300">Employee:</div>
              <div className="text-blue-700 dark:text-blue-400 font-mono">{demoCredentials.employee.email} / {demoCredentials.employee.password}</div>
            </div>
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="font-semibold text-green-800 dark:text-green-300">Manager:</div>
              <div className="text-green-700 dark:text-green-400 font-mono">{demoCredentials.manager.email} / {demoCredentials.manager.password}</div>
            </div>
          </div>
        )}
      </div>
      
      {/* Security Notice */}
      <motion.div
        className={`mt-3 p-2 rounded-lg border-l-4 ${
          isAdminMode 
            ? 'bg-red-50 dark:bg-red-900/10 border-red-500' 
            : 'bg-amber-50 dark:bg-amber-900/10 border-amber-500'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className={`text-xs font-medium ${
          isAdminMode ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300'
        }`}>
          {isAdminMode ? '⚠️ Administrative access for testing only' : '💡 Demo environment - full access enabled'}
        </div>
      </motion.div>
    </motion.div>
  )
}