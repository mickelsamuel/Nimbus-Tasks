'use client'

import React from 'react'
import { usePageTitle } from './hooks/usePageTitle'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  // Automatically update page title based on route
  usePageTitle()

  return <>{children}</>
}