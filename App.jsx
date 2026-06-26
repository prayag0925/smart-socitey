import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import PrivateRoute from './components/common/PrivateRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Notifications from './pages/Notifications';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminResidents from './pages/admin/Residents';
import AdminComplaints from './pages/admin/Complaints';
import AdminBilling from './pages/admin/Billing';
import AdminFacilities from './pages/admin/Facilities';
import Notices from './pages/admin/Notices';
import AdminPolls from './pages/admin/Polls';

// Resident
import { ResidentDashboard } from './pages/resident/Dashboard';
import ResidentComplaints from './pages/resident/Complaints';
import ResidentBilling from './pages/resident/Billing';
import FacilityBooking from './pages/resident/FacilityBooking';
import ResidentVisitors from './pages/resident/Visitors';
import ResidentPolls from './pages/resident/Polls';
import ResidentProfile from './pages/resident/Profile';

// Security
import SecurityVisitors from './pages/security/Visitors';

// Maintenance
import MaintenanceTasks from './pages/maintenance/Tasks';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/residents" element={<PrivateRoute roles={['admin']}><AdminResidents /></PrivateRoute>} />
        <Route path="/admin/visitors" element={<PrivateRoute roles={['admin']}><SecurityVisitors /></PrivateRoute>} />
        <Route path="/admin/complaints" element={<PrivateRoute roles={['admin']}><AdminComplaints /></PrivateRoute>} />
        <Route path="/admin/billing" element={<PrivateRoute roles={['admin']}><AdminBilling /></PrivateRoute>} />
        <Route path="/admin/facilities" element={<PrivateRoute roles={['admin']}><AdminFacilities /></PrivateRoute>} />
        <Route path="/admin/notices" element={<PrivateRoute roles={['admin']}><Notices /></PrivateRoute>} />
        <Route path="/admin/polls" element={<PrivateRoute roles={['admin']}><AdminPolls /></PrivateRoute>} />

        {/* Resident */}
        <Route path="/resident/dashboard" element={<PrivateRoute roles={['resident']}><ResidentDashboard /></PrivateRoute>} />
        <Route path="/resident/complaints" element={<PrivateRoute roles={['resident']}><ResidentComplaints /></PrivateRoute>} />
        <Route path="/resident/billing" element={<PrivateRoute roles={['resident']}><ResidentBilling /></PrivateRoute>} />
        <Route path="/resident/bookings" element={<PrivateRoute roles={['resident']}><FacilityBooking /></PrivateRoute>} />
        <Route path="/resident/visitors" element={<PrivateRoute roles={['resident']}><ResidentVisitors /></PrivateRoute>} />
        <Route path="/resident/polls" element={<PrivateRoute roles={['resident']}><ResidentPolls /></PrivateRoute>} />
        <Route path="/resident/profile" element={<PrivateRoute roles={['resident']}><ResidentProfile /></PrivateRoute>} />

        {/* Security */}
        <Route path="/security/dashboard" element={<PrivateRoute roles={['security']}><SecurityVisitors /></PrivateRoute>} />
        <Route path="/security/visitors" element={<PrivateRoute roles={['security']}><SecurityVisitors /></PrivateRoute>} />
        <Route path="/security/logs" element={<PrivateRoute roles={['security']}><SecurityVisitors /></PrivateRoute>} />

        {/* Maintenance */}
        <Route path="/maintenance/dashboard" element={<PrivateRoute roles={['maintenance']}><MaintenanceTasks /></PrivateRoute>} />
        <Route path="/maintenance/complaints" element={<PrivateRoute roles={['maintenance']}><MaintenanceTasks /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
