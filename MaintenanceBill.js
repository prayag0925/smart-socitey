const mongoose = require('mongoose');

const maintenanceBillSchema = new mongoose.Schema({
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flatNumber: { type: String, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  penalty: { type: Number, default: 0 },
  totalAmount: { type: Number },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  dueDate: { type: Date, required: true },
  paidDate: { type: Date },
  paymentMethod: { type: String },
  transactionId: { type: String },
}, { timestamps: true });

maintenanceBillSchema.pre('save', function (next) {
  this.totalAmount = this.amount + this.penalty;
  next();
});

module.exports = mongoose.model('MaintenanceBill', maintenanceBillSchema);
