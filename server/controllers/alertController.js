const Alert = require('../models/Alert');

const Tourist = require('../models/Tourist');

exports.createAlert = async (req, res) => {
  try {
    const { digitalId, latitude, longitude } = req.body;
    
    const tourist = await Tourist.findOne({ digitalId: digitalId.toUpperCase() });
    if (!tourist) {
      return res.status(404).json({ message: 'Invalid Digital ID. Tourist not found.' });
    }

    const alert = new Alert({ 
      touristId: tourist._id, 
      location: { lat: latitude, lng: longitude } 
    });
    await alert.save();

    const populatedAlert = await Alert.findById(alert._id).populate('touristId');

    if (req.io) {
      req.io.emit('newAlert', populatedAlert);
    }

    res.status(201).json({ message: 'SOS Alert Broadcasted to Patrol Units', alert: populatedAlert });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().populate('touristId').sort('-createdAt');
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    await Alert.findByIdAndDelete(id);
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
