// server/controllers/destinationController.js
const Destination = require('../models/destinationModel');

exports.getAllDestinations = (req, res) => {
  Destination.getAllDestinations((err, destinations) => {
    if (err) {
      console.error('Error fetching destinations:', err);
      return res.status(500).json({ message: 'Error fetching destinations', error: err });
    }

    // Filter out null destinations and format the response
    const formattedDestinations = destinations
      .filter(dest => dest.destination !== null)
      .map(dest => ({
        id: dest.id || dest.destination_id, // depending on your DB column name
        name: dest.destination
      }));

    res.json(formattedDestinations);
  });
};

exports.deleteDestination = (req, res) => {
  const { id } = req.params;
  Destination.deleteDestinationById(id, (err) => {
    if (err) {
      console.error(`Error deleting destination with ID ${id}:`, err);
      return res.status(500).json({ message: 'Error deleting destination', error: err });
    }
    res.status(204).send(); // No content
  });
};