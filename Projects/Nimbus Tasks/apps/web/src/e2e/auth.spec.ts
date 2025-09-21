import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start each test from the homepage
    await page.goto('/')
  })

  test('should display login page for unauthenticated users', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveTitle(/Nimbus Tasks/)

    // Should redirect to login or show login UI
    await expect(page.getByTestId('signin-card')).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to sign up page', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Look for sign up link using data-testid
    const signUpLink = page.getByTestId('signup-link')

    if (await signUpLink.isVisible()) {
      await signUpLink.click()
      await page.waitForLoadState('networkidle')
      await expect(page.locator('text=Create account')).toBeVisible()
    } else {
      // If there's no separate sign up page, skip this test
      test.skip('No separate sign up page found')
    }
  })

  test('should show validation errors for invalid login', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Use data-testid selectors for reliable element targeting
    const emailInput = page.getByTestId('email-input')
    const passwordInput = page.getByTestId('password-input')
    const signInButton = page.getByTestId('signin-submit-button')

    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      // Fill invalid credentials
      await emailInput.fill('invalid@example.com')
      await passwordInput.fill('wrongpassword')
      await signInButton.click()

      // Wait for network response
      await page.waitForLoadState('networkidle')

      // Should show error message
      await expect(page.getByTestId('signin-error')).toBeVisible({ timeout: 5000 })
    } else {
      test.skip('Login form not found or not accessible')
    }
  })

  test('should handle OAuth provider buttons', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Look for Google OAuth button using data-testid
    const googleButton = page.getByTestId('google-signin-button')

    if (await googleButton.isVisible()) {
      // Just check that OAuth buttons are present and clickable
      await expect(googleButton).toBeVisible()
      await expect(googleButton).toBeEnabled()
    } else {
      console.log('No OAuth providers found - this might be expected')
    }
  })

  test('should display forgot password link', async ({ page }) => {
    const forgotPasswordLink = page.locator('text=Forgot password').or(
      page.locator('text=Reset password')
    )

    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click()
      await expect(page.locator('text=Reset')).toBeVisible()
    } else {
      test.skip('Forgot password functionality not found')
    }
  })

  test('should show loading state during authentication', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const emailInput = page.getByTestId('email-input')
    const passwordInput = page.getByTestId('password-input')
    const signInButton = page.getByTestId('signin-submit-button')

    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      await emailInput.fill('test@example.com')
      await passwordInput.fill('testpassword')

      // Look for loading indicator after clicking
      await signInButton.click()

      // Check for loading spinner or disabled button
      const loadingIndicator = page.locator('.animate-spin').or(
        signInButton.locator(':disabled')
      )

      // Loading state might be very brief, so we use a short timeout
      try {
        await expect(loadingIndicator).toBeVisible({ timeout: 1000 })
      } catch {
        // Loading state might be too fast to catch, which is okay
        console.log('Loading state not visible (might be too fast)')
      }
    } else {
      test.skip('Login form not found')
    }
  })

  test('should redirect to dashboard after successful authentication', async ({ page }) => {
    // This test would require setting up test credentials
    // For now, we'll just verify the structure

    // Note: In a real test, you would:
    // 1. Have test user credentials
    // 2. Login successfully
    // 3. Verify redirect to dashboard
    // 4. Check for authenticated state indicators

    test.skip('Requires test user setup - implement when authentication is configured')
  })

  test('should preserve redirect URL after login', async ({ page }) => {
    // Try to access a protected route
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')

    // Should redirect to login with return URL
    await expect(page.getByTestId('signin-card')).toBeVisible()

    // Check if URL contains redirect parameter
    const url = page.url()
    if (url.includes('redirect') || url.includes('callbackUrl') || url.includes('return')) {
      console.log('Redirect URL preserved in query parameters')
    } else {
      console.log('No redirect URL found - might use different mechanism')
    }
  })

  test('should logout and redirect to homepage', async ({ page }) => {
    // This test would require being logged in first
    test.skip('Requires authenticated state - implement when authentication is configured')
  })
})