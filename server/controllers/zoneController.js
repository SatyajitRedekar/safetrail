const Zone = require('../models/Zone');

exports.createZone = async (req, res) => {
  try {
    const { name, type, coordinates, density } = req.body;
    
    if (!coordinates || coordinates.length < 3) {
      return res.status(400).json({ message: 'A zone must have at least 3 coordinates to form a polygon.' });
    }

    const zone = new Zone({ name, type, coordinates, density });
    await zone.save();
    res.status(201).json(zone);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getZones = async (req, res) => {
  try {
    const zones = await Zone.find().sort('-createdAt');
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deleteZone = async (req, res) => {
  try {
    const { id } = req.params;
    await Zone.findByIdAndDelete(id);
    res.json({ message: 'Zone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
