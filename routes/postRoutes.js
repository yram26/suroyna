const express = require('express');
const multer = require('multer');
const path = require('path');
const { createPost, getAllPosts, getPostById,updatePost, deletePost, getPostsByDestination,getPostsByCategory} = require('../controllers/postController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();
const { getLatestPosts } = require('../controllers/postController');


// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
}).array('images', 5); // Ensure this matches the frontend field name

// Refactor to handle image upload and post creation in a single function
router.get('/latest', getLatestPosts);


router.post('/', authenticateToken, upload, createPost);
router.get('/', getAllPosts);
router.get('/:id', authenticateToken, getPostById);
router.put('/:id', authenticateToken, upload, updatePost); // Include upload middleware here
router.delete('/:id', authenticateToken,deletePost);
router.get('/destination/:destination',getPostsByDestination);
router.get('/category/:category',getPostsByCategory);



module.exports = router;