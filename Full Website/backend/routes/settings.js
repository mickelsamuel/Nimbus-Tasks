const express = require('express');
const preferencesRouter = require('./preferences');
const router = express.Router();

// Simple proxy to preferences routes
// This is to maintain compatibility with frontend calls to /settings

// Proxy all requests to preferences router
router.use('/', preferencesRouter);

module.exports = router;