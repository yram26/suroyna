// server/controllers/likeController.js
const Like = require('../models/likeModel');

exports.toggleLikePost = (req, res) => {
  const { postId } = req.body; // Get postId from request body
  const userId = req.user.user_id; // Assuming user ID is stored in req.user after authentication

  // Check if userId is valid
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Check if the user has already liked the post
  Like.checkIfLiked(postId, userId, (err, alreadyLiked) => {
    if (err) {
      console.error('Error checking like:', err);
      return res.status(500).json({ message: 'Error checking like', error: err });
    }

    if (alreadyLiked) {
      // If already liked, remove the like
      Like.removeLike(postId, userId, (err) => {
        if (err) {
          console.error('Error removing like:', err);
          return res.status(500).json({ message: 'Error removing like', error: err });
        }
        // After removing the like, get the updated count
        Like.countLikes(postId, (err, likeCount) => {
          if (err) {
            console.error('Error counting likes:', err);
            return res.status(500).json({ message: 'Error counting likes', error: err });
          }
          res.json({ message: 'Like removed successfully', likeCount });
        });
      });
    } else {
      // If not liked, add the like
      Like.addLike(postId, userId, (err) => {
        if (err) {
          console.error('Error adding like:', err);
          return res.status(500).json({ message: 'Error adding like', error: err });
        }
        // After adding the like, get the updated count
        Like.countLikes(postId, (err, likeCount) => {
          if (err) {
            console.error('Error counting likes:', err);
            return res.status(500).json({ message: 'Error counting likes', error: err });
          }
          res.json({ message: 'Like added successfully', likeCount });
        });
      });
    }
  });
};