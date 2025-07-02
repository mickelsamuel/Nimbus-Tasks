const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { createDynamicRateLimit } = require('../middleware/security');
const { logUserAction } = require('../utils/auditLogger');

// Rate limit error reporting to prevent spam
const errorReportingRateLimit = createDynamicRateLimit(
  60 * 1000, // 1 minute
  10, // max 10 error reports per minute per IP
  false
);

// POST /api/errors/report - Report client-side errors
router.post('/report', errorReportingRateLimit, [
  body('error').isString().isLength({ min: 1, max: 1000 }).withMessage('Error message is required'),
  body('stack').optional().isString().isLength({ max: 5000 }),
  body('componentStack').optional().isString().isLength({ max: 5000 }),
  body('url').optional().isURL(),
  body('userAgent').optional().isString().isLength({ max: 500 }),
  body('timestamp').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid error report data',
        errors: errors.array()
      });
    }

    const {
      error,
      originalError,
      stack,
      componentStack,
      code,
      context,
      url,
      userAgent,
      timestamp
    } = req.body;

    // Log the error report
    const errorReport = {
      error,
      originalError,
      stack,
      componentStack,
      code,
      context,
      url,
      userAgent: userAgent || req.get('User-Agent'),
      timestamp: timestamp || new Date().toISOString(),
      clientIP: req.ip,
      severity: determineSeverity(error, code),
      environment: process.env.NODE_ENV || 'development'
    };

    // Log to audit system
    await logUserAction(
      null, // No user ID for client errors
      'CLIENT_ERROR_REPORTED',
      req.ip,
      req.get('User-Agent'),
      errorReport
    );

    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.error('Client Error Report:', errorReport);
    }

    // In production, you would send this to your error tracking service
    // Examples: Sentry, Bugsnag, Rollbar, etc.
    if (process.env.NODE_ENV === 'production') {
      await sendToErrorTrackingService(errorReport);
    }

    res.json({
      success: true,
      message: 'Error report received',
      reportId: generateReportId()
    });

  } catch (err) {
    console.error('Error reporting endpoint failed:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to process error report'
    });
  }
});

// GET /api/errors/health - Health check endpoint
router.get('/health', async (req, res) => {
  try {
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: err.message
    });
  }
});

// Helper function to determine error severity
function determineSeverity(error, code) {
  // High severity errors
  if (code >= 500 || error.includes('500') || error.includes('server')) {
    return 'high';
  }
  
  // Medium severity errors
  if (code >= 400 || error.includes('network') || error.includes('timeout')) {
    return 'medium';
  }
  
  // Low severity errors
  return 'low';
}

// Helper function to generate unique report ID
function generateReportId() {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper function to send to external error tracking service
async function sendToErrorTrackingService(errorReport) {
  // This would integrate with your chosen error tracking service
  // Example implementation for a generic service:
  
  try {
    // Example: Send to Sentry, Bugsnag, etc.
    if (process.env.ERROR_TRACKING_URL && process.env.ERROR_TRACKING_API_KEY) {
      const response = await fetch(process.env.ERROR_TRACKING_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ERROR_TRACKING_API_KEY}`
        },
        body: JSON.stringify(errorReport)
      });

      if (!response.ok) {
        console.error('Failed to send error to tracking service:', response.statusText);
      }
    }
  } catch (err) {
    console.error('Error sending to tracking service:', err);
  }
}

module.exports = router;