import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const adminLinks = [
  { to: '/admin/dashboard', label: '📊 Dashboard' },
  { to: '/admin/residents', label: '👥 Residents' },
  { to: '/admin/visitors', label: '🚪 Visitors' },
  { to: '/admin/complaints', label: '📋 Complaints' },
  { to: '/admin/billing', label: '💰 Billing' },
  { to: '/admin/facilities', label: '🏋️ Facilities' },
  { to: '/admin/notices', label: '📢 Notices' },
  { to: '/admin/polls', label: '🗳️ Polls' },
];

const residentLinks = [
  { to: '/resident/dashboard', label: '📊 Dashboard' },
  { to: '/resident/complaints', label: '📋 My Complaints' },
  { to: '/resident/billing', label: '💰 My Bills' },
  { to: '/resident/bookings', label: '🏋️ Facility Booking' },
  { to: '/resident/visitors', label: '🚪 My Visitors' },
  { to: '/resident/polls', label: '🗳️ Polls & Voting' },
  { to: '/resident/profile', label: '👤 My Profile' },
];

const securityLinks = [
  { to: '/security/dashboard', label: '📊 Dashboard' },
  { to: '/security/visitors', label: '🚪 Register Visitor' },
  { to: '/security/logs', label: '📋 Visitor Logs' },
];

const maintenanceLinks = [
  { to: '/maintenance/dashboard', label: '📊 Dashboard' },
  { to: '/maintenance/complaints', label: '🔧 My Tasks' },
];

const Sidebar = () => {
  const { user } = useSelector(state => state.auth);
  const linksMap = { admin: adminLinks, resident: residentLinks, security: securityLinks, maintenance: maintenanceLinks };
  const links = linksMap[user?.role] || [];

  return (
    <div className="bg-dark text-white d-flex flex-column" style={{ minHeight: '100vh', width: '220px', padding: '1rem 0', minWidth: '220px' }}>
      <Nav className="flex-column">
        {links.map(link => (
          <NavLink
            key={link.to} to={link.to}
            className={({ isActive }) =>
              `nav-link text-white px-3 py-2 ${isActive ? 'bg-primary rounded mx-2' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
