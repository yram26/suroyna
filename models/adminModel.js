// server/models/adminModel.js
const db = require('../config/db');

class User {
  static getAllUsers(callback) {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static deleteUserById(id, callback) {
    db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
      if (err) {
        return callback(err);
      }
      callback(null);
    });
  }
}

module.exports = User;