import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'
import '@/styles/performance.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { TranslationProvider } from '@/contexts/TranslationContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ErrorProvider } from '@/contexts/ErrorContext'
import ErrorBoundary from '@/components/common/ErrorBoundary'

// Dynamically import non-critical components
const DynamicToaster = dynamic(() => import('@/components/common/ToasterWrapper'), {
  ssr: false
})

const DynamicAvatarOnboardingProvider = dynamic(() => import('@/components/avatar/AvatarOnboardingProvider'), {
  ssr: false,
  loading: () => <div />
})

const DynamicScrollOptimizationProvider = dynamic(() => import('@/components/providers/ScrollOptimizationProvider'), {
  ssr: false,
  loading: () => <div />
})

// const DynamicPerformanceMonitor = dynamic(() => import('@/components/common/PerformanceMonitor'), {
//   ssr: false,
//   loading: () => <div />
// })

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BNC Training Platform',
  description: 'National Bank of Canada Training & Development Platform',
  keywords: ['banking', 'training', 'education', 'bnc', 'national bank'],
  authors: [{ name: 'National Bank of Canada' }],
  robots: 'noindex, nofollow', // Since this is a prototype
  openGraph: {
    title: 'BNC Training Platform',
    description: 'National Bank of Canada Training & Development Platform',
    type: 'website',
    siteName: 'BNC Training',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var shouldBeDark = theme === 'dark' || (!theme && systemPrefersDark);
                  
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Fallback to light mode
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E01A1A" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 scroll-smooth ios-scroll-fix`} suppressHydrationWarning>
        <ErrorBoundary>
          <ErrorProvider>
            <DynamicScrollOptimizationProvider>
              <ThemeProvider>
                <TranslationProvider>
                  <AuthProvider>
                    <DynamicAvatarOnboardingProvider>
                      {children}
                    </DynamicAvatarOnboardingProvider>
                  </AuthProvider>
                </TranslationProvider>
              </ThemeProvider>
            </DynamicScrollOptimizationProvider>
            <DynamicToaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1F2937',
                  color: '#F9FAFB',
                  border: '1px solid #374151'
                }
              }}
            />
            {/* <DynamicPerformanceMonitor 
              enabled={process.env.NODE_ENV === 'development'}
              position="bottom-right"
              showDetails={false}
            /> */}
          </ErrorProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}