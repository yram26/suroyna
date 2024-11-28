// server/controllers/adminController.js
const User = require('../models/adminModel');

exports.getAllUsers = (req, res) => {
  User.getAllUsers((err, users) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Error fetching users', error: err });
    }
    res.json(users);
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  User.deleteUserById(id, (err) => {
    if (err) {
      console.error(`Error deleting user with ID ${id}:`, err);
      return res.status(500).json({ message: 'Error deleting user', error: err });
    }
    res.status(204).send(); // No content
  });
};