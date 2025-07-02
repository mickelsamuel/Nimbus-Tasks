'use client'

import { ReactNode, useEffect, useState } from 'react'

interface DashboardContainerProps {
  children: ReactNode
}

export function DashboardContainer({ children }: DashboardContainerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium background with animated gradients */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full blur-3xl animate-pulse animation-delay-4000" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] dark:opacity-[0.04]" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="max-w-[1440px] mx-auto">
            <div className={`space-y-6 lg:space-y-8 ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
              {children}
            </div>
          </div>
        </div>
      </div>
      
      {/* Global Dashboard Styles */}
      <style jsx global>{`
        /* Premium glassmorphism for all dashboard cards */
        .dashboard-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 
            0 4px 24px rgba(0, 0, 0, 0.06),
            0 1px 2px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
          will-change: transform;
        }

        .dark .dashboard-card {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 4px 24px rgba(0, 0, 0, 0.2),
            0 1px 2px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        /* Enhanced hover state */
        .dashboard-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 
            0 12px 48px rgba(0, 0, 0, 0.12),
            0 4px 8px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }

        .dark .dashboard-card:hover {
          box-shadow: 
            0 12px 48px rgba(0, 0, 0, 0.3),
            0 4px 8px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* Interactive card - more pronounced effect */
        .dashboard-card-interactive {
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .dashboard-card-interactive::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: left 0.5s ease;
        }

        .dark .dashboard-card-interactive::before {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
        }

        .dashboard-card-interactive:hover::before {
          left: 100%;
        }

        /* Premium gradients */
        .gradient-primary {
          background: linear-gradient(135deg, #E01A1A 0%, #FF6B6B 100%);
        }

        .gradient-secondary {
          background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%);
        }

        .gradient-success {
          background: linear-gradient(135deg, #10B981 0%, #34D399 100%);
        }

        .gradient-warning {
          background: linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%);
        }

        /* Text gradients */
        .text-gradient-primary {
          background: linear-gradient(135deg, #E01A1A 0%, #FF6B6B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dark .text-gradient-primary {
          background: linear-gradient(135deg, #FF6B6B 0%, #FCA5A5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Smooth animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-slide-in-up {
          animation: slideInUp 0.5s ease-out forwards;
        }

        /* Animation delays */
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-2000 { animation-delay: 2000ms; }
        .animation-delay-4000 { animation-delay: 4000ms; }

        /* Premium shadows */
        .shadow-premium {
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .dark .shadow-premium {
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.3),
            0 2px 4px -1px rgba(0, 0, 0, 0.2),
            0 20px 25px -5px rgba(0, 0, 0, 0.3),
            0 10px 10px -5px rgba(0, 0, 0, 0.2);
        }

        /* Glow effects */
        .glow-primary {
          box-shadow: 0 0 20px rgba(224, 26, 26, 0.3);
        }

        .dark .glow-primary {
          box-shadow: 0 0 30px rgba(224, 26, 26, 0.5);
        }

        /* Loading skeleton */
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .skeleton {
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        .dark .skeleton {
          background: linear-gradient(
            90deg,
            #374151 25%,
            #4B5563 50%,
            #374151 75%
          );
          background-size: 1000px 100%;
        }

        /* Responsive grid system */
        .dashboard-grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        @media (min-width: 1024px) {
          .dashboard-grid {
            gap: 2rem;
          }
        }

        /* Custom scrollbar styling */
        .dashboard-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .dashboard-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .dashboard-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
          transition: background 0.2s;
        }

        .dashboard-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }

        .dark .dashboard-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }

        .dark .dashboard-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.7);
        }
      `}</style>
    </div>
  )
}