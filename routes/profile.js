// server/routes/profile.js
const express = require('express');
const { getProfile, updateProfile, getMyProfile } = require('../controllers/profileController.js');
const authenticateToken = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path'); // Import the path module
const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
    },
});

const upload = multer({ storage });


router.get('/', authenticateToken, getProfile);
router.get('/myprofile', authenticateToken, getMyProfile );
router.put('/', authenticateToken, upload.single('profilePhoto'), updateProfile); // Use multer middleware here

module.exports = router;