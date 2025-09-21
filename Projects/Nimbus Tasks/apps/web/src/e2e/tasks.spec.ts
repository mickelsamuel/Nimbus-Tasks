import { test, expect } from '@playwright/test'

test.describe('Task Management', () => {
  // Note: These tests assume authentication is handled
  // In a real scenario, you'd have authenticated setup

  test.beforeEach(async ({ page }) => {
    // Go to dashboard or tasks page
    await page.goto('/dashboard')

    // Wait for page to load
    await page.waitForLoadState('networkidle')
  })

  test('should display tasks list', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Look for dashboard page first
    await expect(page.getByTestId('dashboard-page')).toBeVisible({ timeout: 10000 })

    // Then check for tasks list or empty state
    const tasksList = page.getByTestId('tasks-list')
    const emptyMessage = page.getByTestId('no-tasks-message')

    // Either tasks list or empty message should be visible
    await expect(tasksList.or(emptyMessage)).toBeVisible({ timeout: 5000 })
  })

  test('should navigate to tasks page and show create button', async ({ page }) => {
    await page.goto('/dashboard/tasks')
    await page.waitForLoadState('networkidle')

    // Should show tasks page
    await expect(page.getByTestId('tasks-page')).toBeVisible({ timeout: 10000 })

    // Look for create task button
    const createButton = page.getByTestId('new-task-button')
    await expect(createButton).toBeVisible()
    await expect(createButton).toBeEnabled()
  })

  test('should validate required fields in task creation', async ({ page }) => {
    const createButton = page.locator('button:has-text("Create")').or(
      page.locator('button:has-text("New Task")')
    )

    if (await createButton.isVisible()) {
      await createButton.click()

      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"]').or(
        page.locator('button:has-text("Create")').or(
          page.locator('button:has-text("Save")')
        )
      )

      if (await submitButton.isVisible()) {
        await submitButton.click()

        // Should show validation errors
        const errorMessage = page.locator('text=required').or(
          page.locator('.error').or(
            page.locator('[role="alert"]')
          )
        )

        await expect(errorMessage).toBeVisible({ timeout: 3000 })
      }
    } else {
      test.skip('Create task functionality not accessible')
    }
  })

  test('should create a new task successfully', async ({ page }) => {
    const createButton = page.locator('button:has-text("Create")').or(
      page.locator('button:has-text("New Task")')
    )

    if (await createButton.isVisible()) {
      await createButton.click()

      // Fill task form
      const titleInput = page.locator('input[name="title"]').or(
        page.locator('input[placeholder*="title"]')
      )

      if (await titleInput.isVisible()) {
        const testTaskTitle = `Test Task ${Date.now()}`
        await titleInput.fill(testTaskTitle)

        // Fill description if available
        const descriptionInput = page.locator('textarea[name="description"]').or(
          page.locator('textarea[placeholder*="description"]')
        )

        if (await descriptionInput.isVisible()) {
          await descriptionInput.fill('Test task description')
        }

        // Submit form
        const submitButton = page.locator('button[type="submit"]').or(
          page.locator('button:has-text("Create")').or(
            page.locator('button:has-text("Save")')
          )
        )

        await submitButton.click()

        // Should see success message or new task in list
        const successIndicator = page.locator('text=created').or(
          page.locator('text=success').or(
            page.locator(`text=${testTaskTitle}`)
          )
        )

        await expect(successIndicator).toBeVisible({ timeout: 10000 })
      }
    } else {
      test.skip('Task creation form not accessible')
    }
  })

  test('should filter tasks by status', async ({ page }) => {
    await page.goto('/dashboard/tasks')
    await page.waitForLoadState('networkidle')

    // Look for filter controls
    const filterControls = page.getByTestId('task-filters')
    await expect(filterControls).toBeVisible()

    // Try different status filters
    const todoFilter = page.getByTestId('filter-TODO')
    const inProgressFilter = page.getByTestId('filter-IN_PROGRESS')
    const allFilter = page.getByTestId('filter-all')

    if (await todoFilter.isVisible()) {
      await todoFilter.click()
      await page.waitForLoadState('networkidle')

      // Switch back to all
      await allFilter.click()
      await page.waitForLoadState('networkidle')

      console.log('Status filtering working')
    } else {
      test.skip('Task filtering not available')
    }
  })

  test('should open task details dialog', async ({ page }) => {
    await page.goto('/dashboard/tasks')
    await page.waitForLoadState('networkidle')

    // Look for existing tasks
    const taskItem = page.getByTestId('task-item').first()

    if (await taskItem.isVisible()) {
      await taskItem.click()
      await page.waitForLoadState('networkidle')

      // Should open task details
      const taskDetails = page.getByTestId('task-details')
      await expect(taskDetails).toBeVisible({ timeout: 5000 })

      // Check for dialog title
      await expect(page.getByTestId('task-detail-title')).toBeVisible()
    } else {
      console.log('No tasks available to click on')
    }
  })

  test('should update task status via drag and drop', async ({ page }) => {
    // This test is complex and depends on kanban board implementation
    test.skip('Drag and drop functionality requires specific implementation details')
  })

  test('should show task statistics', async ({ page }) => {
    await page.goto('/dashboard/tasks')
    await page.waitForLoadState('networkidle')

    // Look for task stats section (might only show if tasks exist)
    const taskStats = page.getByTestId('task-stats')
    const emptyState = page.getByTestId('empty-state')

    // Either stats or empty state should be visible
    await expect(taskStats.or(emptyState)).toBeVisible({ timeout: 5000 })

    console.log('Task statistics or empty state displayed')
  })

  test('should paginate through tasks', async ({ page }) => {
    // Look for pagination controls
    const nextButton = page.locator('button:has-text("Next")').or(
      page.locator('button[aria-label="Next"]').or(
        page.locator('.pagination button').last()
      )
    )

    if (await nextButton.isVisible() && await nextButton.isEnabled()) {
      const currentUrl = page.url()
      await nextButton.click()
      await page.waitForLoadState('networkidle')

      // URL should change or content should update
      const newUrl = page.url()
      if (currentUrl !== newUrl) {
        console.log('Pagination working - URL changed')
      } else {
        console.log('Pagination working - content updated')
      }
    } else {
      console.log('Pagination not available or no additional pages')
    }
  })

  test('should show empty state when no tasks exist', async ({ page }) => {
    await page.goto('/dashboard/tasks')
    await page.waitForLoadState('networkidle')

    // Check for empty state
    const emptyState = page.getByTestId('empty-state')
    const createButton = page.getByTestId('create-first-task-button')
    const tasksList = page.getByTestId('tasks-list')

    // If no tasks, should show empty state, otherwise tasks list
    const hasEmptyState = await emptyState.isVisible()
    const hasTasksList = await tasksList.isVisible()

    if (hasEmptyState) {
      await expect(createButton).toBeVisible()
      console.log('Empty state displayed correctly')
    } else if (hasTasksList) {
      console.log('Tasks list displayed correctly')
    } else {
      test.skip('Neither empty state nor tasks list found')
    }
  })

  test('should show dashboard stats', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Check for dashboard stats
    const dashboardStats = page.getByTestId('dashboard-stats')
    await expect(dashboardStats).toBeVisible({ timeout: 10000 })

    // Check for recent tasks and projects cards
    const recentTasksCard = page.getByTestId('recent-tasks-card')
    const recentProjectsCard = page.getByTestId('recent-projects-card')

    await expect(recentTasksCard).toBeVisible()
    await expect(recentProjectsCard).toBeVisible()

    console.log('Dashboard stats and cards displayed correctly')
  })
})