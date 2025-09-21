import { chromium, type FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0]?.use ?? {}

  if (!baseURL) {
    throw new Error('baseURL is not defined in the config')
  }

  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Wait for the app to be ready
    console.log('🚀 Waiting for app to be ready...')
    await page.goto(baseURL)
    await page.waitForLoadState('networkidle')
    console.log('✅ App is ready!')

    // Set up test database if needed
    // This is where you could run database migrations, seed data, etc.
    console.log('🗄️ Setting up test environment...')

    // You could make API calls to set up test data
    // await page.request.post(`${baseURL}/api/test/setup`)

    console.log('✅ Test environment ready!')
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}

export default globalSetup