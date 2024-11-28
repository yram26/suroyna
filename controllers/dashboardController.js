// server/controllers/dashboardController.js
const db = require('../config/db');

exports.getDashboardCounts = (req, res) => {
  const counts = {};

  // Query to count users
  db.query('SELECT COUNT(*) AS userCount FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user count', error: err });
    counts.userCount = results[0].userCount;

    // Query to count destinations
    db.query('SELECT COUNT(*) AS destinationCount FROM posts', (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching destination count', error: err });
      counts.destinationCount = results[0].destinationCount;

      // Query to count posts
      db.query('SELECT COUNT(*) AS postCount FROM posts', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching post count', error: err });
        counts.postCount = results[0].postCount;

        // Query to count comments
        db.query('SELECT COUNT(*) AS commentCount FROM comments', (err, results) => {
          if (err) return res.status(500).json({ message: 'Error fetching comment count', error: err });
          counts.commentCount = results[0].commentCount;

          // Query to count likes (assuming you have a likes table)
          db.query('SELECT COUNT(*) AS likeCount FROM likes', (err, results) => {
            if (err) return res.status(500).json({ message: 'Error fetching like count', error: err });
            counts.likeCount = results[0].likeCount;

            // Query to count views (assuming you have a views table)
            db.query('SELECT SUM(views) AS viewCount FROM posts', (err, results) => {
              if (err) return res.status(500).json({ message: 'Error fetching view count', error: err });
              counts.viewCount = results[0].viewCount;

              // Send the counts as a response
              res.json(counts);
            });
          });
        });
      });
    });
  });
};