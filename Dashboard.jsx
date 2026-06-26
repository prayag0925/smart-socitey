// ResidentDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import API from '../../services/api';
import { useSelector } from 'react-redux';

export const ResidentDashboard = () => {
  const { user } = useSelector(s => s.auth);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/dashboard/resident').then(r => setStats(r.data));
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card className="shadow-sm border-0">
      <Card.Body className="d-flex align-items-center gap-3">
        <div className={`bg-${color} text-white rounded p-3 fs-3`}>{icon}</div>
        <div><div className="text-muted small">{title}</div><div className="fw-bold fs-4">{value ?? '...'}</div></div>
      </Card.Body>
    </Card>
  );

  return (
    <Layout>
      <h4 className="fw-bold mb-1">Welcome, {user?.name} 👋</h4>
      <p className="text-muted mb-4">Flat: {user?.flatNumber}</p>
      {!stats ? <Spinner /> : (
        <Row className="g-4">
          <Col md={4}><StatCard title="Pending Bills" value={stats.pendingBills} icon="💰" color="danger" /></Col>
          <Col md={4}><StatCard title="Active Complaints" value={stats.activeComplaints} icon="📋" color="warning" /></Col>
          <Col md={4}><StatCard title="Upcoming Bookings" value={stats.upcomingBookings} icon="🏋️" color="success" /></Col>
          <Col md={4}><StatCard title="Unread Notifications" value={stats.unreadNotifications} icon="🔔" color="info" /></Col>
          <Col md={4}><StatCard title="Pending Visitors" value={stats.pendingVisitors} icon="🚪" color="primary" /></Col>
        </Row>
      )}
    </Layout>
  );
};
