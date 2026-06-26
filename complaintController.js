const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Create complaint (resident)
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const images = req.files ? req.files.map(f => f.filename) : [];
    const complaint = await Complaint.create({
      title, description, category, priority,
      raisedBy: req.user._id,
      flatNumber: req.user.flatNumber,
      images
    });
    res.status(201).json(complaint);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get all complaints (admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, category } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    const complaints = await Complaint.find(filter)
      .populate('raisedBy', 'name flatNumber')
      .populate('assignedTo', 'name')
      .sort('-createdAt');
    res.json(complaints);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get my complaints (resident)
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ raisedBy: req.user._id })
      .populate('assignedTo', 'name').sort('-createdAt');
    res.json(complaints);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get assigned complaints (maintenance)
exports.getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ assignedTo: req.user._id })
      .populate('raisedBy', 'name flatNumber').sort('-createdAt');
    res.json(complaints);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Assign complaint (admin)
exports.assignComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id,
      { assignedTo: req.body.staffId, status: 'assigned' }, { new: true });
    await Notification.create({
      user: req.body.staffId,
      title: 'New Complaint Assigned',
      message: `Complaint: ${complaint.title} has been assigned to you`,
      type: 'complaint'
    });
    res.json(complaint);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const update = { status, remarks };
    if (status === 'resolved') update.resolvedAt = new Date();
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('raisedBy', 'name');
    // Notify resident
    await Notification.create({
      user: complaint.raisedBy._id,
      title: 'Complaint Update',
      message: `Your complaint "${complaint.title}" is now ${status}`,
      type: 'complaint'
    });
    res.json(complaint);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
