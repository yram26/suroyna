// server/models/likeModel.js
const db = require('../config/db');

class Like {
  static async addLike(postId, userId, callback) {
    const createdAt = new Date().toISOString();
    const query = 'INSERT INTO likes (post_id, user_id, created_at) VALUES (?, ?, ?)';
    db.query(query, [postId, userId, createdAt], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static async removeLike(postId, userId, callback) {
    const query = 'DELETE FROM likes WHERE post_id = ? AND user_id = ?';
    db.query(query, [postId, userId], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static async countLikes(postId, callback) {
    const query = 'SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ?';
    db.query(query, [postId], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0].likeCount);
    });
  }

  static async checkIfLiked(postId, userId, callback) {
    const query = 'SELECT COUNT(*) AS likeExists FROM likes WHERE post_id = ? AND user_id = ?';
    db.query(query, [postId, userId], (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results[0].likeExists > 0); // Returns true if the like exists
    });
  }
}

module.exports = Like;