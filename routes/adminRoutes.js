// server/routes/adminRoutes.js
const express = require('express');
const adminController = require('../controllers/adminController'); // Ensure this uses require as well

const router = express.Router();

// Get all users
router.get('/users', adminController.getAllUsers);

// Delete a user by ID
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;