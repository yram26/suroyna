// server/routes/dashboardRoutes.js
const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware

const router = express.Router();

// Get dashboard counts
router.get('/dashboard/counts', dashboardController.getDashboardCounts); // Protect this route

module.exports = router;