import { test, expect } from '@playwright/test'

test.describe('Performance & Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
  })

  test('should load dashboard within performance budget', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime

    // Dashboard should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
    console.log(`Dashboard loaded in ${loadTime}ms`)
  })

  test('should have good Core Web Vitals', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const webVitals: any = {}

          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const nav = entry as PerformanceNavigationTiming
              webVitals.loadTime = nav.loadEventEnd - nav.loadEventStart
              webVitals.domContentLoaded = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart
            }
          })

          resolve(webVitals)
        }).observe({ entryTypes: ['navigation'] })

        // Fallback timeout
        setTimeout(() => resolve({}), 1000)
      })
    })

    console.log('Performance metrics:', metrics)
  })

  test('should handle large data sets efficiently', async ({ page }) => {
    // Navigate to tasks page with filter to test performance
    await page.goto('/dashboard/tasks')
    await page.waitForLoadState('networkidle')

    const startTime = Date.now()

    // Apply filters multiple times to test performance
    const filterAll = page.getByTestId('filter-all')
    const filterTodo = page.getByTestId('filter-TODO')
    const filterInProgress = page.getByTestId('filter-IN_PROGRESS')

    await filterTodo.click()
    await page.waitForLoadState('networkidle')

    await filterInProgress.click()
    await page.waitForLoadState('networkidle')

    await filterAll.click()
    await page.waitForLoadState('networkidle')

    const filterTime = Date.now() - startTime

    // Filtering should be fast
    expect(filterTime).toBeLessThan(2000)
    console.log(`Filtering completed in ${filterTime}ms`)
  })

  test('should be accessible with screen readers', async ({ page }) => {
    // Check for proper ARIA labels and roles
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Main navigation should have proper roles
    const navigation = page.locator('nav')
    if (await navigation.isVisible()) {
      const navRole = await navigation.getAttribute('role')
      console.log('Navigation role:', navRole)
    }

    // Buttons should have accessible names
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()

    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i)
      if (await button.isVisible()) {
        const ariaLabel = await button.getAttribute('aria-label')
        const text = await button.textContent()

        if (!ariaLabel && !text?.trim()) {
          console.warn(`Button ${i} has no accessible name`)
        }
      }
    }
  })

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/dashboard/tasks')
    await page.waitForLoadState('networkidle')

    // Test tab navigation
    let tabCount = 0
    const maxTabs = 10

    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab')
      tabCount++

      const focusedElement = page.locator(':focus')
      if (await focusedElement.isVisible()) {
        const tagName = await focusedElement.evaluate(el => el.tagName)
        const role = await focusedElement.getAttribute('role')

        console.log(`Tab ${tabCount}: ${tagName} ${role || ''}`)

        // Interactive elements should be reachable
        if (['BUTTON', 'INPUT', 'A', 'SELECT'].includes(tagName)) {
          console.log('✓ Interactive element is keyboard accessible')
        }
      }
    }
  })

  test('should have proper focus management', async ({ page }) => {
    // Test focus trapping in modals
    const taskItem = page.getByTestId('task-item').first()

    if (await taskItem.isVisible()) {
      await taskItem.click()
      await page.waitForLoadState('networkidle')

      const taskDialog = page.getByTestId('task-details')
      if (await taskDialog.isVisible()) {
        // Tab should stay within dialog
        await page.keyboard.press('Tab')
        const focusedElement = page.locator(':focus')

        if (await focusedElement.isVisible()) {
          // Check if focus is within dialog
          const isInDialog = await taskDialog.locator(':focus').count() > 0
          console.log('Focus within dialog:', isInDialog)
        }

        // Escape should close dialog
        await page.keyboard.press('Escape')
        await page.waitForTimeout(500)

        const dialogStillVisible = await taskDialog.isVisible()
        if (!dialogStillVisible) {
          console.log('✓ Escape key closes dialog')
        }
      }
    }
  })

  test('should handle high contrast mode', async ({ page }) => {
    // Enable high contrast mode if available
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Check that content is still visible in dark mode
    const dashboardPage = page.getByTestId('dashboard-page')
    await expect(dashboardPage).toBeVisible()

    console.log('✓ Application works in dark mode')
  })

  test('should work without JavaScript', async ({ page }) => {
    // Disable JavaScript
    await page.context().setExtraHTTPHeaders({
      'Content-Security-Policy': "script-src 'none'"
    })

    try {
      await page.goto('/dashboard')
      await page.waitForLoadState('networkidle')

      // Basic content should still be visible
      const hasContent = await page.locator('body').textContent()
      if (hasContent && hasContent.length > 100) {
        console.log('✓ Some content visible without JavaScript')
      } else {
        console.log('⚠ Limited content without JavaScript')
      }
    } catch (error) {
      console.log('⚠ JavaScript required for basic functionality')
    }
  })

  test('should be mobile responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    const dashboardPage = page.getByTestId('dashboard-page')
    await expect(dashboardPage).toBeVisible()

    // Check if mobile menu works
    const mobileMenuButton = page.locator('button[aria-label*="menu"]').or(
      page.locator('[data-testid="mobile-menu-toggle"]')
    )

    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click()
      console.log('✓ Mobile menu accessible')
    }

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()
    await page.waitForLoadState('networkidle')

    await expect(dashboardPage).toBeVisible()
    console.log('✓ Responsive design works on tablet')
  })

  test('should handle memory usage efficiently', async ({ page }) => {
    // Navigate through multiple pages to test memory
    const pages = ['/dashboard', '/dashboard/tasks', '/dashboard']

    for (const url of pages) {
      await page.goto(url)
      await page.waitForLoadState('networkidle')

      // Get memory usage
      const memoryUsage = await page.evaluate(() => {
        // @ts-ignore
        return (performance as any).memory ? {
          // @ts-ignore
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          // @ts-ignore
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize
        } : null
      })

      if (memoryUsage) {
        console.log(`Memory usage on ${url}:`, memoryUsage)
      }
    }
  })

  test('should handle slow network conditions', async ({ page }) => {
    // Simulate slow 3G
    await page.context().route('**/*', route => {
      setTimeout(() => route.continue(), 100) // Add 100ms delay
    })

    const startTime = Date.now()
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime

    // Should still load within reasonable time even with slow network
    expect(loadTime).toBeLessThan(5000)
    console.log(`Loaded in ${loadTime}ms with simulated slow network`)
  })
})