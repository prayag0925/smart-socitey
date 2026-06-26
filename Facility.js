const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['clubhouse', 'gymnasium', 'hall', 'pool', 'sports', 'garden', 'other'] },
  capacity: { type: Number },
  pricePerHour: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  openTime: { type: String, default: '06:00' },
  closeTime: { type: String, default: '22:00' },
  image: { type: String },
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  facility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  purpose: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled'], default: 'pending' },
  totalAmount: { type: Number, default: 0 },
}, { timestamps: true });

const Facility = mongoose.model('Facility', facilitySchema);
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = { Facility, Booking };
