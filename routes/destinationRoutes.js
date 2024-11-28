// server/routes/destinationRoutes.js
const express = require('express');
const destinationController = require('../controllers/destinationController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware

const router = express.Router();

// Get all destinations
router.get('/destinations',  destinationController.getAllDestinations); // Protect this route

// Delete a destination by ID (if needed)
router.delete('/destinations/:id',  destinationController.deleteDestination); // Protect this route

module.exports = router;