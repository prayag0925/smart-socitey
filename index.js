// ===== VISITOR ROUTES =====
const express = require('express');
const visitorRouter = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { registerVisitor, updateVisitorStatus, recordExit, getAllVisitors, getResidentVisitors, getTodayVisitors } = require('../controllers/visitorController');

visitorRouter.post('/', protect, authorize('security'), upload.single('photo'), registerVisitor);
visitorRouter.get('/', protect, authorize('admin', 'security'), getAllVisitors);
visitorRouter.get('/today', protect, authorize('security', 'admin'), getTodayVisitors);
visitorRouter.get('/my', protect, authorize('resident'), getResidentVisitors);
visitorRouter.put('/:id/status', protect, authorize('resident'), updateVisitorStatus);
visitorRouter.put('/:id/exit', protect, authorize('security'), recordExit);

// ===== COMPLAINT ROUTES =====
const complaintRouter = express.Router();
const { createComplaint, getAllComplaints, getMyComplaints, getAssignedComplaints, assignComplaint, updateComplaintStatus } = require('../controllers/complaintController');

complaintRouter.post('/', protect, authorize('resident'), upload.array('images', 5), createComplaint);
complaintRouter.get('/', protect, authorize('admin'), getAllComplaints);
complaintRouter.get('/my', protect, authorize('resident'), getMyComplaints);
complaintRouter.get('/assigned', protect, authorize('maintenance'), getAssignedComplaints);
complaintRouter.put('/:id/assign', protect, authorize('admin'), assignComplaint);
complaintRouter.put('/:id/status', protect, authorize('admin', 'maintenance'), updateComplaintStatus);

// ===== BILLING ROUTES =====
const billingRouter = express.Router();
const { generateBill, getMyBills, getAllBills, payBill } = require('../controllers/mainController');

billingRouter.post('/', protect, authorize('admin'), generateBill);
billingRouter.get('/', protect, authorize('admin'), getAllBills);
billingRouter.get('/my', protect, authorize('resident'), getMyBills);
billingRouter.put('/:id/pay', protect, authorize('resident'), payBill);

// ===== FACILITY ROUTES =====
const facilityRouter = express.Router();
const { getFacilities, createFacility, bookFacility, getMyBookings, updateBookingStatus, cancelBooking } = require('../controllers/mainController');

facilityRouter.get('/', protect, getFacilities);
facilityRouter.post('/', protect, authorize('admin'), createFacility);
facilityRouter.post('/book', protect, authorize('resident'), bookFacility);
facilityRouter.get('/bookings/my', protect, authorize('resident'), getMyBookings);
facilityRouter.put('/bookings/:id/status', protect, authorize('admin'), updateBookingStatus);
facilityRouter.put('/bookings/:id/cancel', protect, authorize('resident'), cancelBooking);

// ===== NOTICE ROUTES =====
const noticeRouter = express.Router();
const { createNotice, getNotices, deleteNotice } = require('../controllers/mainController');

noticeRouter.post('/', protect, authorize('admin'), createNotice);
noticeRouter.get('/', protect, getNotices);
noticeRouter.delete('/:id', protect, authorize('admin'), deleteNotice);

// ===== POLL ROUTES =====
const pollRouter = express.Router();
const { createPoll, getPolls, votePoll } = require('../controllers/mainController');

pollRouter.post('/', protect, authorize('admin'), createPoll);
pollRouter.get('/', protect, getPolls);
pollRouter.put('/:id/vote', protect, authorize('resident'), votePoll);

// ===== NOTIFICATION ROUTES =====
const notifRouter = express.Router();
const { getMyNotifications, markAsRead } = require('../controllers/mainController');

notifRouter.get('/', protect, getMyNotifications);
notifRouter.put('/read', protect, markAsRead);

// ===== DASHBOARD ROUTES =====
const dashRouter = express.Router();
const { getAdminDashboard, getResidentDashboard } = require('../controllers/mainController');

dashRouter.get('/admin', protect, authorize('admin'), getAdminDashboard);
dashRouter.get('/resident', protect, authorize('resident'), getResidentDashboard);

module.exports = { visitorRouter, complaintRouter, billingRouter, facilityRouter, noticeRouter, pollRouter, notifRouter, dashRouter };
