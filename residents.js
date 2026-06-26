const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getAllResidents, getResident, createResident, updateResident, addFamilyMember, removeFamilyMember, addVehicle, removeVehicle } = require('../controllers/residentController');

router.get('/', protect, authorize('admin'), getAllResidents);
router.post('/', protect, authorize('admin'), createResident);
router.get('/:id', protect, getResident);
router.put('/:id', protect, updateResident);
router.post('/family', protect, authorize('resident'), addFamilyMember);
router.delete('/family/:memberId', protect, authorize('resident'), removeFamilyMember);
router.post('/vehicle', protect, authorize('resident'), addVehicle);
router.delete('/vehicle/:vehicleId', protect, authorize('resident'), removeVehicle);

module.exports = router;
