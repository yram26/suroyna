const db = require('../config/db');

class User {
  static register(username, email, password, profilePhoto, callback) {
    const sql = 'INSERT INTO users (username, email, password, profile_photo) VALUES (?, ?, ?, ?)';
    db.query(sql, [username, email, password, profilePhoto], callback);
  }

  static findByUsername(username, callback) {
    // Update the SQL query to select the user_type along with other fields
    const sql = 'SELECT user_id, username, email, password, profile_photo, user_type FROM users WHERE username = ?';
    db.query(sql, [username], callback);
  }

  static findByEmail(email, callback) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], callback);
  }

static findById(id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

static updateProfile(id, username, email, profilePhoto, password) {
  return new Promise((resolve, reject) => {
      // Start building the SQL query
      let sql = 'UPDATE users SET ';
      const params = [];

      // Check which fields are provided and add them to the query
      if (username) {
          sql += 'username = ?, ';
          params.push(username);
      }
      if (email) {
          sql += 'email = ?, ';
          params.push(email);
      }
      if (profilePhoto) {
          sql += 'profile_photo = ?, ';
          params.push(profilePhoto);
      }
      if (password) {
          sql += 'password = ?, '; // Ensure you hash the password before saving
          params.push(password); // You should hash the password here
      }

      // Remove the last comma and space
      sql = sql.slice(0, -2);
      sql += ' WHERE user_id = ?';
      params.push(id); // Add the user ID to the parameters

      db.query(sql, params, (err, results) => {
          if (err) return reject(err);
          resolve(results);
      });
  });
}


static async getUserById(userId) {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT username, email, profile_photo FROM users WHERE user_id = ?',
      [userId],
      (error, results) => {
        if (error) {
          console.error('Error executing query:', error);
          return reject(error); // Reject the promise with the error
        }
        resolve(results[0]); // Resolve with the user object
      }
    );
  });
}


}

module.exports = User;