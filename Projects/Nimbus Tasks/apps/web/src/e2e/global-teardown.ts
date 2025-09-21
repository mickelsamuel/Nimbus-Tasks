import { chromium, type FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  const { baseURL } = config.projects[0]?.use ?? {}

  if (!baseURL) {
    console.log('No baseURL defined, skipping teardown')
    return
  }

  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    console.log('🧹 Cleaning up test environment...')

    // Clean up test data if needed
    // await page.request.post(`${baseURL}/api/test/cleanup`)

    console.log('✅ Test environment cleaned up!')
  } catch (error) {
    console.error('❌ Global teardown failed:', error)
    // Don't throw error in teardown to avoid masking test failures
  } finally {
    await browser.close()
  }
}

export default globalTeardown