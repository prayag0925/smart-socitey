import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Modal, Form, Badge, Spinner, Table } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import API from '../../services/api';
import { toast } from 'react-toastify';

const facilityIcons = { clubhouse: '🏠', gymnasium: '🏋️', hall: '🎪', pool: '🏊', sports: '⚽', garden: '🌿', other: '🏢' };
const statusColor = { pending: 'warning', approved: 'success', rejected: 'danger', cancelled: 'secondary' };

const FacilityBooking = () => {
  const [facilities, setFacilities] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState('facilities');
  const [form, setForm] = useState({ bookingDate: '', startTime: '', endTime: '', purpose: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([API.get('/facilities'), API.get('/facilities/bookings/my')])
      .then(([f, b]) => { setFacilities(f.data); setMyBookings(b.data); })
      .finally(() => setLoading(false));
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await API.post('/facilities/book', { facilityId: selected._id, ...form });
      toast.success('Booking request sent! Waiting for approval.');
      setShow(false);
      setForm({ bookingDate: '', startTime: '', endTime: '', purpose: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await API.put(`/facilities/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchData();
    } catch { toast.error('Failed'); }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Facility Booking</h4>
        <div className="d-flex gap-2">
          <Button variant={activeTab === 'facilities' ? 'primary' : 'outline-primary'} onClick={() => setActiveTab('facilities')}>Available Facilities</Button>
          <Button variant={activeTab === 'bookings' ? 'primary' : 'outline-primary'} onClick={() => setActiveTab('bookings')}>My Bookings</Button>
        </div>
      </div>

      {loading ? <div className="text-center"><Spinner /></div> : (
        <>
          {activeTab === 'facilities' && (
            <Row className="g-3">
              {facilities.map(f => (
                <Col md={4} key={f._id}>
                  <Card className="shadow-sm border-0 h-100">
                    <Card.Body className="text-center">
                      <div className="fs-1 mb-2">{facilityIcons[f.type] || '🏢'}</div>
                      <Card.Title>{f.name}</Card.Title>
                      <Card.Text className="text-muted small">{f.description}</Card.Text>
                      <div className="text-muted small mb-2">⏰ {f.openTime} - {f.closeTime}</div>
                      {f.capacity && <div className="text-muted small mb-2">👥 Capacity: {f.capacity}</div>}
                      {f.pricePerHour > 0 && <div className="text-success fw-bold mb-2">₹{f.pricePerHour}/hr</div>}
                      <Button
                        variant={f.isAvailable ? 'primary' : 'secondary'}
                        disabled={!f.isAvailable}
                        className="w-100"
                        onClick={() => { setSelected(f); setShow(true); }}
                      >
                        {f.isAvailable ? 'Book Now' : 'Not Available'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              {facilities.length === 0 && <p className="text-muted">No facilities available yet.</p>}
            </Row>
          )}

          {activeTab === 'bookings' && (
            <div className="table-responsive">
              <Table striped hover className="bg-white shadow-sm">
                <thead className="table-dark">
                  <tr><th>#</th><th>Facility</th><th>Date</th><th>Time</th><th>Purpose</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {myBookings.map((b, i) => (
                    <tr key={b._id}>
                      <td>{i + 1}</td>
                      <td>{b.facility?.name} {facilityIcons[b.facility?.type]}</td>
                      <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                      <td>{b.startTime} - {b.endTime}</td>
                      <td>{b.purpose || '-'}</td>
                      <td><Badge bg={statusColor[b.status]}>{b.status}</Badge></td>
                      <td>
                        {(b.status === 'pending' || b.status === 'approved') && (
                          <Button size="sm" variant="outline-danger" onClick={() => handleCancel(b._id)}>Cancel</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {myBookings.length === 0 && <tr><td colSpan={7} className="text-center text-muted">No bookings yet</td></tr>}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book {selected?.name} {facilityIcons[selected?.type]}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBook}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Booking Date</Form.Label>
              <Form.Control type="date" value={form.bookingDate} min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm({ ...form, bookingDate: e.target.value })} required />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control type="time" value={form.startTime}
                    onChange={e => setForm({ ...form, startTime: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control type="time" value={form.endTime}
                    onChange={e => setForm({ ...form, endTime: e.target.value })} required />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Purpose</Form.Label>
              <Form.Control placeholder="Purpose of booking" value={form.purpose}
                onChange={e => setForm({ ...form, purpose: e.target.value })} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Send Booking Request</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Layout>
  );
};

export default FacilityBooking;
