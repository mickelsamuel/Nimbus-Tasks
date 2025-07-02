'use client'

import dynamic from 'next/dynamic'
import { PublicHeader } from '@/components/homepage'

// Lazy load sections for better initial page load
const HeroSection = dynamic(() => import('@/components/homepage/HeroSection').then(mod => ({ default: mod.HeroSection })), {
  loading: () => <div className="h-screen bg-gray-50 dark:bg-gray-900 animate-pulse" />,
  ssr: true
})

const FeaturesSection = dynamic(() => import('@/components/homepage/FeaturesSection').then(mod => ({ default: mod.FeaturesSection })), {
  loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-900 animate-pulse" />,
  ssr: false
})

const CTASection = dynamic(() => import('@/components/homepage/CTASection').then(mod => ({ default: mod.CTASection })), {
  loading: () => <div className="h-64 bg-gray-50 dark:bg-gray-900 animate-pulse" />,
  ssr: false
})

const FooterSection = dynamic(() => import('@/components/homepage/FooterSection').then(mod => ({ default: mod.FooterSection })), {
  loading: () => <div className="h-48 bg-gray-50 dark:bg-gray-900 animate-pulse" />,
  ssr: false
})

export default function HomePage() {
  // Simplified animation variants for performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="pt-16">
        <HeroSection 
          containerVariants={containerVariants}
          itemVariants={itemVariants}
        />
        
        <FeaturesSection 
          containerVariants={containerVariants}
          itemVariants={itemVariants}
        />
        
        <CTASection 
          itemVariants={itemVariants}
        />
        
        <FooterSection />
      </main>
    </div>
  )
}