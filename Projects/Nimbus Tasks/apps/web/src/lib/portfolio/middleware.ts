import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { isPortfolioMode, canPerformAction, PORTFOLIO_CONFIG } from './config'

// API routes that should be blocked in portfolio mode
const PROTECTED_ROUTES = [
  '/api/tasks',
  '/api/projects',
  '/api/organizations',
  '/api/users',
  '/api/comments',
  '/api/upload'
]

// HTTP methods that modify data
const WRITE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

export async function portfolioMiddleware(request: NextRequest) {
  // Skip if not in portfolio mode
  if (!isPortfolioMode()) {
    return NextResponse.next()
  }

  const { pathname, search } = request.nextUrl
  const method = request.method

  // Allow all GET requests (read-only access)
  if (method === 'GET') {
    return NextResponse.next()
  }

  // Check if this is a write operation to a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isWriteOperation = WRITE_METHODS.includes(method)

  if (isProtectedRoute && isWriteOperation) {
    // Get user token to check if they're a demo user
    const token = await getToken({ req: request })

    // Block write operations for all users in portfolio mode
    return NextResponse.json(
      {
        error: 'Portfolio Demo Mode',
        message: PORTFOLIO_CONFIG.readOnly.tooltipMessage,
        action: 'blocked',
        allowedMethods: ['GET'],
        portfolioMode: true
      },
      { status: 403 }
    )
  }

  // Allow auth and other non-protected routes
  return NextResponse.next()
}

// Helper function to check if a user session is in demo mode
export function isDemoSession(userId?: string): boolean {
  if (!isPortfolioMode()) return false
  if (!userId) return true // Treat anonymous users as demo users in portfolio mode

  return PORTFOLIO_CONFIG.demoUsers.some(user => user.id === userId)
}

// Portfolio-aware API response wrapper
export function portfolioApiResponse<T>(data: T, isWrite: boolean = false): T {
  if (!isPortfolioMode()) return data

  // Add portfolio metadata to responses
  const response = {
    ...data,
    _portfolioMode: true,
    _readOnly: true,
    _demoData: true
  }

  return response as T
}

// Client-side helper to disable write operations
export function usePortfolioRestrictions() {
  const isDemo = isPortfolioMode()

  return {
    isPortfolioMode: isDemo,
    canCreate: !isDemo,
    canEdit: !isDemo,
    canDelete: !isDemo,
    showTooltip: isDemo && PORTFOLIO_CONFIG.readOnly.showTooltips,
    tooltipMessage: PORTFOLIO_CONFIG.readOnly.tooltipMessage,

    // Helper to wrap action handlers
    wrapAction: <T extends (...args: any[]) => any>(action: T): T => {
      return ((...args: any[]) => {
        if (isDemo) {
          console.warn('Action blocked in portfolio mode:', action.name)
          // You could show a toast notification here
          return Promise.reject(new Error(PORTFOLIO_CONFIG.readOnly.tooltipMessage))
        }
        return action(...args)
      }) as T
    }
  }
}

// Portfolio banner component props
export function getPortfolioBannerProps() {
  if (!isPortfolioMode() || !PORTFOLIO_CONFIG.banner.show) {
    return null
  }

  return {
    message: PORTFOLIO_CONFIG.banner.message,
    ctaText: PORTFOLIO_CONFIG.banner.ctaText,
    ctaLink: PORTFOLIO_CONFIG.banner.ctaLink,
    variant: 'info' as const,
    dismissible: false
  }
}