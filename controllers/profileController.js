const User = require('../models/User');
const Post = require('../models/postModel');

exports.getProfile = async (req, res) => {
    const userId = req.user.user_id; // Use user_id from the token
    console.log('User ID from token:', userId); // Log the user ID
  
    // Check if userId is undefined or null
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing from the token' });
    }
  
    try {
      const user = await User.findById(userId);
      console.log('User found:', user); // Log the user object
  
      // Check if user is found
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const posts = await Post.findByUserId(userId);
      console.log('Posts found:', posts); // Log the posts found
  
      // Return user and posts
      res.status(200).json({ user, posts });
    } catch (error) {
      console.error('Error retrieving profile:', error); // Log the error for debugging
      res.status(500).json({ error: error.message });
    }
  };

  exports.updateProfile = async (req, res) => {
    const userId = req.user.user_id; // Assuming user ID is stored in the token
    const { username, email, password } = req.body; // Get password from request body
    let profilePhoto = req.file ? `/uploads/${req.file.filename}` : null; // Get the uploaded file path

    // Basic validation
    if (!username && !email && !password) {
        return res.status(400).json({ message: 'At least one field (username, email, password) is required' });
    }

    // Hash the password if provided
    let hashedPassword = null;
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10
    }

    try {
        const result = await User.updateProfile(userId, username, email, profilePhoto, hashedPassword);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or no changes made' });
        }
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyProfile = async (req, res) => {
  const userId = req.user.user_id; // Assuming user ID is set in the request by the authentication middleware

  try {
    const user = await User.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};
