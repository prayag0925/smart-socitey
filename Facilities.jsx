import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Modal, Form, Badge, Spinner, Table } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import API from '../../services/api';
import { toast } from 'react-toastify';

const facilityIcons = { clubhouse: '🏠', gymnasium: '🏋️', hall: '🎪', pool: '🏊', sports: '⚽', garden: '🌿', other: '🏢' };

const AdminFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState('facilities');
  const [form, setForm] = useState({
    name: '', description: '', type: 'clubhouse', capacity: '',
    pricePerHour: 0, openTime: '06:00', closeTime: '22:00'
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      API.get('/facilities'),
      API.get('/facilities/bookings/all').catch(() => ({ data: [] }))
    ]).then(([f, b]) => {
      setFacilities(f.data);
      setBookings(b.data);
    }).finally(() => setLoading(false));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/facilities', form);
      toast.success('Facility added!');
      setShow(false);
      fetchData();
    } catch { toast.error('Failed to add facility'); }
  };

  const handleBookingStatus = async (id, status) => {
    try {
      await API.put(`/facilities/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}!`);
      fetchData();
    } catch { toast.error('Update failed'); }
  };

  const statusColor = { pending: 'warning', approved: 'success', rejected: 'danger', cancelled: 'secondary' };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Facility Management</h4>
        <div className="d-flex gap-2">
          <Button variant={activeTab === 'facilities' ? 'primary' : 'outline-primary'} onClick={() => setActiveTab('facilities')}>Facilities</Button>
          <Button variant={activeTab === 'bookings' ? 'primary' : 'outline-primary'} onClick={() => setActiveTab('bookings')}>Bookings</Button>
          <Button variant="success" onClick={() => setShow(true)}>+ Add Facility</Button>
        </div>
      </div>

      {loading ? <div className="text-center"><Spinner /></div> : (
        <>
          {activeTab === 'facilities' && (
            <Row className="g-3">
              {facilities.map(f => (
                <Col md={4} key={f._id}>
                  <Card className="shadow-sm h-100 border-0">
                    <Card.Body>
                      <div className="text-center fs-1 mb-2">{facilityIcons[f.type] || '🏢'}</div>
                      <Card.Title className="text-center">{f.name}</Card.Title>
                      <Card.Text className="text-muted small text-center">{f.description}</Card.Text>
                      <div className="d-flex justify-content-between text-sm mt-2">
                        <span>⏰ {f.openTime} - {f.closeTime}</span>
                        <span>👥 {f.capacity} people</span>
                      </div>
                      {f.pricePerHour > 0 && <p className="text-center mt-2 text-success fw-bold">₹{f.pricePerHour}/hr</p>}
                      <Badge bg={f.isAvailable ? 'success' : 'danger'} className="w-100 text-center mt-2">
                        {f.isAvailable ? 'Available' : 'Not Available'}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              {facilities.length === 0 && <p className="text-muted">No facilities added yet.</p>}
            </Row>
          )}

          {activeTab === 'bookings' && (
            <div className="table-responsive">
              <Table striped hover className="bg-white shadow-sm">
                <thead className="table-dark">
                  <tr><th>#</th><th>Facility</th><th>Booked By</th><th>Date</th><th>Time</th><th>Purpose</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={b._id}>
                      <td>{i + 1}</td>
                      <td>{b.facility?.name}</td>
                      <td>{b.bookedBy?.name}</td>
                      <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                      <td>{b.startTime} - {b.endTime}</td>
                      <td>{b.purpose || '-'}</td>
                      <td><Badge bg={statusColor[b.status]}>{b.status}</Badge></td>
                      <td className="d-flex gap-1">
                        {b.status === 'pending' && (
                          <>
                            <Button size="sm" variant="success" onClick={() => handleBookingStatus(b._id, 'approved')}>✓</Button>
                            <Button size="sm" variant="danger" onClick={() => handleBookingStatus(b._id, 'rejected')}>✗</Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && <tr><td colSpan={8} className="text-center text-muted">No bookings yet</td></tr>}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Add New Facility</Modal.Title></Modal.Header>
        <Form onSubmit={handleCreate}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Facility Name</Form.Label>
              <Form.Control placeholder="e.g. Club House" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="clubhouse">Club House</option>
                    <option value="gymnasium">Gymnasium</option>
                    <option value="hall">Community Hall</option>
                    <option value="pool">Swimming Pool</option>
                    <option value="sports">Sports Court</option>
                    <option value="garden">Garden Area</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control type="number" placeholder="Max people" value={form.capacity}
                    onChange={e => setForm({ ...form, capacity: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price/Hour (₹)</Form.Label>
                  <Form.Control type="number" value={form.pricePerHour}
                    onChange={e => setForm({ ...form, pricePerHour: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Open Time</Form.Label>
                  <Form.Control type="time" value={form.openTime}
                    onChange={e => setForm({ ...form, openTime: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Close Time</Form.Label>
                  <Form.Control type="time" value={form.closeTime}
                    onChange={e => setForm({ ...form, closeTime: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Facility</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminFacilities;
