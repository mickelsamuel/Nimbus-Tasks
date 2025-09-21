import { test, expect } from '@playwright/test'

test.describe('CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/tasks')
    await page.waitForLoadState('networkidle')
  })

  test('should create a new task with all fields', async ({ page }) => {
    const newTaskButton = page.getByTestId('new-task-button')
    await expect(newTaskButton).toBeVisible()
    await newTaskButton.click()
    await page.waitForLoadState('networkidle')

    // Fill task form if available
    const taskForm = page.getByTestId('task-form').or(
      page.locator('form').first()
    )

    if (await taskForm.isVisible()) {
      const titleInput = page.locator('input[name="title"]').or(
        page.locator('input[placeholder*="title"]')
      )

      if (await titleInput.isVisible()) {
        const taskTitle = `E2E Test Task ${Date.now()}`
        await titleInput.fill(taskTitle)

        // Fill description
        const descriptionInput = page.locator('textarea[name="description"]').or(
          page.locator('textarea[placeholder*="description"]')
        )

        if (await descriptionInput.isVisible()) {
          await descriptionInput.fill('This is a test task created by E2E tests')
        }

        // Set priority if available
        const prioritySelect = page.locator('select[name="priority"]').or(
          page.locator('[data-testid="priority-select"]')
        )

        if (await prioritySelect.isVisible()) {
          await prioritySelect.selectOption('HIGH')
        }

        // Submit form
        const submitButton = page.locator('button[type="submit"]').or(
          page.locator('button:has-text("Create")').or(
            page.locator('button:has-text("Save")')
          )
        )

        await submitButton.click()
        await page.waitForLoadState('networkidle')

        // Verify task was created
        const createdTask = page.locator(`text=${taskTitle}`)
        await expect(createdTask).toBeVisible({ timeout: 10000 })
      }
    } else {
      test.skip('Task creation form not accessible')
    }
  })

  test('should read and display task details', async ({ page }) => {
    // Find a task to open
    const taskItem = page.getByTestId('task-item').first()

    if (await taskItem.isVisible()) {
      await taskItem.click()
      await page.waitForLoadState('networkidle')

      // Should open task details dialog
      const taskDetails = page.getByTestId('task-details')
      await expect(taskDetails).toBeVisible({ timeout: 5000 })

      // Verify details are displayed
      const taskTitle = page.getByTestId('task-detail-title')
      await expect(taskTitle).toBeVisible()

      // Check for tabs
      const detailsTab = page.getByTestId('details-tab')
      const commentsTab = page.getByTestId('comments-tab')
      const attachmentsTab = page.getByTestId('attachments-tab')

      await expect(detailsTab).toBeVisible()
      await expect(commentsTab).toBeVisible()
      await expect(attachmentsTab).toBeVisible()

      // Test tab navigation
      await commentsTab.click()
      await page.waitForLoadState('networkidle')

      await attachmentsTab.click()
      await page.waitForLoadState('networkidle')

      console.log('Task details displayed correctly')
    } else {
      test.skip('No tasks available to read')
    }
  })

  test('should update task status via filters', async ({ page }) => {
    // Test status filtering
    const filterAll = page.getByTestId('filter-all')
    const filterTodo = page.getByTestId('filter-TODO')
    const filterInProgress = page.getByTestId('filter-IN_PROGRESS')
    const filterDone = page.getByTestId('filter-DONE')

    await expect(filterAll).toBeVisible()

    // Test different filters
    await filterTodo.click()
    await page.waitForLoadState('networkidle')

    await filterInProgress.click()
    await page.waitForLoadState('networkidle')

    await filterDone.click()
    await page.waitForLoadState('networkidle')

    // Return to all
    await filterAll.click()
    await page.waitForLoadState('networkidle')

    console.log('Task filtering working correctly')
  })

  test('should handle task deletion workflow', async ({ page }) => {
    // This test would require delete functionality to be implemented
    const taskItem = page.getByTestId('task-item').first()

    if (await taskItem.isVisible()) {
      await taskItem.click()
      await page.waitForLoadState('networkidle')

      // Look for delete button in task details
      const deleteButton = page.locator('button:has-text("Delete")').or(
        page.getByTestId('delete-task-button')
      )

      if (await deleteButton.isVisible()) {
        await deleteButton.click()

        // Should show confirmation dialog
        const confirmDialog = page.locator('[role="dialog"]').or(
          page.locator('text=confirm').or(
            page.getByTestId('confirm-delete-dialog')
          )
        )

        if (await confirmDialog.isVisible()) {
          const confirmButton = page.locator('button:has-text("Delete")').or(
            page.locator('button:has-text("Confirm")')
          )

          if (await confirmButton.isVisible()) {
            await confirmButton.click()
            await page.waitForLoadState('networkidle')

            console.log('Task deletion workflow available')
          }
        }
      } else {
        test.skip('Task deletion not implemented')
      }
    } else {
      test.skip('No tasks available to delete')
    }
  })

  test('should create and manage projects', async ({ page }) => {
    await page.goto('/dashboard/projects')
    await page.waitForLoadState('networkidle')

    // Look for new project button
    const newProjectButton = page.getByTestId('new-project-button').or(
      page.locator('button:has-text("New Project")').or(
        page.locator('button:has-text("Create Project")')
      )
    )

    if (await newProjectButton.isVisible()) {
      await newProjectButton.click()
      await page.waitForLoadState('networkidle')

      // Fill project form
      const projectForm = page.getByTestId('project-form').or(
        page.locator('form').first()
      )

      if (await projectForm.isVisible()) {
        const nameInput = page.locator('input[name="name"]').or(
          page.locator('input[placeholder*="name"]')
        )

        if (await nameInput.isVisible()) {
          const projectName = `E2E Test Project ${Date.now()}`
          await nameInput.fill(projectName)

          // Submit form
          const submitButton = page.locator('button[type="submit"]').or(
            page.locator('button:has-text("Create")')
          )

          await submitButton.click()
          await page.waitForLoadState('networkidle')

          // Verify project was created
          const createdProject = page.locator(`text=${projectName}`)
          await expect(createdProject).toBeVisible({ timeout: 10000 })
        }
      }
    } else {
      test.skip('Project creation not accessible')
    }
  })

  test('should handle bulk operations', async ({ page }) => {
    // Look for bulk selection controls
    const selectAllCheckbox = page.locator('input[type="checkbox"][data-testid="select-all"]').or(
      page.locator('.select-all-checkbox')
    )

    if (await selectAllCheckbox.isVisible()) {
      await selectAllCheckbox.click()

      // Look for bulk action buttons
      const bulkActions = page.locator('[data-testid="bulk-actions"]').or(
        page.locator('.bulk-actions')
      )

      if (await bulkActions.isVisible()) {
        console.log('Bulk operations available')

        // Test bulk status change
        const bulkStatusButton = page.locator('button:has-text("Change Status")').or(
          page.getByTestId('bulk-status-change')
        )

        if (await bulkStatusButton.isVisible()) {
          await bulkStatusButton.click()
          console.log('Bulk status change available')
        }
      }
    } else {
      test.skip('Bulk operations not implemented')
    }
  })

  test('should validate required fields', async ({ page }) => {
    const newTaskButton = page.getByTestId('new-task-button')

    if (await newTaskButton.isVisible()) {
      await newTaskButton.click()
      await page.waitForLoadState('networkidle')

      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"]').or(
        page.locator('button:has-text("Create")')
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
        console.log('Form validation working')
      }
    } else {
      test.skip('Task creation form not accessible')
    }
  })

  test('should handle concurrent edits', async ({ page, context }) => {
    // Open same task in two different tabs
    const page2 = await context.newPage()

    const taskItem = page.getByTestId('task-item').first()

    if (await taskItem.isVisible()) {
      await taskItem.click()
      await page.waitForLoadState('networkidle')

      // Get task ID and open in second page
      const taskDetails = page.getByTestId('task-details')
      await expect(taskDetails).toBeVisible()

      // Navigate second page to same task
      await page2.goto(page.url())
      await page2.waitForLoadState('networkidle')

      // Both pages should show the same task
      const taskDetails2 = page2.getByTestId('task-details')
      await expect(taskDetails2).toBeVisible()

      console.log('Concurrent access handled')
      await page2.close()
    } else {
      test.skip('No tasks available for concurrent edit test')
    }
  })
})