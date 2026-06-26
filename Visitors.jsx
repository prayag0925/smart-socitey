import React, { useEffect, useState } from 'react';
import { Table, Badge, Button, Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import Layout from '../../components/layout/Layout';
import API from '../../services/api';
import { toast } from 'react-toastify';

const SecurityVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', purpose: '', flatToVisit: '', visitorType: 'visitor', vehicleNumber: '' });

  useEffect(() => { fetchVisitors(); }, []);

  const fetchVisitors = () => {
    setLoading(true);
    API.get('/visitors/today').then(r => setVisitors(r.data)).finally(() => setLoading(false));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/visitors', form);
      toast.success('Visitor registered! Waiting for resident approval.');
      setShow(false);
      setForm({ name: '', phone: '', purpose: '', flatToVisit: '', visitorType: 'visitor', vehicleNumber: '' });
      fetchVisitors();
    } catch { toast.error('Registration failed'); }
  };

  const handleExit = async (id) => {
    try {
      await API.put(`/visitors/${id}/exit`);
      toast.success('Exit recorded');
      fetchVisitors();
    } catch { toast.error('Failed'); }
  };

  const statusColor = { pending: 'warning', approved: 'success', rejected: 'danger', exited: 'secondary' };

  return (
    <Layout>
      <div className="d-flex justify-content-between mb-4">
        <h4 className="fw-bold">Today's Visitors</h4>
        <Button onClick={() => setShow(true)}>+ Register Visitor</Button>
      </div>
      {loading ? <Spinner /> : (
        <div className="table-responsive">
          <Table striped hover className="bg-white shadow-sm">
            <thead className="table-dark">
              <tr><th>#</th><th>Name</th><th>Phone</th><th>Purpose</th><th>Flat</th><th>Entry</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {visitors.map((v, i) => (
                <tr key={v._id}>
                  <td>{i + 1}</td><td>{v.name}</td><td>{v.phone}</td>
                  <td>{v.purpose}</td><td>{v.flatToVisit}</td>
                  <td>{new Date(v.entryTime).toLocaleTimeString()}</td>
                  <td><Badge bg={statusColor[v.status]}>{v.status}</Badge></td>
                  <td>
                    {v.status === 'approved' && !v.exitTime && (
                      <Button size="sm" variant="outline-secondary" onClick={() => handleExit(v._id)}>Exit</Button>
                    )}
                  </td>
                </tr>
              ))}
              {visitors.length === 0 && <tr><td colSpan={8} className="text-center text-muted">No visitors today</td></tr>}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>Register New Visitor</Modal.Title></Modal.Header>
        <Form onSubmit={handleRegister}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Visitor Name</Form.Label>
                  <Form.Control placeholder="Full name" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control placeholder="Phone number" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} required />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Flat to Visit</Form.Label>
                  <Form.Control placeholder="e.g. A-101" value={form.flatToVisit}
                    onChange={e => setForm({ ...form, flatToVisit: e.target.value })} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Visitor Type</Form.Label>
                  <Form.Select value={form.visitorType} onChange={e => setForm({ ...form, visitorType: e.target.value })}>
                    <option value="visitor">Visitor</option>
                    <option value="delivery">Delivery</option>
                    <option value="service">Service</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Purpose of Visit</Form.Label>
              <Form.Control placeholder="Reason for visiting" value={form.purpose}
                onChange={e => setForm({ ...form, purpose: e.target.value })} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Vehicle Number (optional)</Form.Label>
              <Form.Control placeholder="Vehicle number if any" value={form.vehicleNumber}
                onChange={e => setForm({ ...form, vehicleNumber: e.target.value })} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Register & Notify Resident</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Layout>
  );
};

export default SecurityVisitors;
