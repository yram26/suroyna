// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController.js');
const authenticateToken = require('../middleware/authMiddleware');

// Add a comment to a post
router.post('/:postId/comments', authenticateToken, commentController.addComment);

// Get comments for a post
router.get('/:postId/comments', authenticateToken, commentController.getComments);

// Update a comment
router.put('/:commentId', authenticateToken, commentController.updateComment);

// Delete a comment
router.delete('/:commentId', authenticateToken, commentController.deleteComment);

router.get('/comments',  commentController.getAllComments); // Protect this route

// Delete a comment by ID
router.delete('/comments/:id',  commentController.deleteComment); // Protect this route

module.exports = router;
