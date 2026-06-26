const Visitor = require('../models/Visitor');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Register visitor (security)
exports.registerVisitor = async (req, res) => {
  try {
    const { name, phone, purpose, flatToVisit, visitorType, vehicleNumber } = req.body;
    const resident = await User.findOne({ flatNumber: flatToVisit, role: 'resident' });
    const visitor = await Visitor.create({
      name, phone, purpose, flatToVisit,
      residentId: resident?._id,
      registeredBy: req.user._id,
      visitorType, vehicleNumber,
      photo: req.file ? req.file.filename : null
    });
    // Notify resident
    if (resident) {
      await Notification.create({
        user: resident._id,
        title: 'Visitor Approval Request',
        message: `${name} wants to visit your flat. Purpose: ${purpose}`,
        type: 'visitor',
        link: `/visitor/${visitor._id}`
      });
    }
    res.status(201).json(visitor);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Approve/Reject visitor (resident)
exports.updateVisitorStatus = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    visitor.status = req.body.status;
    await visitor.save();
    res.json(visitor);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Record exit
exports.recordExit = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id,
      { exitTime: new Date(), status: 'exited' }, { new: true });
    res.json(visitor);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get all visitors
exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().populate('registeredBy', 'name').sort('-createdAt');
    res.json(visitors);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get visitor requests for a resident
exports.getResidentVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({ residentId: req.user._id }).sort('-createdAt');
    res.json(visitors);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get today's visitors
exports.getTodayVisitors = async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const visitors = await Visitor.find({ entryTime: { $gte: today } }).sort('-entryTime');
    res.json(visitors);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
