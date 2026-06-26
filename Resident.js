const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  age: { type: Number },
  phone: { type: String },
});

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true },
  vehicleType: { type: String, enum: ['car', 'bike', 'scooter', 'other'] },
  vehicleName: { type: String },
});

const residentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flatNumber: { type: String, required: true },
  occupancyType: { type: String, enum: ['owner', 'tenant'], default: 'owner' },
  familyMembers: [familyMemberSchema],
  vehicles: [vehicleSchema],
  moveInDate: { type: Date },
  emergencyContact: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Resident', residentSchema);
