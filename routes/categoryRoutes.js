// server/routes/categoryRoutes.js
const express = require('express');
const db = require('../config/db'); // Import the database connection
const router = express.Router();

// Route to get all categories
router.get('/', (req, res) => {
    const query = 'SELECT category_id, name FROM categories';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            return res.status(500).json({ message: 'Error fetching categories', error: err });
        }
        res.json(results); // Send the categories as a response
    });
});

module.exports = router;