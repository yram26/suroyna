// server/routes/likeRoutes.js
const express = require('express');
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware

const router = express.Router();

// Like a post
router.post('/posts/like', authMiddleware, likeController.toggleLikePost); // Protect this route


module.exports = router;