const Resident = require('../models/Resident');
const User = require('../models/User');

// Get all residents (admin)
exports.getAllResidents = async (req, res) => {
  try {
    const residents = await Resident.find({ isActive: true }).populate('user', 'name email phone');
    res.json(residents);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get single resident
exports.getResident = async (req, res) => {
  try {
    const resident = await Resident.findOne({ user: req.params.id }).populate('user', 'name email phone');
    if (!resident) return res.status(404).json({ message: 'Resident not found' });
    res.json(resident);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Create resident profile
exports.createResident = async (req, res) => {
  try {
    const { userId, flatNumber, occupancyType, moveInDate, emergencyContact } = req.body;
    const existing = await Resident.findOne({ user: userId });
    if (existing) return res.status(400).json({ message: 'Resident profile already exists' });
    const resident = await Resident.create({ user: userId, flatNumber, occupancyType, moveInDate, emergencyContact });
    await User.findByIdAndUpdate(userId, { flatNumber });
    res.status(201).json(resident);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Update resident
exports.updateResident = async (req, res) => {
  try {
    const resident = await Resident.findOneAndUpdate({ user: req.params.id }, req.body, { new: true });
    res.json(resident);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Add family member
exports.addFamilyMember = async (req, res) => {
  try {
    const resident = await Resident.findOne({ user: req.user._id });
    resident.familyMembers.push(req.body);
    await resident.save();
    res.json(resident);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Remove family member
exports.removeFamilyMember = async (req, res) => {
  try {
    const resident = await Resident.findOne({ user: req.user._id });
    resident.familyMembers = resident.familyMembers.filter(m => m._id.toString() !== req.params.memberId);
    await resident.save();
    res.json(resident);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Add vehicle
exports.addVehicle = async (req, res) => {
  try {
    const resident = await Resident.findOne({ user: req.user._id });
    resident.vehicles.push(req.body);
    await resident.save();
    res.json(resident);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Remove vehicle
exports.removeVehicle = async (req, res) => {
  try {
    const resident = await Resident.findOne({ user: req.user._id });
    resident.vehicles = resident.vehicles.filter(v => v._id.toString() !== req.params.vehicleId);
    await resident.save();
    res.json(resident);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
