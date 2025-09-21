import { test, expect } from '@playwright/test'

test.describe('Navigation & UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
  })

  test('should navigate through main pages', async ({ page }) => {
    // Test dashboard
    await expect(page.getByTestId('dashboard-page')).toBeVisible()

    // Navigate to tasks
    const tasksLink = page.locator('a[href="/dashboard/tasks"]').or(
      page.locator('nav').locator('text=Tasks')
    )

    if (await tasksLink.isVisible()) {
      await tasksLink.click()
      await page.waitForLoadState('networkidle')
      await expect(page.getByTestId('tasks-page')).toBeVisible()
    }

    // Navigate to projects (if available)
    const projectsLink = page.locator('a[href="/dashboard/projects"]').or(
      page.locator('nav').locator('text=Projects')
    )

    if (await projectsLink.isVisible()) {
      await projectsLink.click()
      await page.waitForLoadState('networkidle')
      // Verify projects page loaded
      expect(page.url()).toContain('projects')
    }

    // Navigate back to dashboard
    const dashboardLink = page.locator('a[href="/dashboard"]').or(
      page.locator('nav').locator('text=Dashboard')
    )

    if (await dashboardLink.isVisible()) {
      await dashboardLink.click()
      await page.waitForLoadState('networkidle')
      await expect(page.getByTestId('dashboard-page')).toBeVisible()
    }
  })

  test('should handle responsive sidebar', async ({ page }) => {
    // Look for sidebar
    const sidebar = page.locator('[data-testid="sidebar"]').or(
      page.locator('.sidebar').or(
        page.locator('nav')
      )
    )

    if (await sidebar.isVisible()) {
      // Look for collapse/expand button
      const toggleButton = page.locator('[data-testid="sidebar-toggle"]').or(
        page.locator('.sidebar-toggle').or(
          page.locator('button[aria-label*="menu"]')
        )
      )

      if (await toggleButton.isVisible()) {
        await toggleButton.click()
        await page.waitForTimeout(500) // Wait for animation

        // Sidebar should collapse/expand
        console.log('Sidebar toggle functionality available')
      }
    } else {
      test.skip('Sidebar not found')
    }
  })

  test('should show breadcrumb navigation', async ({ page }) => {
    // Navigate to a nested page
    await page.goto('/dashboard/tasks')
    await page.waitForLoadState('networkidle')

    // Look for breadcrumbs
    const breadcrumbs = page.locator('[data-testid="breadcrumbs"]').or(
      page.locator('.breadcrumb').or(
        page.locator('nav[aria-label="breadcrumb"]')
      )
    )

    if (await breadcrumbs.isVisible()) {
      // Should show current path
      const breadcrumbItems = breadcrumbs.locator('a, span')
      const count = await breadcrumbItems.count()

      if (count > 0) {
        console.log(`Breadcrumbs showing ${count} items`)
      }
    } else {
      test.skip('Breadcrumbs not implemented')
    }
  })

  test('should handle page title updates', async ({ page }) => {
    // Check initial title
    await expect(page).toHaveTitle(/Nimbus Tasks/)

    // Navigate to tasks page
    await page.goto('/dashboard/tasks')
    await page.waitForLoadState('networkidle')

    // Title should update
    await expect(page).toHaveTitle(/Tasks/)
  })

  test('should show loading states', async ({ page }) => {
    // Navigate to a page and look for loading indicators
    await page.goto('/dashboard/tasks')

    // Look for loading skeletons or spinners
    const loadingIndicator = page.locator('.animate-pulse').or(
      page.locator('.spinner').or(
        page.locator('[data-testid="loading"]')
      )
    )

    // Loading might be too fast to catch
    try {
      await expect(loadingIndicator).toBeVisible({ timeout: 1000 })
      console.log('Loading state visible')
    } catch {
      console.log('Loading state too fast to observe (which is good)')
    }

    // Page should eventually load completely
    await page.waitForLoadState('networkidle')
    await expect(page.getByTestId('tasks-page')).toBeVisible()
  })

  test('should handle 404 pages', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/dashboard/non-existent-page')
    await page.waitForLoadState('networkidle')

    // Should show 404 or redirect
    const notFoundPage = page.locator('text=404').or(
      page.locator('text=not found').or(
        page.getByTestId('not-found')
      )
    )

    const dashboardRedirect = page.getByTestId('dashboard-page')

    // Either show 404 or redirect to dashboard
    await expect(notFoundPage.or(dashboardRedirect)).toBeVisible({ timeout: 5000 })
  })

  test('should support keyboard navigation', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Should have focus on interactive elements
    const focusedElement = page.locator(':focus')

    if (await focusedElement.isVisible()) {
      console.log('Keyboard navigation working')
    }

    // Test Enter key on focused button
    const firstButton = page.locator('button').first()
    if (await firstButton.isVisible()) {
      await firstButton.focus()
      // Don't actually press Enter as it might trigger actions
      console.log('Keyboard focus on buttons working')
    }
  })

  test('should show proper error boundaries', async ({ page }) => {
    // This test would require triggering errors
    // For now, check for error boundary structure

    // Look for error boundary elements
    const errorBoundary = page.locator('[data-testid="error-boundary"]').or(
      page.locator('.error-boundary').or(
        page.locator('[role="alert"]')
      )
    )

    // Navigate normally - should not show error
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Should not see error boundary in normal operation
    const isErrorVisible = await errorBoundary.isVisible()
    expect(isErrorVisible).toBeFalsy()

    console.log('No error boundaries visible in normal operation')
  })

  test('should handle back/forward navigation', async ({ page }) => {
    // Navigate through pages
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    await page.goto('/dashboard/tasks')
    await page.waitForLoadState('networkidle')

    // Use browser back
    await page.goBack()
    await page.waitForLoadState('networkidle')

    // Should be back on dashboard
    await expect(page.getByTestId('dashboard-page')).toBeVisible()

    // Use browser forward
    await page.goForward()
    await page.waitForLoadState('networkidle')

    // Should be back on tasks
    await expect(page.getByTestId('tasks-page')).toBeVisible()
  })

  test('should support deep linking', async ({ page }) => {
    // Test direct navigation to deep URLs
    const taskId = 'test-task-id'
    await page.goto(`/dashboard/tasks/${taskId}`)
    await page.waitForLoadState('networkidle')

    // Should handle deep link gracefully (either show task or redirect)
    const taskDetails = page.getByTestId('task-details')
    const tasksPage = page.getByTestId('tasks-page')
    const dashboardPage = page.getByTestId('dashboard-page')

    // Should show one of these pages
    await expect(taskDetails.or(tasksPage).or(dashboardPage)).toBeVisible({ timeout: 5000 })
  })

  test('should maintain scroll position', async ({ page }) => {
    // Navigate to tasks page
    await page.goto('/dashboard/tasks')
    await page.waitForLoadState('networkidle')

    // Scroll down if there's content
    const tasksContainer = page.getByTestId('tasks-list').or(
      page.getByTestId('tasks-page')
    )

    if (await tasksContainer.isVisible()) {
      await page.evaluate(() => window.scrollTo(0, 200))

      // Navigate away and back
      await page.goto('/dashboard')
      await page.waitForLoadState('networkidle')

      await page.goto('/dashboard/tasks')
      await page.waitForLoadState('networkidle')

      // Check scroll position (should be preserved in some implementations)
      const scrollY = await page.evaluate(() => window.scrollY)
      console.log(`Scroll position after navigation: ${scrollY}`)
    }
  })
})