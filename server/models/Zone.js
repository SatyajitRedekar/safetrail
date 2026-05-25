const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['HIGH_RISK', 'WARNING', 'RESTRICTED', 'SAFE'],
    required: true 
  },
  coordinates: [
    {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Zone', zoneSchema);
