const MaintenanceBill = require('../models/MaintenanceBill');
const { Facility, Booking } = require('../models/Facility');
const { Notice, Poll } = require('../models/Notice');
const Notification = require('../models/Notification');
const User = require('../models/User');

// =================== BILLING ===================

exports.generateBill = async (req, res) => {
  try {
    const { residentId, flatNumber, month, year, amount, dueDate } = req.body;
    const bill = await MaintenanceBill.create({ resident: residentId, flatNumber, month, year, amount, dueDate });
    await Notification.create({ user: residentId, title: 'New Maintenance Bill', message: `Your bill for ${month} ${year} is Rs. ${amount}`, type: 'payment' });
    res.status(201).json(bill);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyBills = async (req, res) => {
  try {
    const bills = await MaintenanceBill.find({ resident: req.user._id }).sort('-createdAt');
    res.json(bills);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllBills = async (req, res) => {
  try {
    const bills = await MaintenanceBill.find().populate('resident', 'name flatNumber').sort('-createdAt');
    res.json(bills);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.payBill = async (req, res) => {
  try {
    const bill = await MaintenanceBill.findByIdAndUpdate(req.params.id,
      { status: 'paid', paidDate: new Date(), paymentMethod: req.body.paymentMethod, transactionId: req.body.transactionId },
      { new: true });
    res.json(bill);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// =================== FACILITIES ===================

exports.getFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find();
    res.json(facilities);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createFacility = async (req, res) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json(facility);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.bookFacility = async (req, res) => {
  try {
    const { facilityId, bookingDate, startTime, endTime, purpose } = req.body;
    const conflict = await Booking.findOne({ facility: facilityId, bookingDate, status: 'approved', $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }] });
    if (conflict) return res.status(400).json({ message: 'Facility already booked for this time slot' });
    const booking = await Booking.create({ facility: facilityId, bookedBy: req.user._id, bookingDate, startTime, endTime, purpose });
    res.status(201).json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ bookedBy: req.user._id }).populate('facility', 'name type').sort('-createdAt');
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('bookedBy', 'name');
    await Notification.create({ user: booking.bookedBy._id, title: 'Booking Update', message: `Your facility booking is ${req.body.status}`, type: 'booking' });
    res.json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.cancelBooking = async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.json({ message: 'Booking cancelled' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// =================== NOTICES ===================

exports.createNotice = async (req, res) => {
  try {
    const notice = await Notice.create({ ...req.body, postedBy: req.user._id });
    const residents = await User.find({ role: 'resident' });
    const notifications = residents.map(r => ({ user: r._id, title: 'New Notice', message: notice.title, type: 'notice' }));
    await Notification.insertMany(notifications);
    res.status(201).json(notice);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true }).populate('postedBy', 'name').sort('-createdAt');
    res.json(notices);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Notice deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// =================== POLLS ===================

exports.createPoll = async (req, res) => {
  try {
    const { question, options, expiresAt } = req.body;
    const poll = await Poll.create({ question, options: options.map(o => ({ text: o })), createdBy: req.user._id, expiresAt });
    res.status(201).json(poll);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ isActive: true }).populate('createdBy', 'name').sort('-createdAt');
    res.json(polls);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.votePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    const alreadyVoted = poll.options.some(o => o.votes.includes(req.user._id));
    if (alreadyVoted) return res.status(400).json({ message: 'You have already voted' });
    const option = poll.options.id(req.body.optionId);
    option.votes.push(req.user._id);
    await poll.save();
    res.json(poll);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// =================== NOTIFICATIONS ===================

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt').limit(50);
    res.json(notifications);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// =================== DASHBOARD ===================

exports.getAdminDashboard = async (req, res) => {
  try {
    const Resident = require('../models/Resident');
    const Complaint = require('../models/Complaint');
    const [totalResidents, totalComplaints, openComplaints, pendingBills, todayVisitors] = await Promise.all([
      Resident.countDocuments({ isActive: true }),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: { $in: ['open', 'assigned', 'inprogress'] } }),
      MaintenanceBill.countDocuments({ status: { $in: ['pending', 'overdue'] } }),
      (async () => { const today = new Date(); today.setHours(0, 0, 0, 0); const Visitor = require('../models/Visitor'); return Visitor.countDocuments({ entryTime: { $gte: today } }); })()
    ]);
    res.json({ totalResidents, totalComplaints, openComplaints, pendingBills, todayVisitors });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getResidentDashboard = async (req, res) => {
  try {
    const Complaint = require('../models/Complaint');
    const Visitor = require('../models/Visitor');
    const [pendingBills, activeComplaints, upcomingBookings, unreadNotifications, pendingVisitors] = await Promise.all([
      MaintenanceBill.countDocuments({ resident: req.user._id, status: { $in: ['pending', 'overdue'] } }),
      Complaint.countDocuments({ raisedBy: req.user._id, status: { $ne: 'closed' } }),
      Booking.countDocuments({ bookedBy: req.user._id, status: 'approved', bookingDate: { $gte: new Date() } }),
      Notification.countDocuments({ user: req.user._id, isRead: false }),
      Visitor.countDocuments({ residentId: req.user._id, status: 'pending' })
    ]);
    res.json({ pendingBills, activeComplaints, upcomingBookings, unreadNotifications, pendingVisitors });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
