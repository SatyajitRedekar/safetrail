const mongoose = require('mongoose');

const touristSchema = new mongoose.Schema({
  digitalId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  passport: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  riskZone: { type: String, required: true },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  blockchainHash: { type: String },
  ledgerStatus: { type: String, default: 'VERIFIED' },
  anomalyStatus: { type: String, default: 'NORMAL' },
  lastPing: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Tourist', touristSchema);
