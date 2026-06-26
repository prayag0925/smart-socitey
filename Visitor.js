const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  purpose: { type: String, required: true },
  flatToVisit: { type: String, required: true },
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'exited'], default: 'pending' },
  visitorType: { type: String, enum: ['visitor', 'delivery', 'service'], default: 'visitor' },
  vehicleNumber: { type: String },
  photo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
