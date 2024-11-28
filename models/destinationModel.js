// server/models/destinationModel.js
const db = require('../config/db');

class Destination {
  static async getAllDestinations(callback) {
    db.query('SELECT DISTINCT destination FROM posts', (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }

  static async deleteDestinationById(destinationId, callback) {
    // Assuming you want to delete a destination, you might need to implement this based on your logic
    // For now, we will leave it empty as destinations are usually not deleted directly
    callback(null);
  }
}

module.exports = Destination;