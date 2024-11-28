const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res) => {
  const { username, email, password, profilePhoto } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: err });

    User.register(username, email, hash, profilePhoto, (error, results) => {
      if (error) return res.status(500).json({ error });
      res.status(201).json({ message: 'User registered successfully!' });
    });
  });
};

const login = (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (error, results) => {
    if (error) return res.status(500).json({ error });
    if (results.length === 0) return res.status(401).json({ message: 'User not found' });

    const user = results[0]; // Get the user object from the results
    console.log('User object retrieved:', user); // Log the user object

    // Compare password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err });
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      // Create JWT token with user_id
      const token = jwt.sign(
        { user_id: user.user_id, username: user.username },
        process.env.JWT_SECRET
      );
      console.log('User ID during login:', user.user_id); // Ensure this is not null or undefined
      console.log('Generated Token:', token); // Log token
      res.status(200).json({
        token,
        user: {
          id: user.user_id, // Ensure this matches the property in the user object
          username: user.username,
          email: user.email,
          profilePhoto: user.profile_photo,
          user_type: user.user_type, // Include user_type in the response
        },
      });
    });
  });
};

module.exports = { register, login };