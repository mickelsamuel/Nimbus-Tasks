const synthetics = require('Synthetics');
const log = require('SyntheticsLogger');

const pageLoadBlueprint = async function () {
    const page = await synthetics.getPage();
    const baseUrl = '${app_url}';

    try {
        // Step 1: Load homepage
        log.info('Loading homepage');
        await synthetics.executeStep('loadHomepage', async () => {
            await page.goto(baseUrl, {
                waitUntil: ['networkidle0', 'domcontentloaded'],
                timeout: 30000
            });

            // Check if page loaded correctly
            await page.waitForSelector('body', { timeout: 10000 });
            const title = await page.title();
            log.info(`Page title: $${title}`);

            // Take screenshot
            await synthetics.takeScreenshot('homepage', 'loaded');
        });

        // Step 2: Navigate to login page
        log.info('Navigating to login page');
        await synthetics.executeStep('navigateToLogin', async () => {
            // Look for login link or button
            const loginSelector = 'a[href*="/login"], button[data-testid*="login"], [data-testid="login-button"]';
            await page.waitForSelector(loginSelector, { timeout: 10000 });
            await page.click(loginSelector);

            // Wait for login page to load
            await page.waitForLoadState('networkidle', { timeout: 15000 });
            await synthetics.takeScreenshot('login', 'page_loaded');
        });

        // Step 3: Check login form elements
        log.info('Checking login form');
        await synthetics.executeStep('checkLoginForm', async () => {
            // Check for email/username field
            const emailSelector = 'input[type="email"], input[name*="email"], input[data-testid*="email"]';
            await page.waitForSelector(emailSelector, { timeout: 10000 });

            // Check for password field
            const passwordSelector = 'input[type="password"], input[name*="password"], input[data-testid*="password"]';
            await page.waitForSelector(passwordSelector, { timeout: 10000 });

            // Check for submit button
            const submitSelector = 'button[type="submit"], input[type="submit"], button[data-testid*="submit"]';
            await page.waitForSelector(submitSelector, { timeout: 10000 });

            await synthetics.takeScreenshot('login', 'form_visible');
            log.info('Login form elements are present');
        });

        // Step 4: Check page performance
        log.info('Checking page performance');
        await synthetics.executeStep('checkPerformance', async () => {
            const metrics = await page.evaluate(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                return {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
                    firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
                };
            });

            log.info(`Performance metrics: $${JSON.stringify(metrics)}`);

            // Assert reasonable load times
            if (metrics.loadTime > 5000) {
                throw new Error(`Page load time too slow: $${metrics.loadTime}ms`);
            }

            if (metrics.firstContentfulPaint > 3000) {
                throw new Error(`First contentful paint too slow: $${metrics.firstContentfulPaint}ms`);
            }
        });

        // Step 5: Check for console errors
        log.info('Checking for console errors');
        await synthetics.executeStep('checkConsoleErrors', async () => {
            const logs = await page.evaluate(() => {
                return window.console.errors || [];
            });

            // Log any console errors but don't fail the test unless they're critical
            if (logs.length > 0) {
                log.warn(`Console errors detected: $${JSON.stringify(logs)}`);
            }
        });

        log.info('User journey completed successfully');

    } catch (error) {
        await synthetics.takeScreenshot('error', 'failed');
        throw error;
    }
};

exports.handler = async () => {
    return await synthetics.executeStep('userJourney', pageLoadBlueprint);
};